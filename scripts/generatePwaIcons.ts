import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deflateSync } from 'node:zlib';

type Color = readonly [red: number, green: number, blue: number, alpha: number];

type Canvas = {
  data: Uint8Array;
  size: number;
};

const sourceSize = 512;
const outputDirectory = path.resolve('public/icons');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const iconSpecs = [
  { fileName: 'apple-touch-icon.png', size: 180 },
  { fileName: 'icon-192.png', size: 192 },
  { fileName: 'icon-512.png', size: 512 },
] as const;

const colors = {
  background: [23, 107, 77, 255],
  check: [255, 255, 255, 255],
  marker: [255, 255, 255, 255],
  smallMarker: [215, 239, 228, 255],
} as const satisfies Record<string, Color>;

const crcTable = Array.from({ length: 256 }, (_, tableIndex) => {
  let value = tableIndex;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xed_b8_83_20 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

const crc32 = (buffer: Buffer) => {
  let value = 0xff_ff_ff_ff;

  for (const byte of buffer) {
    value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  }

  return (value ^ 0xff_ff_ff_ff) >>> 0;
};

const createChunk = (type: string, data: Buffer) => {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);

  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));

  return Buffer.concat([length, typeBuffer, data, checksum]);
};

const createCanvas = (size: number): Canvas => ({
  data: new Uint8Array(size * size * 4),
  size,
});

const scale = (canvas: Canvas, value: number) => (value / sourceSize) * canvas.size;

const setPixel = ({ data, size }: Canvas, x: number, y: number, color: Color) => {
  if (x < 0 || y < 0 || x >= size || y >= size) {
    return;
  }

  const index = (y * size + x) * 4;

  data[index] = color[0];
  data[index + 1] = color[1];
  data[index + 2] = color[2];
  data[index + 3] = color[3];
};

const drawRoundedRect = (canvas: Canvas, x: number, y: number, width: number, height: number, radius: number, color: Color) => {
  const left = Math.round(scale(canvas, x));
  const top = Math.round(scale(canvas, y));
  const right = Math.round(scale(canvas, x + width));
  const bottom = Math.round(scale(canvas, y + height));
  const scaledRadius = scale(canvas, radius);

  for (let pixelY = top; pixelY < bottom; pixelY += 1) {
    for (let pixelX = left; pixelX < right; pixelX += 1) {
      const nearestX = Math.max(left + scaledRadius, Math.min(pixelX, right - scaledRadius));
      const nearestY = Math.max(top + scaledRadius, Math.min(pixelY, bottom - scaledRadius));
      const distanceX = pixelX - nearestX;
      const distanceY = pixelY - nearestY;

      if (distanceX * distanceX + distanceY * distanceY <= scaledRadius * scaledRadius) {
        setPixel(canvas, pixelX, pixelY, color);
      }
    }
  }
};

const getDistanceToSegment = (pixelX: number, pixelY: number, startX: number, startY: number, endX: number, endY: number) => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;
  const projection = Math.max(0, Math.min(1, ((pixelX - startX) * deltaX + (pixelY - startY) * deltaY) / lengthSquared));
  const closestX = startX + projection * deltaX;
  const closestY = startY + projection * deltaY;

  return Math.hypot(pixelX - closestX, pixelY - closestY);
};

const drawLine = (canvas: Canvas, startX: number, startY: number, endX: number, endY: number, strokeWidth: number, color: Color) => {
  const scaledStartX = scale(canvas, startX);
  const scaledStartY = scale(canvas, startY);
  const scaledEndX = scale(canvas, endX);
  const scaledEndY = scale(canvas, endY);
  const scaledStrokeWidth = scale(canvas, strokeWidth);
  const margin = Math.ceil(scaledStrokeWidth / 2);
  const left = Math.floor(Math.min(scaledStartX, scaledEndX) - margin);
  const top = Math.floor(Math.min(scaledStartY, scaledEndY) - margin);
  const right = Math.ceil(Math.max(scaledStartX, scaledEndX) + margin);
  const bottom = Math.ceil(Math.max(scaledStartY, scaledEndY) + margin);

  for (let pixelY = top; pixelY <= bottom; pixelY += 1) {
    for (let pixelX = left; pixelX <= right; pixelX += 1) {
      if (getDistanceToSegment(pixelX, pixelY, scaledStartX, scaledStartY, scaledEndX, scaledEndY) <= scaledStrokeWidth / 2) {
        setPixel(canvas, pixelX, pixelY, color);
      }
    }
  }
};

const drawIcon = (size: number) => {
  const canvas = createCanvas(size);

  drawRoundedRect(canvas, 0, 0, 512, 512, 96, colors.background);
  drawRoundedRect(canvas, 96, 96, 92, 92, 18, colors.marker);
  drawRoundedRect(canvas, 324, 96, 92, 92, 18, colors.marker);
  drawRoundedRect(canvas, 96, 324, 92, 92, 18, colors.marker);
  drawRoundedRect(canvas, 224, 108, 44, 44, 10, colors.smallMarker);
  drawRoundedRect(canvas, 244, 196, 72, 44, 10, colors.smallMarker);
  drawRoundedRect(canvas, 360, 244, 44, 44, 10, colors.smallMarker);
  drawRoundedRect(canvas, 240, 344, 44, 44, 10, colors.smallMarker);
  drawLine(canvas, 206, 274, 248, 316, 34, colors.check);
  drawLine(canvas, 248, 316, 334, 214, 34, colors.check);

  return canvas;
};

const encodePng = ({ data, size }: Canvas) => {
  const header = Buffer.alloc(13);
  const rowLength = size * 4 + 1;
  const raw = Buffer.alloc(rowLength * size);

  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;

  for (let row = 0; row < size; row += 1) {
    raw[row * rowLength] = 0;
    Buffer.from(data.buffer, row * size * 4, size * 4).copy(raw, row * rowLength + 1);
  }

  return Buffer.concat([pngSignature, createChunk('IHDR', header), createChunk('IDAT', deflateSync(raw)), createChunk('IEND', Buffer.alloc(0))]);
};

const run = async () => {
  await mkdir(outputDirectory, { recursive: true });

  await Promise.all(
    iconSpecs.map(async ({ fileName, size }) => {
      const filePath = path.join(outputDirectory, fileName);
      const icon = encodePng(drawIcon(size));

      await writeFile(filePath, icon);
    }),
  );

  console.log(`Generated ${iconSpecs.length} PWA PNG icons in ${outputDirectory}`);
};

await run();

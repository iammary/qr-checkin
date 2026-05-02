import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';

type Format = 'png' | 'svg';

type GeneratorOptions = {
  format: Format;
  idField: string;
  input: string;
  output: string;
};

type SourceRecord = Record<string, unknown>;

type GeneratedQrCode = {
  file: string;
  id: string;
  payload: string;
};

const defaultOptions: GeneratorOptions = {
  format: 'svg',
  idField: 'id',
  input: 'src/data/facilities.json',
  output: 'public/qr/facilities',
};

const parseArgs = (args: string[]) => {
  let options = { ...defaultOptions };

  for (const [index, arg] of args.entries()) {
    const next = args[index + 1];

    if (arg === '--input' && next) {
      options = { ...options, input: next };
      continue;
    }

    if (arg === '--output' && next) {
      options = { ...options, output: next };
      continue;
    }

    if (arg === '--id-field' && next) {
      options = { ...options, idField: next };
      continue;
    }

    if (arg === '--format' && (next === 'svg' || next === 'png')) {
      options = { ...options, format: next };
    }
  }

  return options;
};

const readRecords = async (inputPath: string) => {
  const raw = await readFile(inputPath, 'utf8');
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new TypeError(`Expected ${inputPath} to contain a JSON array.`);
  }

  return parsed as SourceRecord[];
};

const getRecordId = (record: SourceRecord, idField: string) => {
  const id = record[idField];

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new TypeError(`Every record must include a non-empty string "${idField}" field.`);
  }

  return id.trim();
};

const toFileName = (id: string, format: Format) => `${id.replaceAll(/[^a-zA-Z0-9._-]/g, '-')}.${format}`;

const writeQrCode = async ({ format, id, output }: GeneratorOptions & { id: string }) => {
  const file = toFileName(id, format);
  const outputPath = path.join(output, file);

  if (format === 'svg') {
    const svg = await QRCode.toString(id, {
      errorCorrectionLevel: 'M',
      margin: 2,
      type: 'svg',
      width: 512,
    });
    await writeFile(outputPath, svg, 'utf8');
  } else {
    await QRCode.toFile(outputPath, id, {
      errorCorrectionLevel: 'M',
      margin: 2,
      type: 'png',
      width: 512,
    });
  }

  return { file, id, payload: id } satisfies GeneratedQrCode;
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(options.input);
  const outputPath = path.resolve(options.output);
  const records = await readRecords(inputPath);

  await mkdir(outputPath, { recursive: true });

  const generated = await Promise.all(
    records.map(record => {
      const id = getRecordId(record, options.idField);

      return writeQrCode({ ...options, id, output: outputPath });
    }),
  );

  await writeFile(path.join(outputPath, 'manifest.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), items: generated }, null, 2)}\n`, 'utf8');

  console.log(`Generated ${generated.length} QR ${options.format.toUpperCase()} files in ${outputPath}`);
};

await run();

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const certificateDirectory = '.certificates';
const certificatePath = path.join(certificateDirectory, 'local.pem');
const certificateKeyPath = path.join(certificateDirectory, 'local-key.pem');
const certificateRootPath = path.join(certificateDirectory, 'mkcert-rootCA.cer');
const outputDirectory = path.resolve('out');
const port = Number(process.env.PORT ?? 4173);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
} as const;

const getLocalIpv4Addresses = () =>
  Object.values(networkInterfaces())
    .flatMap(entries => entries ?? [])
    .filter(entry => entry.family === 'IPv4' && !entry.internal)
    .map(entry => entry.address);

const runRequiredCommand = (command: string, args: string[]) => {
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.error) {
    console.error(`Failed to run ${command}. Make sure it is installed and available on PATH.`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const getMkcertRoot = () => {
  const result = spawnSync('mkcert', ['-CAROOT'], { encoding: 'utf8' });

  if (result.status !== 0) {
    return;
  }

  return result.stdout.trim();
};

const getFilePath = (request: Request) => {
  const url = new URL(request.url);
  const decodedPath = decodeURIComponent(url.pathname);
  const normalizedPath = decodedPath.endsWith('/') ? `${decodedPath}index.html` : decodedPath;
  const candidatePath = path.resolve(outputDirectory, `.${normalizedPath}`);

  if (!candidatePath.startsWith(outputDirectory)) {
    return path.join(outputDirectory, '404.html');
  }

  if (existsSync(candidatePath)) {
    return candidatePath;
  }

  const directoryIndexPath = path.join(candidatePath, 'index.html');

  if (existsSync(directoryIndexPath)) {
    return directoryIndexPath;
  }

  return path.join(outputDirectory, '404.html');
};

const createResponse = (filePath: string) => {
  const file = Bun.file(filePath);
  const extension = path.extname(filePath);
  const contentType = mimeTypes[extension as keyof typeof mimeTypes] ?? 'application/octet-stream';
  const status = filePath.endsWith('404.html') ? 404 : 200;

  return new Response(file, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': contentType,
    },
    status,
  });
};

if (!existsSync(outputDirectory)) {
  console.error('Missing out/. Run `bun run build` before `bun run serve:phone`.');
  process.exit(1);
}

const localIpv4Addresses = getLocalIpv4Addresses();

if (localIpv4Addresses.length === 0) {
  console.error('No LAN IPv4 address was found. Connect to Wi-Fi and try again.');
  process.exit(1);
}

mkdirSync(certificateDirectory, { recursive: true });

runRequiredCommand('mkcert', [
  '-key-file',
  certificateKeyPath,
  '-cert-file',
  certificatePath,
  'localhost',
  '127.0.0.1',
  '::1',
  ...localIpv4Addresses,
]);

const mkcertRoot = getMkcertRoot();

if (mkcertRoot) {
  copyFileSync(path.join(mkcertRoot, 'rootCA.pem'), certificateRootPath);
}

Bun.serve({
  fetch: request => createResponse(getFilePath(request)),
  hostname: '0.0.0.0',
  port,
  tls: {
    cert: Bun.file(certificatePath),
    key: Bun.file(certificateKeyPath),
  },
});

console.log(`Static phone preview running at https://${localIpv4Addresses[0]}:${port}`);
console.log(`Install and trust ${certificateRootPath} on the phone if Safari warns about the certificate.`);

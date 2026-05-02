import { copyFileSync, mkdirSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const certificateDirectory = '.certificates';
const certificatePath = path.join(certificateDirectory, 'local.pem');
const certificateKeyPath = path.join(certificateDirectory, 'local-key.pem');
const certificateRootPath = path.join(certificateDirectory, 'mkcert-rootCA.cer');
const nextBinary = path.join('node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');

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

const localIpv4Addresses = getLocalIpv4Addresses();

if (localIpv4Addresses.length === 0) {
  console.error('No LAN IPv4 address was found. Connect to Wi-Fi or pass a reachable host manually with NEXT_ALLOWED_DEV_ORIGINS.');
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

console.log(`Allowed phone dev origins: ${localIpv4Addresses.join(', ')}`);
console.log(`Phone URL: https://${localIpv4Addresses[0]}:3000`);

const nextProcess = spawn(
  nextBinary,
  ['dev', '--experimental-https', '--experimental-https-key', certificateKeyPath, '--experimental-https-cert', certificatePath, '--hostname', '0.0.0.0'],
  {
    env: {
      ...process.env,
      NEXT_ALLOWED_DEV_ORIGINS: localIpv4Addresses.join(','),
    },
    stdio: 'inherit',
  },
);

nextProcess.on('exit', code => {
  process.exit(code ?? 0);
});

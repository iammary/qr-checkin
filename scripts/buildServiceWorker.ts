import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve('out');
const serviceWorkerPath = path.join(outputDirectory, 'sw.js');
const startMarker = '/* __PRECACHE_MANIFEST_START__ */';
const endMarker = '/* __PRECACHE_MANIFEST_END__ */';

const walkFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(directory, entry.name);

      return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
    }),
  );

  return files.flat();
};

const toUrlPath = (filePath: string) => `/${path.relative(outputDirectory, filePath).split(path.sep).join('/')}`;

const getUrlAliases = (filePath: string) => {
  const urlPath = toUrlPath(filePath);

  if (urlPath === '/index.html') {
    return ['/', urlPath];
  }

  if (urlPath.endsWith('/index.html')) {
    return [urlPath.replace(/index\.html$/, ''), urlPath];
  }

  return [urlPath];
};

const getPrecacheFiles = async () => {
  const files = await walkFiles(outputDirectory);

  return files.filter(filePath => path.relative(outputDirectory, filePath) !== 'sw.js').toSorted();
};

const getPrecacheUrls = (files: string[]) => [...new Set(files.flatMap(filePath => getUrlAliases(filePath)))].toSorted();

const getBuildHash = async (files: string[]) => {
  const hash = createHash('sha256');

  for (const filePath of files) {
    const relativePath = path.relative(outputDirectory, filePath);
    const fileStats = await stat(filePath);

    hash.update(relativePath);
    hash.update(String(fileStats.size));
    hash.update(await readFile(filePath));
  }

  return hash.digest('hex').slice(0, 12);
};

const replacePrecacheManifest = (serviceWorker: string, cacheVersion: string, precacheUrls: string[]) => {
  const start = serviceWorker.indexOf(startMarker);
  const end = serviceWorker.indexOf(endMarker);

  if (start === -1 || end === -1 || end < start) {
    throw new Error('Unable to find service worker precache manifest markers.');
  }

  const manifest = [
    startMarker,
    `const CACHE_VERSION = 'facility-checkin-${cacheVersion}';`,
    `const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};`,
    endMarker,
  ].join('\n');

  return `${serviceWorker.slice(0, start)}${manifest}${serviceWorker.slice(end + endMarker.length)}`;
};

const run = async () => {
  const files = await getPrecacheFiles();
  const precacheUrls = getPrecacheUrls(files);
  const cacheVersion = await getBuildHash(files);
  const serviceWorker = await readFile(serviceWorkerPath, 'utf8');
  const updatedServiceWorker = replacePrecacheManifest(serviceWorker, cacheVersion, precacheUrls);

  await writeFile(serviceWorkerPath, updatedServiceWorker, 'utf8');

  console.log(`Injected ${precacheUrls.length} precache URLs into out/sw.js using cache ${cacheVersion}.`);
};

await run();

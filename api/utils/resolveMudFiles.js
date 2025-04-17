import fs from 'fs';
import path from 'path';

const basePath = path.resolve('data');

export function resolveMudFile(mudName, filename) {
  const localPath = path.join(basePath, 'mud-data', mudName, filename);
  const fallbackPath = path.join(basePath, 'mud-data-default', mudName, filename);

  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath, 'utf-8');
  } else if (fs.existsSync(fallbackPath)) {
    return fs.readFileSync(fallbackPath, 'utf-8');
  } else {
    return `File "${filename}" not found for mud "${mudName}".`;
  }
}

export function listAvailableMUDs() {
  const fallbackDir = path.join(basePath, 'mud-data-default');
  const localDir = path.join(basePath, 'mud-data');

  const localMuds = fs.existsSync(localDir)
    ? fs.readdirSync(localDir).filter(name => fs.statSync(path.join(localDir, name)).isDirectory())
    : [];

  const fallbackMuds = fs.existsSync(fallbackDir)
    ? fs.readdirSync(fallbackDir).filter(name => fs.statSync(path.join(fallbackDir, name)).isDirectory())
    : [];

  const allMuds = new Set([...fallbackMuds, ...localMuds]);
  return Array.from(allMuds);
}

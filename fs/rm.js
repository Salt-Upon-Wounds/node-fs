import fs from 'node:fs/promises'
import path from 'path'

export async function rm(path_to_file) {
  const full_path = path.resolve(path_to_file)
  try {
    await fs.unlink(full_path);
  } catch {
    console.log('Operation failed');
  }
}

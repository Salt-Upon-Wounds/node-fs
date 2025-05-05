import fs from 'node:fs/promises'
import path from 'path'

export async function rm(path_to_file) {
  try {
    const full_path = path.resolve(path_to_file)
    await fs.rm(full_path, { recursive: true });
  } catch {
    console.log('Operation failed');
  }
}

import fs from 'node:fs/promises'
import path from 'path'

export async function mkdir(new_directory_name) {
  try {
    const full_path = path.resolve(new_directory_name)
    await fs.stat(full_path)
    console.log('Operation failed')
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.mkdir(full_path)
      } catch {
        console.log('Operation failed')
      }
    } else {
      console.log('Operation failed')
    }
  }
}

import fs from 'node:fs/promises'
import path from 'path'

export async function rn(path_to_file, new_filename) {
  try {
    const oldpath = path.resolve(path_to_file)
    const newpath = path.resolve(new_filename)
    await fs.stat(oldpath)
    try {
      await fs.stat(newpath)
      console.log('Operation failed')
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.rename(oldpath, newpath)
      } else {
        console.log('Operation failed')
      }
    }
  } catch {
    console.log('Operation failed')
  }
}

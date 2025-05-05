import fs from 'node:fs/promises'
import path from 'path'

export async function add(new_file_name) {
  const full_path = path.resolve(new_file_name)
  try {
    await fs.stat(full_path)
    console.log('Operation failed')
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.writeFile(full_path, '', { flag: 'wx' })
      } catch {
        console.log('Operation failed')
      }
    } else {
      console.log('Operation failed')
    }
  }
}

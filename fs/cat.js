import { stdout } from "node:process"
import fs from 'node:fs/promises'
import path from 'path'
import { createReadStream } from "node:fs"

export async function cat(path_to_file) {
  try {
    const full_path = path.resolve(path_to_file)
    if (!(await fs.stat(full_path)).isFile()) throw Error()
    await new Promise((resolve, reject) => {
      const stream = createReadStream(full_path, { encoding: 'utf8' })
      stream.on('error', reject)
      stream.on('end', resolve)
      stream.pipe(stdout)
    })
  } catch {
    console.log('Operation failed')
  }
}

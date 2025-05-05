import fs from 'node:fs/promises'
import path from 'path'
import { createReadStream } from "node:fs"
import { createHash } from "node:crypto"

export async function hash(path_to_file) {
  try {
    const full_path = path.resolve(path_to_file)
    if (!(await fs.stat(full_path)).isFile()) throw Error()

    await new Promise((resolve, reject) => {
      const stream = createReadStream(full_path)
      const hash = createHash('sha256')

      stream.on('error', reject)
      stream.on('data', (chunk) => hash.update(chunk))
      stream.on('end', () => {
        console.log(hash.digest('hex'))
        resolve()
      })
    })
  } catch {
    console.log('Operation failed');
  }
}

import fs from 'node:fs/promises'
import path from 'path'
import { createReadStream, createWriteStream } from "node:fs"

export async function cp(path_to_file, path_to_new_directory) {
  try {
    const oldpath = path.resolve(path_to_file)
    const newpath = path.resolve(path_to_new_directory)
    const full_newpath = path.resolve(path_to_new_directory, path.basename(oldpath))
    await fs.stat(oldpath)
    if (
      (await fs.stat(newpath)).isFile() || await fs.stat(full_newpath).then((el) => el.isFile()).catch(() => 0)
    ) {
      throw Error()
    }
    await new Promise((resolve, reject) => {
      const readStream = createReadStream(oldpath);
      const writeStream = createWriteStream(full_newpath);

      readStream.on('error', reject);
      writeStream.on('error', reject);
      readStream.pipe(writeStream);
      writeStream.on('finish', resolve);
    }).catch(() => {
      console.log('Operation failed')
    })
  } catch {
    console.log('Operation failed')
  }
}

import fs from 'node:fs/promises'
import path from 'path'
import { createReadStream, createWriteStream } from "node:fs"
import zlib from 'node:zlib'
import { rm } from './fs/index.js'

export async function compress(path_to_file, path_to_destination) {
  await compresser(path_to_file, path_to_destination, zlib.createBrotliCompress())
}

export async function decompress(path_to_file, path_to_destination) {
  await compresser(path_to_file, path_to_destination, zlib.createBrotliDecompress())
}

async function compresser(path_to_file, new_filename, brotli) {
  try {
    const oldpath = path.resolve(path_to_file)
    const newpath = path.resolve(new_filename)
    await fs.stat(oldpath)
    try {
      await fs.stat(newpath)
      console.log('Operation failed')
    } catch (err) {
      if (err.code === 'ENOENT') {
        await new Promise((resolve, reject) => {
          const inStream = createReadStream(oldpath)
          const outStream = createWriteStream(newpath)
          inStream.pipe(brotli).pipe(outStream)
          inStream.on('error', reject)
          outStream.on('error', reject)
          outStream.on('finish', resolve)
        })
        await rm(path_to_file)
      } else {
        console.log('Operation failed')
      }
    }
  } catch {
    console.log('Operation failed')
  }
}

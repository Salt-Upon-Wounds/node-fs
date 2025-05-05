import process, { chdir, stdout } from "node:process"
import readline from 'node:readline'
import os from 'node:os'
import fs from 'node:fs/promises'
import path from 'path'
import { createReadStream, createWriteStream } from "node:fs"
import { createHash } from "node:crypto"
import zlib from 'node:zlib'

const homeDir = os.homedir();

chdir(homeDir)

const dirMsg = () => console.log(`You are currently in ${process.cwd()}`)

const username = process.argv.find(
  el => el.startsWith('--username')
)?.split('=')[1] ?? 'Anon'
console.log(`Welcome to the File Manager, ${username}!`)
dirMsg()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`)
})

process.on('SIGINT', () => {
  rl.close()
})

rl.on('line', async (line) => {
  const regex = /[^\s"]+|"([^"]*)"/g
  const result = []
  let match
  while ((match = regex.exec(line)) !== null) result.push(match[1] || match[0])
  const [cmd, ...args] = result
  switch (cmd) {
    case 'up': up(); break
    case 'cd': cd(args[0]); break
    case '.exit': rl.close(); return
    case 'ls': await ls(); break
    case 'cat': await cat(args[0]); break
    case 'add': await add(args[0]); break
    case 'mkdir': await mkdir(args[0]); break
    case 'rn': await rn(args[0], args[1]); break
    case 'cp': await cp(args[0], args[1]); break
    case 'mv': await mv(args[0], args[1]); break
    case 'rm': await rm(args[0]); break
    case 'os': _os(args[0]); break
    case 'hash': await hash(args[0]); break
    case 'compress': await compress(args[0], args[1]); break
    case 'decompress': await decompress(args[0], args[1]); break
    default: console.log('Invalid input')
  }
  console.log()
  dirMsg()
})

function up() {
  chdir('..')
}

function cd(arg) {
  try {
    chdir(path.resolve(arg))
  } catch {
    console.log('Operation failed')
  }
}

async function ls() {
  try {
    const content = await fs.readdir(process.cwd(), { withFileTypes: true })
    const dirs = []
    const files = []
    for (const el of content) {
      if (el.isDirectory()) {
        dirs.push({ Name: el.name, Type: 'directory'})
      } else if (el.isFile()) {
        files.push({ Name: el.name, Type: 'file'})
      }
    }
    const comparer = (a, b) => a.Name.localeCompare(b.Name)
    console.table([...dirs.sort(comparer), ...files.sort(comparer)])
  } catch {
    console.log('Operation failed')
  }
}

async function cat(path_to_file) {
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

async function add(new_file_name) {
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

async function mkdir(new_directory_name) {
  const full_path = path.resolve(new_directory_name)
  try {
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

async function rn(path_to_file, new_filename) {
  const oldpath = path.resolve(path_to_file)
  const newpath = path.resolve(new_filename)
  try {
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

async function cp(path_to_file, path_to_new_directory) {
  const oldpath = path.resolve(path_to_file)
  const newpath = path.resolve(path_to_new_directory)
  const full_newpath = path.resolve(path_to_new_directory, path.basename(oldpath))
  try {
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

async function mv(path_to_file, path_to_new_directory) {
  await cp(path_to_file, path_to_new_directory).then(() => rm(path_to_file))
}

async function rm(path_to_file) {
  const full_path = path.resolve(path_to_file)
  try {
    await fs.unlink(full_path);
  } catch {
    console.log('Operation failed');
  }
}

function _os(arg) {
  switch (arg) {
    case '--EOL': console.log(JSON.stringify(os.EOL)); break
    case '--cpus': print_cpus(); break
    case '--homedir': console.log(homeDir); break
    case '--username': console.log(os.userInfo().username); break
    case '--architecture': console.log(process.arch); break
    default: console.log('Invalid input')
  }
}

function print_cpus() {
  const cpus = os.cpus()

  console.log(`CPUs: ${cpus.length}`)
  cpus.forEach((cpu, index) => {
    const ghz = (cpu.speed / 1000).toFixed(2)
    console.log(`CPU ${index + 1}: ${cpu.model}, ${ghz} GHz`)
  })
}

async function hash(path_to_file) {
  const full_path = path.resolve(path_to_file)

  try {
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

async function compress (path_to_file, path_to_destination) {
  await compresser(path_to_file, path_to_destination, zlib.createBrotliCompress())
}

async function decompress (path_to_file, path_to_destination) {
  await compresser(path_to_file, path_to_destination, zlib.createBrotliDecompress())
}

async function compresser(path_to_file, new_filename, brotli) {
  const oldpath = path.resolve(path_to_file)
  const newpath = path.resolve(new_filename)
  try {
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

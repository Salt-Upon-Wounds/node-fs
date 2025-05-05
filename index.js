import process, { chdir, stdout } from "node:process"
import readline from 'node:readline'
import os from 'node:os'
import fs from 'node:fs/promises'
import path from 'path'
import { createReadStream } from "node:fs"

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
  const input = line.split(' ')
  const args = input.slice(1)
  const cmd = input[0]
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
    case 'mv': await mv(); break
    case 'rm': await rm(); break
    case 'os': _os(); break
    case 'hash': hash(); break
    case 'compress': compress(); break
    case 'decompress': decompress(); break
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
    chdir(arg)
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
    await stat(full_path)
    console.log('Operation failed')
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await writeFile(fullPath, '', { flag: 'wx' })
      } catch {
        console.log('Operation failed')
      }
    } else {
      console.log('Operation failed')
    }
  }
}

async function mkdir(new_directory_name) {
  const full_path = path.resolve(new_file_name)
  try {
    await stat(full_path)
    console.log('Operation failed')
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await mkdir(fullPath)
      } catch {
        console.log('Operation failed')
      }
    } else {
      console.log('Operation failed')
    }
  }
}

function rn(path_to_file, new_filename) {

}

function cp(path_to_file, path_to_new_directory) {

}

function mv(path_to_file, path_to_new_directory) {

}

function rm(path_to_file) {

}

function _os(arg) {
  /*Get EOL (default system End-Of-Line) and print it to console
    os --EOL
    Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
    os --cpus
    Get home directory and print it to console
    os --homedir
    Get current system user name (Do not confuse with the username that is set when the application starts) and print it to console
    os --username
    Get CPU architecture for which Node.js binary has compiled and print it to console
    os --architecture */
}

function hash(path_to_file) {

}

function compress (path_to_file, path_to_destination) {

}

function decompress (path_to_file, path_to_destination) {

}

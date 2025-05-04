import process, { chdir } from "node:process"
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline'
import os from 'node:os'
import fs from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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
    case 'cat': cat(); break
    case 'add': add(); break
    case 'mkdir': mkdir(); break
    case 'rn': rn(); break
    case 'cp': cp(); break
    case 'mv': mv(); break
    case 'rm': rm(); break
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
  /* Print in console list of all files and folders in current directory. List should contain:
    list should contain files and folder names (for files - with extension)
    folders and files are sorted in alphabetical order ascending, but list of folders goes first
    type of directory content should be marked explicitly (e.g. as a corresponding column value) */
}

function cat(path_to_file) {
  //read file content
}

function add(new_file_name) {

}

function mkdir(new_directory_name) {

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

import process, { chdir } from "node:process"
import readline from 'node:readline'
import os from 'node:os'
import { cd, up, ls } from "./nav.js";
import { add, cat, cp, mv, mkdir, rn, rm } from './fs/index.js'
import { compress, decompress } from "./archiv.js"
import { hash } from "./hash.js"
import { _os } from "./os.js"

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

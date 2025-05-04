import process, { chdir } from "node:process"
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline'
import os from 'node:os'

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

rl.on('line', (line) => {
  const input = line.split(' ')
  const args = input.slice(1)
  const cmd = input[0]
  if (cmd === 'up') {
    chdir('..')
  }
  dirMsg()
})

import process from "node:process"
import os from 'node:os'

export function _os(arg) {
  switch (arg) {
    case '--EOL': console.log(JSON.stringify(os.EOL)); break
    case '--cpus': print_cpus(); break
    case '--homedir': console.log(os.homedir()); break
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

import process, { chdir } from "node:process"
import fs from 'node:fs/promises'
import path from 'path'

export function up() {
  chdir('..')
}

export function cd(arg) {
  try {
    chdir(path.resolve(arg))
  } catch {
    console.log('Operation failed')
  }
}

export async function ls() {
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

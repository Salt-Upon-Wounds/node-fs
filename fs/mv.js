import { cp } from './cp.js'
import { rm } from './rm.js'

export async function mv(path_to_file, path_to_new_directory) {
  await cp(path_to_file, path_to_new_directory).then(() => rm(path_to_file))
}

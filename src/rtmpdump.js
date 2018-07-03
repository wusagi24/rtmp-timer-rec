import path from 'path';
import { spawn } from 'child_process';

import * as CONST from './const';

const libsDirPath = path.join(path.resolve(''), CONST.LIBS_DIR);
const rtmpdumpExePath = path.join(libsDirPath, CONST.RTMP_EXE);

/**
 * @param {?Object<string, string|null>} cmd_args コマンド引数
 * @return {Object} ChildProcess
 */
export function rtmpdump(cmd_args = {}) {
  const args_list = Object.entries(cmd_args).reduce((args, arg) => args.concat(arg), []);
  const rd = spawn(rtmpdumpExePath, args_list);

  rd.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  rd.stderr.on('data', (data) => {
    console.log(`${data}`);
  });

  rd.on('close', (code) => {
    console.log(`rtmpdump process exited with code ${code}`);
  });

  return rd;
}

export default rtmpdump;

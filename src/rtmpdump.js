import path from 'path';
import { spawn } from 'child_process';

import * as CONST from './const/common';

const libsDirPath = path.join(path.resolve(''), CONST.LIBS_DIR);
const rtmpdumpExePath = path.join(libsDirPath, CONST.RTMP_EXE);

/**
 * RTMPDump の js ラッパー
 *
 * @param {?Object<string, string|null>} cmdArgs コマンド引数
 * @return {ChildProcess} ChildProcess
 */
export function rtmpdump(cmdArgs = {}) {
  /* eslint-disable no-console */
  const argsList = Object.entries(cmdArgs).reduce((args, arg) => args.concat(arg), []);
  const rd = spawn(rtmpdumpExePath, argsList, { shell: true });

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
  /* eslint-enable no-console */
}

export default rtmpdump;

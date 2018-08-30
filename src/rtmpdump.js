'use strict';

import path from 'path';
import { spawn } from 'child_process';

import * as CONST from './const/common';

const libsDirPath = path.join(path.resolve(''), CONST.LIBS_DIR);
const rtmpdumpExePath = path.join(libsDirPath, CONST.RTMP_EXE);

/**
 * RTMPDump の js ラッパー
 *
 * @param {?Object<string, string|null>} cmdArgs コマンド引数
 * @param {?(chunk: any) => void} stdout 標準出力の listener
 * @param {?(chunk: any) => void} stderr 標準エラーの listener
 * @param {?(code: number, signal: string) => void} close コマンド終了の listener
 * @return {ChildProcess} ChildProcess
 */
export function rtmpdump(cmdArgs = {}, stdout = null, stderr = null, close = null) {
  const argsList = Object.entries(cmdArgs).reduce((args, arg) => args.concat(arg), []);

  const listenerStdout = (stdout)
    ? stdout
    : (data) => {
      /* eslint-disable no-console */
      console.log(`${data}`);
      /* eslint-enable no-console */
    };
  const listenerStderr = (stderr)
    ? stderr
    : (data) => {
      /* eslint-disable no-console */
      console.log(`${data}`);
      /* eslint-enable no-console */
    };
  const listenerClose = (close)
    ? close
    : (data) => {
      /* eslint-disable no-console */
      console.log(`rtmpdump process exited with code ${data}`);
      /* eslint-enable no-console */
    };

  const rd = spawn(rtmpdumpExePath, argsList, { shell: true });

  rd.stdout.on('data', listenerStdout);
  rd.stderr.on('data', listenerStderr);
  rd.on('close', listenerClose);

  return rd;
}

export default rtmpdump;

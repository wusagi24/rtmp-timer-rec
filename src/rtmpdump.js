'use strict';

import path from 'path';
import { spawn } from 'child_process';

import * as CONST from './const/common';

const libsDirPath = path.join(path.resolve(''), CONST.LIBS_DIR);
const rtmpdumpExePath = (() => {
  switch (process.platform) {
    case CONST.PLATFORM.WINDOWS: {
      return path.join(libsDirPath, CONST.PLATFORM.WINDOWS, `${CONST.RTMP_EXE}.exe`);
    }
    default: {
      throw new Error('rtmp: no match platform');
    }
  }
})();

/**
 * RTMPDump の js ラッパー
 *
 * @param {?Object<string, string|null>} cmdArgs コマンド引数
 * @param {?{ stdout: (chunk: any) => void, stderr: (chunk: any) => void, close: (code: number, signal: string) => void }} listeners
 * @return {ChildProcess} ChildProcess
 */
export function rtmpdump(cmdArgs = {}, listeners = {}) {
  const argsList = Object.entries(cmdArgs).reduce((args, arg) => args.concat(arg), []);

  const listenerStdout = (listeners.stdout)
    ? listeners.stdout
    : (data) => {
      /* eslint-disable no-console */
      console.log(`${data}`);
      /* eslint-enable no-console */
    };
  const listenerStderr = (listeners.stderr)
    ? listeners.stderr
    : (data) => {
      /* eslint-disable no-console */
      console.log(`${data}`);
      /* eslint-enable no-console */
    };
  const listenerClose = (listeners.close)
    ? listeners.close
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

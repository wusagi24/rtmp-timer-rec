'use strict';

import path from 'path';
import { spawn } from 'child_process';

import * as CONST from './const/common';

const libsDirPath = path.join(path.resolve(''), CONST.LIBS_DIR);
const ffmpegExePath = path.join(libsDirPath, CONST.FFMPEG_EXE);

/**
 * FFmpeg の js ラッパー
 *
 * @param {?Object<string, string|null>} cmdArgs コマンド引数
 * @param {?{ stdout: (chunk: any) => void, stderr: (chunk: any) => void, close: (code: number, signal: string) => void }} listeners
 * @return {ChildProcess} ChildProcess
 */
export function ffmpeg(cmdArgs = {}, listeners = {}) {
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

  const ffmg = spawn(ffmpegExePath, argsList, { shell: true });

  ffmg.stdout.on('data', listenerStdout);
  ffmg.stderr.on('data', listenerStderr);
  ffmg.on('close', listenerClose);

  return ffmg;
}

export default ffmpeg;

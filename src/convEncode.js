import path from 'path';

import ffmpeg from './ffmpeg';
import * as ENCODE from './const/encode';

/**
 * @param {string} inputFile 入力ファイルのフルパス
 * @param {?string} type 変換先エンコード
 * @param {?string} outDir 出力ディレクトリ
 * @param {?string} outName 出力ファイル名
 */
export function convEncode(inputFile, type = ENCODE.ENCODE_EXT.MP4, outDir = null, outName = null) {
  switch (type) {
    case ENCODE.ENCODE_EXT.MP4: {
      convEncodeMP4(inputFile, outDir, outName);
      break;
    }
    default: {
      convEncodeMP4(inputFile, outDir, outName);
      break;
    }
  }
}

/**
 * @param {string} inputFile
 * @param {?string} outDir
 * @param {?string} outName
 */
function convEncodeMP4(inputFile, outDir = null, outName = null) {
  const { dir, name } = path.parse(inputFile);

  const encodedFilePath = path.format({
    dir: (outDir) ? outDir : dir,
    name: (outName) ? outName : name,
    ext: `.${ENCODE.ENCODE_EXT.MP4}`,
  });

  const ffmgArgs = {
    '-i': `"${inputFile}"`,
    '-vcodec': ENCODE.VIDEO_CODEC,
    '-acodec': ENCODE.AUDIO_CODEC,
  };

  ffmpeg(encodedFilePath, ffmgArgs);
}

export default convEncode;

import path from 'path';

import assert from 'power-assert';

import { getPrograms, getRTMPSourcePath, CONFIG_DIR, PROGRAM_DATA } from '../src/index';

describe('index', () => {
  const programsJsonPath = path.join(path.resolve(''), CONFIG_DIR, PROGRAM_DATA);

  describe('getPrograms()', () => {
    let programs = null;

    before(() => {
      programs = require(programsJsonPath);
    });

    it('Json ファイルをオブジェクトとして読み込む', () => {
      const loadPrograms = getPrograms();
      assert.deepEqual(loadPrograms, programs);
    });
  });

  describe('getRTMPSourcePath()', () => {
    it('RTMP の URL を取得できる', async () => {
      const result = await getRTMPSourcePath();
      const RTMP_PATTERN = /^rtmp:\/\/.*$/;

      assert.strictEqual(typeof result, 'string');
      assert.ok(RTMP_PATTERN.test(result));
    });
  });
});

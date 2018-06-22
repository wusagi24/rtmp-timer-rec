import path from 'path';

import assert from 'power-assert';

import * as CONST from '../src/const';
import * as TEST_CONST from './const';
import { getPrograms, getRTMPSourcePath } from '../src/index';

describe('index', () => {
  const programsJsonPath = path.join(path.resolve(''), CONST.CONFIG_DIR, CONST.PROGRAM_DATA);

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

      assert.strictEqual(typeof result, 'string');
      assert.ok(TEST_CONST.RTMP_PATTERN.test(result));
    });
  });
});

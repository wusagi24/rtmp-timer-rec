import path from 'path';

import assert from 'power-assert';

import * as CONST from '../src/const';
import * as TEST_CONST from './const';
import { getSchedules, getRTMPSourcePath } from '../src/index';

describe('index', () => {
  const schedulesJsonPath = path.join(path.resolve(''), CONST.CONFIG_DIR, CONST.SCHEDULES_DATA);

  describe('getSchedules()', () => {
    let schedules = null;

    before(() => {
      schedules = require(schedulesJsonPath);
    });

    it('録音スケジュールファイルを正しく読み込めている');
  });

  describe('getRTMPSourcePath()', () => {
    it('RTMP の URL を取得できる', async () => {
      const result = await getRTMPSourcePath();

      assert.strictEqual(typeof result, 'string');
      assert.ok(TEST_CONST.RTMP_PATTERN.test(result));
    });
  });
});

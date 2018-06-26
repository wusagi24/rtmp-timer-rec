import path from 'path';

import assert from 'power-assert';

import * as CONST from '../src/const';
import * as CONFIG from '../config/config.json';
import * as TEST_CONST from './const';
import { takeStreamUrl, fetchStreamUrl } from '../src/AgqrStreamUrl';

const DUMMY_DATA_DIR_PATH = path.join(path.resolve(''), CONST.TEST_DIR, TEST_CONST.DUMMY_DATA_DIR);
const DUMMY_OBJ_PATH = path.join(DUMMY_DATA_DIR_PATH, 'agqrServerInfo.js');

describe('AgqrStreamUrl', () => {
  describe('takeStreamUrl()', () => {
    let obj = {};

    before(() => {
      obj = require(DUMMY_OBJ_PATH).default;
    });

    it('オブジェクトから RTMP の URL を取り出せる', () => {
      const result = takeStreamUrl(obj);

      assert.strictEqual(typeof result, 'string');
      assert.ok(TEST_CONST.RTMP_PATTERN.test(result));
    });
  });

  describe('fetchStreamUrl()', () => {
    it('RTMP の URL が返ってくる', async () => {
      const result = await fetchStreamUrl(CONFIG.AGQR_SERVER_INFO_URL);

      assert.strictEqual(typeof result, 'string');
      assert.ok(TEST_CONST.RTMP_PATTERN.test(result));
    });
  });
});

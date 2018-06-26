import path from 'path';
import fs from 'fs';

import assert from 'power-assert';

import * as CONST from '../src/const';
import * as CONFIG from '../config/config.json';
import * as TEST_CONST from './const';
import { loadLocalJsonData, fetchXmlStr, parseXml } from '../src/util';

const DUMMY_DATA_DIR_PATH = path.join(path.resolve(''), CONST.TEST_DIR, TEST_CONST.DUMMY_DATA_DIR);
const DUMMY_XML_PATH = path.join(DUMMY_DATA_DIR_PATH, 'agqrServerInfo.xml');
const DUMMY_OBJ_PATH = path.join(DUMMY_DATA_DIR_PATH, 'agqrServerInfo.js');

describe('Util', () => {
  describe('loadLocalJsonData(path)', () => {
    const jsonPath = path.join(path.resolve(''), CONST.CONFIG_DIR, CONST.SCHEDULES_DATA);

    let jsonData = {};

    before(() => {
      jsonData = require(jsonPath);
    });

    it('Json ファイルをオブジェクトとして読み込む', async () => {
      const loadData = await loadLocalJsonData(jsonPath);
      assert.deepEqual(loadData, jsonData);
    });
  });

  describe('fetchXmlStr()', () => {
    it('URL から XML を文字列として取得できる', async () => {
      const result = await fetchXmlStr(CONFIG.AGQR_SERVER_INFO_URL);
      assert.strictEqual(typeof result, 'string');
    });
  });

  describe('parseXml(xml)', () => {
    let xml = '';
    let obj = {};

    before(() => {
      xml = fs.readFileSync(DUMMY_XML_PATH, CONST.ENCODE_TYPE);
      obj = require(DUMMY_OBJ_PATH).default;
    });

    it('XML 文字列が正しくオブジェクトに変換されている', async () => {
      const result = await parseXml(xml);
      assert.deepEqual(result, obj);
    });
  });
});

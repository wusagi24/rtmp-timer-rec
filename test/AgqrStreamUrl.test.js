import path from 'path';
import fs from 'fs';

import assert from 'power-assert';

import * as CONST from '../src/const';
import * as CONFIG from '../config/config.json';
import * as TEST_CONST from './const';
import { fetchXmlStr, xmlStrToJs, takeStreamUrl, fetchStreamUrl } from '../src/AgqrStreamUrl';

const DUMMY_DATA_DIR_PATH = path.join(path.resolve(''), CONST.TEST_DIR, TEST_CONST.DUMMY_DATA_DIR);
const DUMMY_XML_PATH = path.join(DUMMY_DATA_DIR_PATH, 'agqrServerInfo.xml');
const DUMMY_OBJ_PATH = path.join(DUMMY_DATA_DIR_PATH, 'agqrServerInfo.js');

describe('AgqrStreamUrl', () => {

  describe('fetchXmlStr()', () => {
    it('URL から XML を文字列として取得できる', async () => {
      const result = await fetchXmlStr(CONFIG.SERVER_INFO_URL);
      assert.strictEqual(typeof result, 'string');
    });
  });

  describe('xmlStrToJs()', () => {
    let xml = '';
    let obj = {};

    before(() => {
      xml = fs.readFileSync(DUMMY_XML_PATH, 'utf-8');
      obj = require(DUMMY_OBJ_PATH).default;
    });

    it('XML 文字列が正しくオブジェクトに変換されている', async () => {
      const result = await xmlStrToJs(xml);
      assert.deepEqual(result, obj);
    });
  });

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
      const result = await fetchStreamUrl(CONFIG.SERVER_INFO_URL);

      assert.strictEqual(typeof result, 'string');
      assert.ok(TEST_CONST.RTMP_PATTERN.test(result));
    });
  });

});

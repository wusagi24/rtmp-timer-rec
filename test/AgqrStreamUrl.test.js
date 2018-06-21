import path from 'path';
import fs from 'fs';

import assert from 'power-assert';
import { SERVER_INFO_URL, fetchXmlStr, xmlStrToJs, takeStreamUrl, fetchStreamUrl } from '../src/AgqrStreamUrl';

const RTMP_PATTERN = /^rtmp:\/\/.*$/;

const DUMMY_DATA_DIR = path.join(path.resolve(''), 'test', 'dummy');
const DUMMY_XML_PATH = path.join(DUMMY_DATA_DIR, 'agqrServerInfo.xml');
const DUMMY_OBJ_PATH = path.join(DUMMY_DATA_DIR, 'agqrServerInfo.js');

describe('AgqrStreamUrl', () => {

  describe('fetchXmlStr()', () => {
    it('URL から XML を文字列として取得できる', async () => {
      const result = await fetchXmlStr(SERVER_INFO_URL);
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
      assert.ok(RTMP_PATTERN.test(result));
    });
  });

  describe('fetchStreamUrl()', () => {
    it('RTMP の URL が返ってくる', async () => {
      const result = await fetchStreamUrl(SERVER_INFO_URL);

      assert.strictEqual(typeof result, 'string');
      assert.ok(RTMP_PATTERN.test(result));
    });
  });

});

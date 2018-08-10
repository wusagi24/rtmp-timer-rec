'use strict';

import assert from 'assert';
import fs from 'fs';
import path from 'path';

import * as CONST from '../src/const/common';
import * as CONFIG from '../config/config.json';
import * as TEST_CONST from './const';
import { loadLocalJsonData, formatSchedule, fetchXmlStr, parseXml } from '../src/util';

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

  describe('formatSchedule(schedule)', () => {
    it('値が数字列の場合、数値に置換する', () => {
      const inputSchedule = {
        title: 'hoge',
        source: 'rtmp://example.com/fugo',
        recTime: '30',
        startTime: {
          dayOfWeek: '*',
          month: '10',
          date: '26',
          hours: '08',
          minutes: '12',
          seconds: '00',
        },
      };

      const formattedSchedule = formatSchedule(inputSchedule);

      assert.strictEqual(formattedSchedule.title, inputSchedule.title);

      assert.strictEqual(formattedSchedule.source, inputSchedule.source);

      const parseRecTime = Number.parseInt(inputSchedule.recTime);
      assert.strictEqual(formattedSchedule.recTime, parseRecTime);

      const formattedStartTime = formattedSchedule.startTime;

      assert.strictEqual(formattedStartTime.dayOfWeek, inputSchedule.startTime.dayOfWeek);

      const parseMonth = Number.parseInt(inputSchedule.startTime.month);
      assert.strictEqual(formattedStartTime.month, parseMonth);

      const parseDate = Number.parseInt(inputSchedule.startTime.date);
      assert.strictEqual(formattedStartTime.date, parseDate);

      const parseHours = Number.parseInt(inputSchedule.startTime.hours);
      assert.strictEqual(formattedStartTime.hours, parseHours);

      const parseMinutes = Number.parseInt(inputSchedule.startTime.minutes);
      assert.strictEqual(formattedStartTime.minutes, parseMinutes);

      const parseSeconds = Number.parseInt(inputSchedule.startTime.seconds);
      assert.strictEqual(formattedStartTime.seconds, parseSeconds);
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

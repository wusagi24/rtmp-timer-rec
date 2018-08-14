'use strict';

import assert from 'assert';
import fs from 'fs';
import path from 'path';

import * as CONST from '../src/const/common';
import * as CONFIG from '../config/config.json';
import * as TEST_CONST from './const';
import { WILDCARD_CHAR } from '../src/const/setCrons';
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

      const intRecTime = 30;
      assert.strictEqual(formattedSchedule.recTime, intRecTime);

      const formattedStartTime = formattedSchedule.startTime;

      assert.strictEqual(formattedStartTime.dayOfWeek, WILDCARD_CHAR);

      const intMonth = 10;
      assert.strictEqual(formattedStartTime.month, intMonth);

      const intDate = 26;
      assert.strictEqual(formattedStartTime.date, intDate);

      const intHours = 8;
      assert.strictEqual(formattedStartTime.hours, intHours);

      const intMinutes = 12;
      assert.strictEqual(formattedStartTime.minutes, intMinutes);

      const intSeconds = 0;
      assert.strictEqual(formattedStartTime.seconds, intSeconds);
    });

    it('日付指定の不足項目をワイルドカードで補完する', () => {
      const notExistDayOfWeek = {
        title: 'hoge',
        source: 'rtmp://example.com/fugo',
        recTime: 30,
        startTime: {
          month: 10,
          date: 26,
          hours: 8,
          minutes: 12,
          seconds: 0,
        },
      };
      const completeDayOfWeek = formatSchedule(notExistDayOfWeek).startTime;
      assert.ok(completeDayOfWeek.hasOwnProperty('dayOfWeek'));
      assert.strictEqual(completeDayOfWeek.dayOfWeek, WILDCARD_CHAR);

      const notExistMonthDate = {
        title: 'hoge',
        source: 'rtmp://example.com/fugo',
        recTime: 30,
        startTime: {
          dayOfWeek: 0,
          hours: 8,
          minutes: 12,
          seconds: 0,
        },
      };
      const completeMonthDate = formatSchedule(notExistMonthDate).startTime;
      assert.ok(completeMonthDate.hasOwnProperty('month'));
      assert.strictEqual(completeMonthDate.month, WILDCARD_CHAR);
      assert.ok(completeMonthDate.hasOwnProperty('date'));
      assert.strictEqual(completeMonthDate.date, WILDCARD_CHAR);
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

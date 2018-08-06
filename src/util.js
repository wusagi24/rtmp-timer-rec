import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';
import { parseString } from 'xml2js';

import * as CONST from './const/common';
import * as CONST_SET_CRONS from './const/setCrons';
import * as ERROR from './const/error';

/**
 * @typedef {Object} Schedule
 * @property {string} title
 * @property {number} sourceType
 * @property {string} [url]
 * @property {number} recTime
 * @property {Object} startTime
 * @property {number|string} startTime.dayOfWeek
 * @property {number|string} startTime.month
 * @property {number|string} startTime.date
 * @property {number|string} startTime.hours
 * @property {number|string} startTime.minutes
 * @property {number|string} startTime.seconds
 */

/**
 * ローカルの json データをオブジェクトの形で都度読み込む（キャッシュしない）
 *
 * @param {string} path json ファイルの絶対パス
 * @return {Promise<Object, Error>} オブジェクト化したデータを返す Promise オブジェクト
 */
export function loadLocalJsonData(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, CONST.ENCODE_TYPE, (err, json) => {
      if (err) reject(err);

      const obj = JSON.parse(json);
      return resolve(obj);
    });
  });
}

/**
 * スケジュールデータのバリデーション
 *
 * @param {Schedule} schedule
 * @return {string[]}
 */
export function validateSchedule(schedule) {
  const validateScheduleTitle = (schedule) => {
    if (!schedule.hasOwnProperty('title')) {
      return [ ERROR.SCHEDULE_TITLE_NOT_EXIST ];
    }

    const { title } = schedule;

    if (typeof title !== 'string') {
      return [ ERROR.SCHEDULE_TITLE_INVALID_TYPE ];
    }

    return [];
  };

  const validateScheduleSource = (schedule) => {
    if (!schedule.hasOwnProperty('source')) {
      return [ ERROR.SCHEDULE_SOURCE_NOT_EXIST ];
    }

    const { source } = schedule;

    if (typeof source !== 'string') {
      return [ ERROR.SCHEDULE_SOURCE_INVALID_TYPE ];
    }

    if (!/^rtmp:\/\/.*$/.test(source)
      && CONST_SET_CRONS.SOURCE_TYPE.indexOf(source) === -1) {
      return [ ERROR.SCHEDULE_SOURCE_INVALID_VAL ];
    }

    return [];
  };

  const validateScheduleRecTime = (schedule) => {
    if (!schedule.hasOwnProperty('recTime')) {
      return [ ERROR.SCHEDULE_RECTIME_NOT_EXIST ];
    }

    const recTime = Number(String(schedule.recTime));

    if (Number.isNaN(recTime) || !Number.isInteger(recTime)) {
      return [ ERROR.SCHEDULE_RECTIME_INVALID_VAL ];
    }

    if (recTime < CONST_SET_CRONS.RECTIME_RANGE_MIN) {
      return [ ERROR.SCHEDULE_RECTIME_MIN_LESS ];
    }

    if (recTime > CONST_SET_CRONS.RECTIME_RANGE_MAX) {
      return [ ERROR.SCHEDULE_RECTIME_MAX_OVER ];
    }

    return [];
  };

  const error = [].concat(
    validateScheduleTitle(schedule),
    validateScheduleSource(schedule),
    validateScheduleRecTime(schedule),
  );

  return error;
}

/**
 * Cron のスケジュールデータを取得する
 *
 * @return {Schedule[]}
 */
export async function getSchedules() {
  const schedulesDataPath = path.join(path.resolve(''), CONST.CONFIG_DIR, CONST.SCHEDULES_DATA);
  const schedules = await loadLocalJsonData(schedulesDataPath);

  return schedules;
}

/**
 * URL から XML を文字列として取得する
 *
 * @param {string} url XML の URL
 * @return {string} XML 文字列
 */
export async function fetchXmlStr(url) {
  const res = await fetch(url);
  const resStr = await res.text();

  return resStr;
}

/**
 * XML 文字列の内容をオブジェクトに変換する
 *
 * @param {string} xml XML 文字列
 * @return {Promise<Object, Error>} オブジェクト化したデータを返す Promise オブジェクト
 */
export function parseXml(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}

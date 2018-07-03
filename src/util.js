import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';
import { parseString } from 'xml2js';

import * as CONST from './const';

/**
 * @typedef {Object} Schedule
 * @property {string} title
 * @property {string} source
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

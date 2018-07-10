import path from 'path';

import moment from 'moment';
import { CronJob } from 'cron';

import AgqrStreamUrl from './AgqrStreamUrl';
import rtmpdump from './rtmpdump';

import * as CONST from './const';
import * as CONFIG from '../config/config.json';

/**
 * @typedef {object} Schedule
 * @property {string} title
 * @property {number} sourceType
 * @property {string} [url]
 * @property {number} recTime
 * @property {object} startTime
 * @property {number|string} startTime.dayOfWeek
 * @property {number|string} startTime.month
 * @property {number|string} startTime.date
 * @property {number|string} startTime.hours
 * @property {number|string} startTime.minutes
 * @property {number|string} startTime.seconds
 */

const downloadDirPath = path.join(path.resolve(''), CONST.DOWNLOAD_DIR);

/**
 * Cron で実行されるジョブ
 *
 * @param {string} source RTMP の配信元 URL 文字列
 * @param {Schedule.startTime} startTime 録音開始タイミング
 * @param {number} recTime 録音する長さ（sec）
 * @param {string} title ファイルのタイトル
 */
function execJob(source, startTime, recTime, title) {
  const now = moment();
  console.log(`cron running now!: ${now.format('YYYY-MM-DD HH:mm:ss')}`);

  const recDate = (startTime.hours >= 24) ?
    now.subtract(1, 'days').hour(startTime.hours).minute(startTime.minutes) :
    now.hour(startTime.hours).minute(startTime.minutes);

  const output = path.format({
    dir: downloadDirPath,
    name: `${title}_${recDate.format('YYYYMMDDHHmm')}`,
    ext: `.${CONFIG.DOWNLOAD_EXT}`,
  });

  const args = {
    '--rtmp': `${source}`,
    '--live': null,
    '--realtime': null,
    '--flv': `"${output}"`,
    '--stop': `${recTime}`,
  };

  rtmpdump(args);
}

/**
 * 指定時間にジョブをセットする
 *
 * @param {string} source RTMP の配信元 URL 文字列
 * @param {Schedule} schedule Cron 実行のスケジュールデータ
 * @return {CronJob}
 */
function setJob(source, schedule) {
  const cronTimeString = `${schedule.startTime.seconds} ${schedule.startTime.minutes} ${schedule.startTime.hours} ${schedule.startTime.date} ${schedule.startTime.month} ${schedule.startTime.dayOfWeek}`;

  const recTime = schedule.recTime * 60;
  const title = (schedule.title) ? schedule.title : CONST.DEFAULT_TITLE;

  const job = new CronJob(cronTimeString, () => {
    execJob(source, schedule.startTime, recTime, title);
  }, null, true, CONST.TIME_ZONE);

  console.log(`set rec: ${cronTimeString} ${source}`);

  return job;
}

/**
 * @return {function(number, ?string): Promise<string>}
 */
function initGetSourceUrl() {
  const agqrStreamUrl = AgqrStreamUrl();

  return async (sourceType, url = '') => {
    switch (CONST.SOURCE_TYPE[sourceType]) {
      case CONST.SOURCE_TYPE_URL: {
        return url;
      }
      case CONST.SOURCE_TYPE_AGQR: {
        return await agqrStreamUrl.get();
      }
      default: {
        return url;
      }
    }
  };
}

/**
 * @param {Schedule[]} schedules
 * @return {CronJob[]}
 */
export async function setCrons(schedules) {
  const getSourceUrl = initGetSourceUrl();

  const jobs = schedules.map(async (schedule) => {
    const sourceUrl = await getSourceUrl(schedule.sourceType, (schedule.url) ? schedule.url : null);
    return setJob(sourceUrl, schedule);
  }, []);

  return jobs;
}

export default setCrons;

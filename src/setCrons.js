import path from 'path';

import moment from 'moment';
import { CronJob } from 'cron';

import AgqrStreamUrl from './AgqrStreamUrl';
import rtmpdump from './rtmpdump';

import * as CONST from './const';
import * as CONFIG from '../config/config.json';

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

const downloadDirPath = path.join(path.resolve(''), CONST.DOWNLOAD_DIR);

/**
 * @param {string} source RTMP の配信元 URL 文字列
 * @param {Schedule} schedule Timer 実行のスケジュールデータ
 */
function execJob(source, schedule) {
  console.log(`cron running now!: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);

  const outFilename = `${schedule.title}_${moment().format('YYYYMMDD')}`;
  const outFilePath = path.format({
    dir: downloadDirPath,
    name: outFilename,
    ext: `.${CONFIG.DOWNLOAD_EXT}`,
  });

  const recTimeForSec = schedule.recTime * 60;

  const args = {
    '--rtmp': `${source}`,
    '--live': null,
    '--realtime': null,
    '--flv': `"${outFilePath}"`,
    '--stop': `${recTimeForSec}`,
  };

  rtmpdump(args);
}

/**
 * @param {string} source RTMP の配信元 URL 文字列
 * @param {Schedule} schedule Cron 実行のスケジュールデータ
 * @return {CronJob}
 */
function setJob(source, schedule) {
  const cronTimeString = `${schedule.startTime.seconds} ${schedule.startTime.minutes} ${schedule.startTime.hours} ${schedule.startTime.date} ${schedule.startTime.month} ${schedule.startTime.dayOfWeek}`;

  const job = new CronJob(cronTimeString, () => {
    execJob(source, schedule);
  }, null, true, CONST.TIME_ZONE);

  console.log(`set rec: ${cronTimeString} ${source}`);

  return job;
}

/**
 * @param {Schedule[]} schedules
 * @return {CronJob[]}
 */
export async function setCrons(schedules) {
  const agqrStreamUrl = await AgqrStreamUrl().get();

  const jobs = schedules.map(async (schedule) => {
    const sourceUrl = (schedule.source === CONST.AGQR_SOURCE_SETTING) ? agqrStreamUrl : schedule.source;
    return setJob(sourceUrl, schedule);
  }, []);

  return jobs;
}

export default setCrons;

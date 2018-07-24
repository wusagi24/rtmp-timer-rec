import path from 'path';

import moment from 'moment';
import { CronJob } from 'cron';

import * as CONST from './const';
import * as CONFIG from '../config/config.json';

import AgqrStreamUrl from './AgqrStreamUrl';
import rtmpdump from './rtmpdump';
import { getSchedules } from './util';


/**
* @typedef {object} CronTime
* @property {number|string} startTime.dayOfWeek
* @property {number|string} startTime.month
* @property {number|string} startTime.date
* @property {number|string} startTime.hours
* @property {number|string} startTime.minutes
* @property {number|string} startTime.seconds
 */

/**
 * @typedef {object} Schedule
 * @property {string} title
 * @property {number} sourceType
 * @property {string} [url]
 * @property {number} recTime
 * @property {CronTime} startTime
 */

const downloadDirPath = path.join(path.resolve(''), CONST.DOWNLOAD_DIR);

/**
 * Cron で実行されるジョブ
 *
 * @param {string} source RTMP の配信元 URL 文字列
 * @param {CronTime} startTime 録音開始タイミング
 * @param {number} recTime 録音する長さ（sec）
 * @param {string} title ファイルのタイトル
 */
function execJob(source, startTime, recTime, title) {
  const now = moment();
  console.log(`cron running now!: ${now.format('YYYY-MM-DD HH:mm:ss')}`);

  const hour = `0${startTime.hours}`.slice(-2);
  const minute = `0${startTime.minutes}`.slice(-2);
  const recMoment = (startTime.hours < 24) ? now : now.subtract(1, 'days');
  const datetime = `${recMoment.format('YYYYMMDD')}${hour}${minute}`;

  const output = path.format({
    dir: downloadDirPath,
    name: `${title}_${datetime}`,
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
 * CronTime オブジェクトから moment オブジェクトを生成する
 *
 * @param {CronTime} cronTime
 * @return {moment.Moment}
 */
function toMomentDate(cronTime) {
  const date = (({ dayOfWeek, month, date }) => {
    const now = moment();

    if (Number.isInteger(date)) {
      const today = now.month(month).date(date);

      if (today.isBefore(now)) {
        return today.add(1, 'years');
      }
      return today;
    } else if (Number.isInteger(dayOfWeek)) {
      return now.day(dayOfWeek);
    }
    return now;
  })(cronTime);

  const datetime = date
    .hours(cronTime.hours)
    .minutes(cronTime.minutes)
    .seconds(cronTime.seconds);

  return datetime;
}

/**
 * moment オブジェクトから CronTime オブジェクトを作り直す
 *
 * @param {moment.Moment} datetime
 * @param {CronTime} cronTime
 * @return {CronTime}
 */
function toCalcedCronTime(datetime, cronTime) {
  const { dayOfWeek, month, date } = ((dt, ct) => {
    if (Number.isInteger(ct.date)) {
      return {
        dayOfWeek: CONST.WILDCARD_CHAR,
        month: dt.month(),
        date: dt.date(),
      };
    } else if (Number.isInteger(ct.dayOfWeek)) {
      return {
        dayOfWeek: dt.day(),
        month: CONST.WILDCARD_CHAR,
        date: CONST.WILDCARD_CHAR,
      };
    }
    return {
      dayOfWeek: CONST.WILDCARD_CHAR,
      month: CONST.WILDCARD_CHAR,
      date: CONST.WILDCARD_CHAR,
    };
  })(datetime, cronTime);

  return {
    dayOfWeek,
    month,
    date,
    hours: datetime.hours(),
    minutes: datetime.minutes(),
    seconds: datetime.seconds(),
  };
}

/**
 * 時間指定を cron に渡す形に再計算
 *
 * @param {CronTime} cronTime 時間指定
 * @param {number} [bufTime=0] 実行タイミングに付加するバッファ時間 (sec)
 * @return {CronTime} 再計算した時間指定
 */
function calcCronTime(cronTime, bufTime) {
  const datetime = toMomentDate(cronTime);
  const subBufDatetime = datetime.subtract(bufTime, 'seconds');
  const caledCronTime = toCalcedCronTime(subBufDatetime, cronTime);

  return caledCronTime;
}

/**
 * 指定時間にジョブをセットする
 *
 * @param {string} source RTMP の配信元 URL 文字列
 * @param {Schedule} schedule Cron 実行のスケジュールデータ
 * @return {CronJob}
 */
function setJob(source, schedule) {
  const { dayOfWeek, month, date, hours, minutes, seconds } = calcCronTime(schedule.startTime, CONFIG.REC_START_BUFFER);
  const cronTimeString = `${seconds} ${minutes} ${hours} ${date} ${month} ${dayOfWeek}`;

  const recTime = (schedule.recTime * 60) + CONFIG.REC_START_BUFFER;
  const title = (schedule.title) ? schedule.title : CONST.DEFAULT_TITLE;

  const job = new CronJob({
    cronTime: cronTimeString,
    onTick: () => {
      execJob(source, schedule.startTime, recTime, title);
    },
    start: true,
    timeZone: CONST.TIME_ZONE,
  });

  console.log(`set rec: ${title} ${cronTimeString} ${source}`);

  return job;
}

/**
 * @return {function(string): Promise<string>}
 */
function initGetSourceUrl() {
  const agqrStreamUrl = AgqrStreamUrl();

  return async (source) => {
    switch (source) {
      case CONST.SOURCE_TYPE_AGQR: {
        return await agqrStreamUrl.get();
      }
      default: {
        return source;
      }
    }
  };
}

/**
 * @return {CronJob[]}
 */
export async function setCrons() {
  const schedules = await getSchedules();
  const getSourceUrl = await initGetSourceUrl();

  const jobs = schedules.map(async (schedule) => {
    const sourceUrl = await getSourceUrl(schedule.source);
    return setJob(sourceUrl, schedule);
  }, []);

  return jobs;
}

export default setCrons;

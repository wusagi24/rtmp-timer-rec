import path from 'path';
import { exec } from 'child_process';

import moment from 'moment';
import { CronJob } from 'cron';

import * as CONST from './const';
import * as CONFIG from '../config/config.json';
import { loadLocalJsonData } from './util';
import AgqrStreamUrl from './AgqrStreamUrl';

const projectRoot = path.resolve('');
const libsDirPath = path.join(projectRoot, CONST.LIBS_DIR);
const downloadDirPath = path.join(projectRoot, CONST.DOWNLOAD_DIR);
const rtmpdumpExePath = path.join(libsDirPath, CONST.RTMP_EXE);

export async function getSchedules() {
  const schedulesDataPath = path.join(projectRoot, CONST.CONFIG_DIR, CONST.SCHEDULES_DATA);
  const schedules = await loadLocalJsonData(schedulesDataPath);

  return schedules;
}

export async function getRTMPSourcePath() {
  const agqrStreamUrl = AgqrStreamUrl();
  const url = await agqrStreamUrl.get();

  return url;
}

function execJob(source, schedule) {
  console.log(`cron running now!: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);

  const outFilename = `${schedule.title}_${moment().format('YYYYMMDD')}`;
  const outFilePath = path.format({
    dir: downloadDirPath,
    name: outFilename,
    ext: `.${CONFIG.DOWNLOAD_EXT}`,
  });

  const recTimeForSec = schedule.recTime * 60;
  const execCmd = `${rtmpdumpExePath} --rtmp ${source} -v R -e -o "${outFilePath}" -B ${recTimeForSec}`;
  console.log(execCmd);

  exec(execCmd, (err, stdout, stderr) => {
    if (err) console.log(err);
    console.log(stdout);
  });
}

function setJob(source, schedule) {
  const cronTimeString = `${schedule.startTime.seconds} ${schedule.startTime.minutes} ${schedule.startTime.hours} ${schedule.startTime.date} ${schedule.startTime.month} ${schedule.startTime.dayOfWeek}`;

  const job = new CronJob(cronTimeString, () => {
    execJob(source, schedule);
  }, null, true, CONST.TIME_ZONE);

  console.log(`set rec: ${cronTimeString}`);

  return job;
}

(async () => {
  const schedules = await getSchedules();
  const sourceUrl = await getRTMPSourcePath();

  const jobs = schedules.map(schedule => setJob(sourceUrl, schedule), []);
})();

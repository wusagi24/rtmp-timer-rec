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
const rtmpdumpExePath = path.join(libsDirPath, CONFIG.RTMP_EXE);

export async function getPrograms() {
  const programDataPath = path.join(projectRoot, CONST.CONFIG_DIR, CONST.PROGRAM_DATA);
  const programs = await loadLocalJsonData(programDataPath);

  return programs;
}

export async function getRTMPSourcePath() {
  const agqrStreamUrl = AgqrStreamUrl();
  const url = await agqrStreamUrl.get();

  return url;
}

function execJob(source, program) {
  console.log(`cron running now!: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);

  const outFilename = `${program.title}_${moment().format('YYYYMMDD')}`;
  const outFilePath = path.format({
    dir: downloadDirPath,
    name: outFilename,
    ext: `.${CONFIG.DOWNLOAD_EXT}`,
  });

  const recTimeForSec = program.recTime * 60;
  const execCmd = `${rtmpdumpExePath} --rtmp ${source} -v R -e -o "${outFilePath}" -B ${recTimeForSec}`;
  console.log(execCmd);

  exec(execCmd, (err, stdout, stderr) => {
    if (err) console.log(err);
    console.log(stdout);
  });
}

function setJob(source, program) {
  const cronTimeString = `${program.startTime.seconds} ${program.startTime.minutes} ${program.startTime.hours} ${program.startTime.date} ${program.startTime.month} ${program.startTime.dayOfWeek}`;

  const job = new CronJob(cronTimeString, () => {
    execJob(source, program);
  }, null, true, CONFIG.TIME_ZONE);

  console.log(`set rec: ${cronTimeString}`);

  return job;
}

(async () => {
  const programs = await getPrograms();
  const sourceUrl = await getRTMPSourcePath();

  const jobs = programs.map(program => setJob(sourceUrl, program), []);
})();

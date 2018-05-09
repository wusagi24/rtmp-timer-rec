const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const moment = require('moment');
const { CronJob } = require('cron');

const TIME_ZONE = 'Asia/Tokyo';
const DOWNLOAD_EXT = 'flv';
const CONFIG_DIR = 'config';
const LIBS_DIR = 'libs';
const PROGRAM_DATA = 'programs.json';
const RTMP_EXE = 'rtmpdump';
const DOWNLOAD_DIR = 'downloads';

const projectRoot = path.resolve('');
const libsDirPath = path.join(projectRoot, LIBS_DIR);
const downloadDirPath = path.join(projectRoot, DOWNLOAD_DIR);
const rtmpdumpExePath = path.join(libsDirPath, RTMP_EXE);

function getPrograms() {
  const programDataPath = path.join(projectRoot, CONFIG_DIR, PROGRAM_DATA);
  const jsonData = fs.readFileSync(programDataPath, 'utf-8');
  const programs = JSON.parse(jsonData);

  return programs;
}

function getRTMPSourcePath() {
  const sourceUrl = 'rtmp://fms-base1.mitene.ad.jp/agqr/aandg1';

  return sourceUrl;
}

function execJob(source, program) {
  console.log(`cron running now!: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);

  const outFilename = `${program.title}_${moment().format('YYYYMMDD')}`;
  const outFilePath = path.format({
    dir: downloadDirPath,
    name: outFilename,
    ext: `.${DOWNLOAD_EXT}`,
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
  }, null, true, TIME_ZONE);

  console.log(`set rec: ${cronTimeString}`);

  return job;
}

(() => {
  const programs = getPrograms();
  const sourceUrl = getRTMPSourcePath();

  const jobs = programs.map(program => setJob(sourceUrl, program), []);
})();

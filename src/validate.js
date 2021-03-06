import * as CONST_SET_CRONS from './const/setCrons';
import * as ERROR from './const/error';

/**
 * 入力される CronTime データのバリデーション
 *
 * @param {Object} cronTime
 * @return {string[]}
 */
export function validateInputCronTime(cronTime) {
  /**
   * @param {*} dayOfWeek
   * @return {string[]}
   */
  const validateInputCronTimeDayOfWeek = (dayOfWeek) => {
    if (typeof dayOfWeek !== 'string' && !Number.isInteger(dayOfWeek)) {
      return [ ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_TYPE ];
    }

    if (dayOfWeek === CONST_SET_CRONS.WILDCARD_CHAR) {
      return [];
    }

    const numDayOfWeek = Number(String(dayOfWeek));

    if (dayOfWeek === '' || !Number.isInteger(numDayOfWeek)) {
      return [ ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_VAL ];
    }

    const err = [];

    if (numDayOfWeek < CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MIN) {
      err.push(ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MIN_LESS);
    }

    if (numDayOfWeek > CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MAX) {
      err.push(ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MAX_OVER);
    }

    return err;
  };

  /**
   * @param {*} month
   * @return {string[]}
   */
  const validateInputCronTimeMonth = (month) => {
    if (typeof month !== 'string' && !Number.isInteger(month)) {
      return [ ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_TYPE ];
    }

    if (month === CONST_SET_CRONS.WILDCARD_CHAR) {
      return [];
    }

    const numMonth = Number(String(month));

    if (month === '' || !Number.isInteger(numMonth)) {
      return [ ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_VAL ];
    }

    const err = [];

    if (numMonth < CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MIN) {
      err.push(ERROR.SCHEDULE_STARTTIME_MONTH_MIN_LESS);
    }

    if (numMonth > CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MAX) {
      err.push(ERROR.SCHEDULE_STARTTIME_MONTH_MAX_OVER);
    }

    return err;
  };

  /**
   * @param {*} date
   * @return {string[]}
   */
  const validateInputCronTimeDate = (date) => {
    if (typeof date !== 'string' && !Number.isInteger(date)) {
      return [ ERROR.SCHEDULE_STARTTIME_DATE_INVALID_TYPE ];
    }

    if (date === CONST_SET_CRONS.WILDCARD_CHAR) {
      return [];
    }

    const numDate = Number(String(date));

    if (date === '' || !Number.isInteger(numDate)) {
      return [ ERROR.SCHEDULE_STARTTIME_DATE_INVALID_VAL ];
    }

    const err = [];

    if (numDate < CONST_SET_CRONS.STARTTIME_DATE_RANGE_MIN) {
      err.push(ERROR.SCHEDULE_STARTTIME_DATE_MIN_LESS);
    }

    if (numDate > CONST_SET_CRONS.STARTTIME_DATE_RANGE_MAX) {
      err.push(ERROR.SCHEDULE_STARTTIME_DATE_MAX_OVER);
    }

    return err;
  };

  /**
   * @param {*} hours
   * @return {string[]}
   */
  const validateInputCronTimeHours = (hours) => {
    const numHours = Number(String(hours));

    if (hours === '' || !Number.isInteger(numHours)) {
      return [ ERROR.SCHEDULE_STARTTIME_HOURS_INVALID_VAL ];
    }

    const err = [];

    if (numHours < CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MIN) {
      err.push(ERROR.SCHEDULE_STARTTIME_HOURS_MIN_LESS);
    }

    if (numHours > CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MAX) {
      err.push(ERROR.SCHEDULE_STARTTIME_HOURS_MAX_OVER);
    }

    return err;
  };

  /**
   * @param {*} minutes
   * @return {string[]}
   */
  const validateInputCronTimeMinutes = (minutes) => {
    const numMinutes = Number(String(minutes));

    if (minutes === '' || !Number.isInteger(numMinutes)) {
      return [ ERROR.SCHEDULE_STARTTIME_MINUTES_INVALID_VAL ];
    }

    const err = [];

    if (numMinutes < CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MIN) {
      err.push(ERROR.SCHEDULE_STARTTIME_MINUTES_MIN_LESS);
    }

    if (numMinutes > CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MAX) {
      err.push(ERROR.SCHEDULE_STARTTIME_MINUTES_MAX_OVER);
    }

    return err;
  };

  /**
   * @param {*} seconds
   * @return {string[]}
   */
  const validateInputCronTimeSeconds = (seconds) => {
    const numSeconds = Number(String(seconds));

    if (seconds === '' || !Number.isInteger(numSeconds)) {
      return [ ERROR.SCHEDULE_STARTTIME_SECONDS_INVALID_VAL ];
    }

    const err = [];

    if (numSeconds < CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MIN) {
      err.push(ERROR.SCHEDULE_STARTTIME_SECONDS_MIN_LESS);
    }

    if (numSeconds > CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MAX) {
      err.push(ERROR.SCHEDULE_STARTTIME_SECONDS_MAX_OVER);
    }

    return err;
  };

  const error = [];

  if (cronTime.hasOwnProperty('dayOfWeek')) {
    error.push(...validateInputCronTimeDayOfWeek(cronTime.dayOfWeek));
  }

  if (cronTime.hasOwnProperty('month')) {
    error.push(...validateInputCronTimeMonth(cronTime.month));
  } else {
    if (cronTime.hasOwnProperty('date')) {
      error.push(ERROR.SCHEDULE_STARTTIME_MONTH_NOT_EXIST);
    }
  }

  if (cronTime.hasOwnProperty('date')) {
    error.push(...validateInputCronTimeDate(cronTime.date));
  } else {
    if (cronTime.hasOwnProperty('month')) {
      error.push(ERROR.SCHEDULE_STARTTIME_DATE_NOT_EXIST);
    }
  }

  if (cronTime.hasOwnProperty('hours')) {
    error.push(...validateInputCronTimeHours(cronTime.hours));
  } else {
    error.push(ERROR.SCHEDULE_STARTTIME_HOURS_NOT_EXIST);
  }

  if (cronTime.hasOwnProperty('minutes')) {
    error.push(...validateInputCronTimeMinutes(cronTime.minutes));
  } else {
    error.push(ERROR.SCHEDULE_STARTTIME_MINUTES_NOT_EXIST);
  }

  if (cronTime.hasOwnProperty('seconds')) {
    error.push(...validateInputCronTimeSeconds(cronTime.seconds));
  } else {
    error.push(ERROR.SCHEDULE_STARTTIME_SECONDS_NOT_EXIST);
  }

  return error;
}

/**
 * 入力されるスケジュールデータのバリデーション
 *
 * @param {Object} schedule
 * @return {string[]}
 */
export function validateInputSchedule(schedule) {
  /**
   * @param {*} title
   * @return {string[]}
   */
  const validateInputScheduleTitle = (title) => {
    if (typeof title !== 'string') {
      return [ ERROR.SCHEDULE_TITLE_INVALID_TYPE ];
    }

    return [];
  };

  /**
   * @param {*} source
   * @return {string[]}
   */
  const validateInputScheduleSource = (source) => {
    if (typeof source !== 'string') {
      return [ ERROR.SCHEDULE_SOURCE_INVALID_TYPE ];
    }

    if (!/^rtmp:\/\/.*$/.test(source)
      && CONST_SET_CRONS.SOURCE_TYPE.indexOf(source) === -1) {
      return [ ERROR.SCHEDULE_SOURCE_INVALID_VAL ];
    }

    return [];
  };

  /**
   * @param {*} recTime
   * @return {string[]}
   */
  const validateInputScheduleRecTime = (recTime) => {
    const numRecTime = Number(String(recTime));

    if (recTime === ''
      || Number.isNaN(numRecTime)
      || !Number.isInteger(numRecTime)) {
      return [ ERROR.SCHEDULE_RECTIME_INVALID_VAL ];
    }

    if (numRecTime < CONST_SET_CRONS.RECTIME_RANGE_MIN) {
      return [ ERROR.SCHEDULE_RECTIME_MIN_LESS ];
    }

    if (numRecTime > CONST_SET_CRONS.RECTIME_RANGE_MAX) {
      return [ ERROR.SCHEDULE_RECTIME_MAX_OVER ];
    }

    return [];
  };

  const error = [];

  if (schedule.hasOwnProperty('title')) {
    error.push(...validateInputScheduleTitle(schedule.title));
  } else {
    error.push(ERROR.SCHEDULE_TITLE_NOT_EXIST);
  }

  if (schedule.hasOwnProperty('source')) {
    error.push(...validateInputScheduleSource(schedule.source));
  } else {
    error.push(ERROR.SCHEDULE_SOURCE_NOT_EXIST);
  }

  if (schedule.hasOwnProperty('recTime')) {
    error.push(...validateInputScheduleRecTime(schedule.recTime));
  } else {
    error.push(ERROR.SCHEDULE_RECTIME_NOT_EXIST);
  }

  if (schedule.hasOwnProperty('startTime')) {
    error.push(...validateInputCronTime(schedule.startTime));
  } else {
    error.push(ERROR.SCHEDULE_STARTTIME_NOT_EXIST);
  }

  return error;
}

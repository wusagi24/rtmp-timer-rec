'use strict';

import assert from 'assert';

import * as CONST_SET_CRONS from '../src/const/setCrons';
import * as ERROR from '../src/const/error';
import { validateCronTime, validateSchedule } from '../src/validate';

const hasTargetError = (errors, errMsg) => {
  try {
    const errIndex = errors.indexOf(errMsg);

    return (errIndex !== -1);
  } catch (err) {
    assert.fail();
  }
};

describe('validate', () => {
  describe('validateCronTime(CronTime)', () => {
    describe('CronTime.dayOfWeek のチェック', () => {
      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_TYPE;

        it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDayOfWeek = { dayOfWeek: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValDayOfWeek), err));

          const zeroValDayOfWeek = { dayOfWeek: 0 };
          assert(!hasTargetError(validateCronTime(zeroValDayOfWeek), err));

          const minusIntValDayOfWeek = { dayOfWeek: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValDayOfWeek), err));

          const strValDayOfWeek = { dayOfWeek: 'hoge' };
          assert(!hasTargetError(validateCronTime(strValDayOfWeek), err));

          const emptyStrValDayOfWeek = { dayOfWeek: '' };
          assert(!hasTargetError(validateCronTime(emptyStrValDayOfWeek), err));
        });

        it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValDayOfWeek = { dayOfWeek: 1.1 };
          assert(hasTargetError(validateCronTime(floatValDayOfWeek), err));

          const NaNValDayOfWeek = { dayOfWeek: NaN };
          assert(hasTargetError(validateCronTime(NaNValDayOfWeek), err));

          const boolValDayOfWeek = { dayOfWeek: true };
          assert(hasTargetError(validateCronTime(boolValDayOfWeek), err));

          const objValDayOfWeek = { dayOfWeek: {} };
          assert(hasTargetError(validateCronTime(objValDayOfWeek), err));

          const undefinedValDayOfWeek = { dayOfWeek: undefined };
          assert(hasTargetError(validateCronTime(undefinedValDayOfWeek), err));

          const nullValDayOfWeek = { dayOfWeek: null };
          assert(hasTargetError(validateCronTime(nullValDayOfWeek), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_VAL;
        const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

        it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDayOfWeek = { dayOfWeek: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValDayOfWeek), err));

          const zeroValDayOfWeek = { dayOfWeek: 0 };
          assert(!hasTargetError(validateCronTime(zeroValDayOfWeek), err));

          const minusIntValDayOfWeek = { dayOfWeek: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValDayOfWeek), err));

          const strPlusIntValDayOfWeek = { dayOfWeek: '1' };
          assert(!hasTargetError(validateCronTime(strPlusIntValDayOfWeek), err));

          const strZeroValDayOfWeek = { dayOfWeek: '0' };
          assert(!hasTargetError(validateCronTime(strZeroValDayOfWeek), err));

          const strMinusIntValDayOfWeek = { dayOfWeek: '-1' };
          assert(!hasTargetError(validateCronTime(strMinusIntValDayOfWeek), err));
        });

        it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
          const validStrValDayOfWeek = { dayOfWeek: validStr };
          assert(!hasTargetError(validateCronTime(validStrValDayOfWeek), err));
        });

        it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrValDayOfWeek1 = { dayOfWeek: 'hoge' };
          assert(hasTargetError(validateCronTime(invalidStrValDayOfWeek1), err));

          const invalidStrValDayOfWeek2 = { dayOfWeek: `${validStr}${validStr}` };
          assert(hasTargetError(validateCronTime(invalidStrValDayOfWeek2), err));

          const emptyStrValDayOfWeek = { dayOfWeek: '' };
          assert(hasTargetError(validateCronTime(emptyStrValDayOfWeek), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MAX_OVER;
        const minDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MIN;
        const maxDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValDayOfWeek = { dayOfWeek: minDayOfWeek };
          assert(!hasTargetError(validateCronTime(minValDayOfWeek), lessErr));
          assert(!hasTargetError(validateCronTime(minValDayOfWeek), overErr));

          const maxValDayOfWeek = { dayOfWeek: maxDayOfWeek };
          assert(!hasTargetError(validateCronTime(maxValDayOfWeek), lessErr));
          assert(!hasTargetError(validateCronTime(maxValDayOfWeek), overErr));

          const strMinValDayOfWeek = { dayOfWeek: `${minDayOfWeek}` };
          assert(!hasTargetError(validateCronTime(strMinValDayOfWeek), lessErr));
          assert(!hasTargetError(validateCronTime(strMinValDayOfWeek), overErr));

          const strMaxValDayOfWeek = { dayOfWeek: `${maxDayOfWeek}` };
          assert(!hasTargetError(validateCronTime(strMaxValDayOfWeek), lessErr));
          assert(!hasTargetError(validateCronTime(strMaxValDayOfWeek), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessDayOfWeek = minDayOfWeek - 1;

          const minLessValDayOfWeek = { dayOfWeek: lessDayOfWeek };
          assert(hasTargetError(validateCronTime(minLessValDayOfWeek), lessErr));

          const strMinLessValDayOfWeek = { dayOfWeek: `${lessDayOfWeek}` };
          assert(hasTargetError(validateCronTime(strMinLessValDayOfWeek), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overDayOfWeek = maxDayOfWeek + 1;

          const maxOverValDayOfWeek = { dayOfWeek: overDayOfWeek };
          assert(hasTargetError(validateCronTime(maxOverValDayOfWeek), overErr));

          const strMaxOverValDayOfWeek = { dayOfWeek: `${overDayOfWeek}` };
          assert(hasTargetError(validateCronTime(strMaxOverValDayOfWeek), overErr));
        });
      });
    });

    describe('CronTime.month のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MONTH_NOT_EXIST;

        it('date が存在していて且つ month が存在する場合は、該当のエラーメッセージは返さない。', () => {
          const existDateAndMonth = { date: 1, month: 1 };
          assert(!hasTargetError(validateCronTime(existDateAndMonth), err));
        });

        it('date が存在していて且つ month が存在しない場合、該当のエラーメッセージを返す。', () => {
          const existDate = { date: 1 };
          assert(hasTargetError(validateCronTime(existDate), err));
        });

        it('date が存在しない場合 month の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
          const existMonth = { month: 1 };
          assert(!hasTargetError(validateCronTime(existMonth), err));

          const notexistDateAndMonth = {};
          assert(!hasTargetError(validateCronTime(notexistDateAndMonth), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_TYPE;

        it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValMonth = { month: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValMonth), err));

          const zeroValMonth = { month: 0 };
          assert(!hasTargetError(validateCronTime(zeroValMonth), err));

          const minusIntValMonth = { month: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValMonth), err));

          const strValMonth = { month: 'hoge' };
          assert(!hasTargetError(validateCronTime(strValMonth), err));

          const emptyStrValMonth = { month: '' };
          assert(!hasTargetError(validateCronTime(emptyStrValMonth), err));
        });

        it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValMonth = { month: 1.1 };
          assert(hasTargetError(validateCronTime(floatValMonth), err));

          const NaNValMonth = { month: NaN };
          assert(hasTargetError(validateCronTime(NaNValMonth), err));

          const boolValMonth = { month: true };
          assert(hasTargetError(validateCronTime(boolValMonth), err));

          const objValMonth = { month: {} };
          assert(hasTargetError(validateCronTime(objValMonth), err));

          const undefinedValMonth = { month: undefined };
          assert(hasTargetError(validateCronTime(undefinedValMonth), err));

          const nullValMonth = { month: null };
          assert(hasTargetError(validateCronTime(nullValMonth), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_VAL;
        const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

        it('整数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValMonth = { month: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValMonth), err));

          const zeroValMonth = { month: 0 };
          assert(!hasTargetError(validateCronTime(zeroValMonth), err));

          const minusIntValMonth = { month: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValMonth), err));

          const strPlusIntValMonth = { month: '1' };
          assert(!hasTargetError(validateCronTime(strPlusIntValMonth), err));

          const strZeroValMonth = { month: '0' };
          assert(!hasTargetError(validateCronTime(strZeroValMonth), err));

          const strMinusIntValMonth = { month: '-1' };
          assert(!hasTargetError(validateCronTime(strMinusIntValMonth), err));
        });

        it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
          const validStrValMonth = { month: validStr };
          assert(!hasTargetError(validateCronTime(validStrValMonth), err));
        });

        it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrValMonth1 = { month: 'hoge' };
          assert(hasTargetError(validateCronTime(invalidStrValMonth1), err));

          const invalidStrValMonth2 = { month: `${validStr}${validStr}` };
          assert(hasTargetError(validateCronTime(invalidStrValMonth2), err));

          const emptyStrValMonth = { month: '' };
          assert(hasTargetError(validateCronTime(emptyStrValMonth), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_MONTH_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_MONTH_MAX_OVER;
        const minMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MIN;
        const maxMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValMonth = { month: minMonth };
          assert(!hasTargetError(validateCronTime(minValMonth), lessErr));
          assert(!hasTargetError(validateCronTime(minValMonth), overErr));

          const maxValMonth = { month: maxMonth };
          assert(!hasTargetError(validateCronTime(maxValMonth), lessErr));
          assert(!hasTargetError(validateCronTime(maxValMonth), overErr));

          const strMinValMonth = { month: `${minMonth}` };
          assert(!hasTargetError(validateCronTime(strMinValMonth), lessErr));
          assert(!hasTargetError(validateCronTime(strMinValMonth), overErr));

          const strMaxValMonth = { month: `${maxMonth}` };
          assert(!hasTargetError(validateCronTime(strMaxValMonth), lessErr));
          assert(!hasTargetError(validateCronTime(strMaxValMonth), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessMonth = minMonth - 1;

          const minLessValMonth = { month: lessMonth };
          assert(hasTargetError(validateCronTime(minLessValMonth), lessErr));

          const strMinLessValMonth = { month: `${lessMonth}` };
          assert(hasTargetError(validateCronTime(strMinLessValMonth), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overMonth = maxMonth + 1;

          const maxOverValMonth = { month: overMonth };
          assert(hasTargetError(validateCronTime(maxOverValMonth), overErr));

          const strMaxOverValMonth = { month: `${overMonth}` };
          assert(hasTargetError(validateCronTime(strMaxOverValMonth), overErr));
        });
      });
    });

    describe('CronTime.date のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DATE_NOT_EXIST;

        it('month が存在していて且つ date が存在する場合は、該当のエラーメッセージは返さない。', () => {
          const existDateAndMonth = { date: 1, month: 1 };
          assert(!hasTargetError(validateCronTime(existDateAndMonth), err));
        });

        it('month が存在していて且つ date が存在しない場合、該当のエラーメッセージを返す。', () => {
          const existMonth = { month: 1 };
          assert(hasTargetError(validateCronTime(existMonth), err));
        });

        it('month が存在しない場合 date の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
          const existDate = { date: 1 };
          assert(!hasTargetError(validateCronTime(existDate), err));

          const notexistDateAndMonth = {};
          assert(!hasTargetError(validateCronTime(notexistDateAndMonth), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DATE_INVALID_TYPE;

        it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDate = { date: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValDate), err));

          const zeroValDate = { date: 0 };
          assert(!hasTargetError(validateCronTime(zeroValDate), err));

          const minusIntValDate = { date: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValDate), err));

          const strValDate = { date: 'hoge' };
          assert(!hasTargetError(validateCronTime(strValDate), err));

          const emptyStrValDate = { date: '' };
          assert(!hasTargetError(validateCronTime(emptyStrValDate), err));
        });

        it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValDate = { date: 1.1 };
          assert(hasTargetError(validateCronTime(floatValDate), err));

          const NaNValDate = { date: NaN };
          assert(hasTargetError(validateCronTime(NaNValDate), err));

          const boolValDate = { date: true };
          assert(hasTargetError(validateCronTime(boolValDate), err));

          const objValDate = { date: {} };
          assert(hasTargetError(validateCronTime(objValDate), err));

          const undefinedValDate = { date: undefined };
          assert(hasTargetError(validateCronTime(undefinedValDate), err));

          const nullValDate = { date: null };
          assert(hasTargetError(validateCronTime(nullValDate), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DATE_INVALID_VAL;
        const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

        it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDate = { date: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValDate), err));

          const zeroValDate = { date: 0 };
          assert(!hasTargetError(validateCronTime(zeroValDate), err));

          const minusIntValDate = { date: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValDate), err));

          const strPlusIntValDate = { date: '1' };
          assert(!hasTargetError(validateCronTime(strPlusIntValDate), err));

          const strZeroValDate = { date: '0' };
          assert(!hasTargetError(validateCronTime(strZeroValDate), err));

          const strMinusIntValDate = { date: '-1' };
          assert(!hasTargetError(validateCronTime(strMinusIntValDate), err));
        });

        it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
          const validStrValDate = { date: validStr };
          assert(!hasTargetError(validateCronTime(validStrValDate), err));
        });

        it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrValDate1 = { date: 'hoge' };
          assert(hasTargetError(validateCronTime(invalidStrValDate1), err));

          const invalidStrValDate2 = { date: `${validStr}${validStr}` };
          assert(hasTargetError(validateCronTime(invalidStrValDate2), err));

          const emptyStrValDate = { date: '' };
          assert(hasTargetError(validateCronTime(emptyStrValDate), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_DATE_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_DATE_MAX_OVER;
        const minDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MIN;
        const maxDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValDate = { date: minDate };
          assert(!hasTargetError(validateCronTime(minValDate), lessErr));
          assert(!hasTargetError(validateCronTime(minValDate), overErr));

          const maxValDate = { date: maxDate };
          assert(!hasTargetError(validateCronTime(maxValDate), lessErr));
          assert(!hasTargetError(validateCronTime(maxValDate), overErr));

          const strMinValDate = { date: `${minDate}` };
          assert(!hasTargetError(validateCronTime(strMinValDate), lessErr));
          assert(!hasTargetError(validateCronTime(strMinValDate), overErr));

          const strMaxValDate = { date: `${maxDate}` };
          assert(!hasTargetError(validateCronTime(strMaxValDate), lessErr));
          assert(!hasTargetError(validateCronTime(strMaxValDate), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessDate = minDate - 1;

          const minLessValDate = { date: lessDate };
          assert(hasTargetError(validateCronTime(minLessValDate), lessErr));

          const strMinLessValDate = { date: `${lessDate}` };
          assert(hasTargetError(validateCronTime(strMinLessValDate), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overDate = maxDate + 1;

          const maxOverValDate = { date: overDate };
          assert(hasTargetError(validateCronTime(maxOverValDate), overErr));

          const strMaxOverValDate = { date: `${overDate}` };
          assert(hasTargetError(validateCronTime(strMaxOverValDate), overErr));
        });
      });
    });

    describe('CronTime.hours のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_HOURS_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existHours = { hours: 1 };
          assert(!hasTargetError(validateCronTime(existHours), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistHours = {};
          assert(hasTargetError(validateCronTime(notExistHours), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_HOURS_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValHours = { hours: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValHours), err));

          const zeroValHours = { hours: 0 };
          assert(!hasTargetError(validateCronTime(zeroValHours), err));

          const minusIntValHours = { hours: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValHours), err));

          const strPlusIntValHours = { hours: '01' };
          assert(!hasTargetError(validateCronTime(strPlusIntValHours), err));

          const strZeroValHours = { hours: '00' };
          assert(!hasTargetError(validateCronTime(strZeroValHours), err));

          const strMinusIntValHours = { hours: '-1' };
          assert(!hasTargetError(validateCronTime(strMinusIntValHours), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValHours = { hours: 1.1 };
          assert(hasTargetError(validateCronTime(floatValHours), err));

          const strFloatValHours = { hours: '1.1' };
          assert(hasTargetError(validateCronTime(strFloatValHours), err));

          const NaNValHours = { hours: NaN };
          assert(hasTargetError(validateCronTime(NaNValHours), err));

          const strValHours = { hours: 'hoge' };
          assert(hasTargetError(validateCronTime(strValHours), err));

          const emptyStrValHours = { hours: '' };
          assert(hasTargetError(validateCronTime(emptyStrValHours), err));

          const boolValHours = { hours: true };
          assert(hasTargetError(validateCronTime(boolValHours), err));

          const objValHours = { hours: {} };
          assert(hasTargetError(validateCronTime(objValHours), err));

          const undefinedValHours = { hours: undefined };
          assert(hasTargetError(validateCronTime(undefinedValHours), err));

          const nullValHours = { hours: null };
          assert(hasTargetError(validateCronTime(nullValHours), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_HOURS_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_HOURS_MAX_OVER;
        const minHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MIN;
        const maxHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValHours = { hours: minHours };
          assert(!hasTargetError(validateCronTime(minValHours), lessErr));
          assert(!hasTargetError(validateCronTime(minValHours), overErr));

          const maxValHours = { hours: maxHours };
          assert(!hasTargetError(validateCronTime(maxValHours), lessErr));
          assert(!hasTargetError(validateCronTime(maxValHours), overErr));

          const strMinValHours = { hours: `${minHours}` };
          assert(!hasTargetError(validateCronTime(strMinValHours), lessErr));
          assert(!hasTargetError(validateCronTime(strMinValHours), overErr));

          const strMaxValHours = { hours: `${maxHours}` };
          assert(!hasTargetError(validateCronTime(strMaxValHours), lessErr));
          assert(!hasTargetError(validateCronTime(strMaxValHours), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessHours = minHours - 1;

          const minLessValHours = { hours: lessHours };
          assert(hasTargetError(validateCronTime(minLessValHours), lessErr));

          const strMinLessValHours = { hours: `${lessHours}` };
          assert(hasTargetError(validateCronTime(strMinLessValHours), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overHours = maxHours + 1;

          const maxOverValHours = { hours: overHours };
          assert(hasTargetError(validateCronTime(maxOverValHours), overErr));

          const strMaxOverValHours = { hours: `${overHours}` };
          assert(hasTargetError(validateCronTime(strMaxOverValHours), overErr));
        });
      });
    });

    describe('CronTime.minutes のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MINUTES_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existMinutes = { minutes: 1 };
          assert(!hasTargetError(validateCronTime(existMinutes), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistMinutes = {};
          assert(hasTargetError(validateCronTime(notExistMinutes), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MINUTES_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValMinutes = { minutes: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValMinutes), err));

          const zeroValMinutes = { minutes: 0 };
          assert(!hasTargetError(validateCronTime(zeroValMinutes), err));

          const minusIntValMinutes = { minutes: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValMinutes), err));

          const strPlusIntValMinutes = { minutes: '01' };
          assert(!hasTargetError(validateCronTime(strPlusIntValMinutes), err));

          const strZeroValMinutes = { minutes: '00' };
          assert(!hasTargetError(validateCronTime(strZeroValMinutes), err));

          const strMinusIntValMinutes = { minutes: '-1' };
          assert(!hasTargetError(validateCronTime(strMinusIntValMinutes), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValMinutes = { minutes: 1.1 };
          assert(hasTargetError(validateCronTime(floatValMinutes), err));

          const strFloatValMinutes = { minutes: '1.1' };
          assert(hasTargetError(validateCronTime(strFloatValMinutes), err));

          const NaNValMinutes = { minutes: NaN };
          assert(hasTargetError(validateCronTime(NaNValMinutes), err));

          const strValMinutes = { minutes: 'hoge' };
          assert(hasTargetError(validateCronTime(strValMinutes), err));

          const emptyStrValMinutes = { minutes: '' };
          assert(hasTargetError(validateCronTime(emptyStrValMinutes), err));

          const boolValMinutes = { minutes: true };
          assert(hasTargetError(validateCronTime(boolValMinutes), err));

          const objValMinutes = { minutes: {} };
          assert(hasTargetError(validateCronTime(objValMinutes), err));

          const undefinedValMinutes = { minutes: undefined };
          assert(hasTargetError(validateCronTime(undefinedValMinutes), err));

          const nullValMinutes = { minutes: null };
          assert(hasTargetError(validateCronTime(nullValMinutes), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_MINUTES_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_MINUTES_MAX_OVER;
        const minMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MIN;
        const maxMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValMinutes = { minutes: minMinutes };
          assert(!hasTargetError(validateCronTime(minValMinutes), lessErr));
          assert(!hasTargetError(validateCronTime(minValMinutes), overErr));

          const maxValMinutes = { minutes: maxMinutes };
          assert(!hasTargetError(validateCronTime(maxValMinutes), lessErr));
          assert(!hasTargetError(validateCronTime(maxValMinutes), overErr));

          const strMinValMinutes = { minutes: `${minMinutes}` };
          assert(!hasTargetError(validateCronTime(strMinValMinutes), lessErr));
          assert(!hasTargetError(validateCronTime(strMinValMinutes), overErr));

          const strMaxValMinutes = { minutes: `${maxMinutes}` };
          assert(!hasTargetError(validateCronTime(strMaxValMinutes), lessErr));
          assert(!hasTargetError(validateCronTime(strMaxValMinutes), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessMinutes = minMinutes - 1;

          const minLessValMinutes = { minutes: lessMinutes };
          assert(hasTargetError(validateCronTime(minLessValMinutes), lessErr));

          const strMinLessValMinutes = { minutes: `${lessMinutes}` };
          assert(hasTargetError(validateCronTime(strMinLessValMinutes), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overMinutes = maxMinutes + 1;

          const maxOverValMinutes = { minutes: overMinutes };
          assert(hasTargetError(validateCronTime(maxOverValMinutes), overErr));

          const strMaxOverValMinutes = { minutes: `${overMinutes}` };
          assert(hasTargetError(validateCronTime(strMaxOverValMinutes), overErr));
        });
      });
    });

    describe('CronTime.seconds のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_SECONDS_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existSeconds = { seconds: 1 };
          assert(!hasTargetError(validateCronTime(existSeconds), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistSeconds = {};
          assert(hasTargetError(validateCronTime(notExistSeconds), err));
        });
      });


      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_SECONDS_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValSeconds = { seconds: 1 };
          assert(!hasTargetError(validateCronTime(plusIntValSeconds), err));

          const zeroValSeconds = { seconds: 0 };
          assert(!hasTargetError(validateCronTime(zeroValSeconds), err));

          const minusIntValSeconds = { seconds: -1 };
          assert(!hasTargetError(validateCronTime(minusIntValSeconds), err));

          const strPlusIntValSeconds = { seconds: '01' };
          assert(!hasTargetError(validateCronTime(strPlusIntValSeconds), err));

          const strZeroValSeconds = { seconds: '00' };
          assert(!hasTargetError(validateCronTime(strZeroValSeconds), err));

          const strMinusIntValSeconds = { seconds: '-1' };
          assert(!hasTargetError(validateCronTime(strMinusIntValSeconds), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValSeconds = { seconds: 1.1 };
          assert(hasTargetError(validateCronTime(floatValSeconds), err));

          const strFloatValSeconds = { seconds: '1.1' };
          assert(hasTargetError(validateCronTime(strFloatValSeconds), err));

          const NaNValSeconds = { seconds: NaN };
          assert(hasTargetError(validateCronTime(NaNValSeconds), err));

          const strValSeconds = { seconds: 'hoge' };
          assert(hasTargetError(validateCronTime(strValSeconds), err));

          const emptyStrValSeconds = { seconds: '' };
          assert(hasTargetError(validateCronTime(emptyStrValSeconds), err));

          const boolValSeconds = { seconds: true };
          assert(hasTargetError(validateCronTime(boolValSeconds), err));

          const objValSeconds = { seconds: {} };
          assert(hasTargetError(validateCronTime(objValSeconds), err));

          const undefinedValSeconds = { seconds: undefined };
          assert(hasTargetError(validateCronTime(undefinedValSeconds), err));

          const nullValSeconds = { seconds: null };
          assert(hasTargetError(validateCronTime(nullValSeconds), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_SECONDS_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_SECONDS_MAX_OVER;
        const minSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MIN;
        const maxSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValSeconds = { seconds: minSeconds };
          assert(!hasTargetError(validateCronTime(minValSeconds), lessErr));
          assert(!hasTargetError(validateCronTime(minValSeconds), overErr));

          const maxValSeconds = { seconds: maxSeconds };
          assert(!hasTargetError(validateCronTime(maxValSeconds), lessErr));
          assert(!hasTargetError(validateCronTime(maxValSeconds), overErr));

          const strMinValSeconds = { seconds: `${minSeconds}` };
          assert(!hasTargetError(validateCronTime(strMinValSeconds), lessErr));
          assert(!hasTargetError(validateCronTime(strMinValSeconds), overErr));

          const strMaxValSeconds = { seconds: `${maxSeconds}` };
          assert(!hasTargetError(validateCronTime(strMaxValSeconds), lessErr));
          assert(!hasTargetError(validateCronTime(strMaxValSeconds), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessSeconds = minSeconds - 1;

          const minLessValSeconds = { seconds: lessSeconds };
          assert(hasTargetError(validateCronTime(minLessValSeconds), lessErr));

          const strMinLessValSeconds = { seconds: `${lessSeconds}` };
          assert(hasTargetError(validateCronTime(strMinLessValSeconds), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overSeconds = maxSeconds + 1;

          const maxOverValSeconds = { seconds: overSeconds };
          assert(hasTargetError(validateCronTime(maxOverValSeconds), overErr));

          const strMaxOverValSeconds = { seconds: `${overSeconds}` };
          assert(hasTargetError(validateCronTime(strMaxOverValSeconds), overErr));
        });
      });
    });
  });

  describe('validateSchedule(Schedule)', () => {
    describe('schedule.title のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_TITLE_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existTitle = { title: 'hoge' };
          assert(!hasTargetError(validateSchedule(existTitle), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistTitle = {};
          assert(hasTargetError(validateSchedule(notExistTitle), err));
        });
      });

      describe('値の型チェック', () => {
        const err = ERROR.SCHEDULE_TITLE_INVALID_TYPE;

        it('文字列の場合、該当のエラーメッセージは返さない。', () => {
          const strValTitle = { title: 'hoge' };
          assert(!hasTargetError(validateSchedule(strValTitle), err));

          const empStrValTitle = { title: '' };
          assert(!hasTargetError(validateSchedule(empStrValTitle), err));
        });

        it('文字列でない場合、該当のエラーメッセージを返す。', () => {
          const numValTitle = { title: 0 };
          assert(hasTargetError(validateSchedule(numValTitle), err));

          const boolValTitle = { title: true };
          assert(hasTargetError(validateSchedule(boolValTitle), err));

          const objValTitle = { title: {} };
          assert(hasTargetError(validateSchedule(objValTitle), err));

          const undefinedValTitle = { title: undefined };
          assert(hasTargetError(validateSchedule(undefinedValTitle), err));

          const nullValTitle = { title: null };
          assert(hasTargetError(validateSchedule(nullValTitle), err));
        });
      });
    });

    describe('schedule.source のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_SOURCE_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existSource = { source: 'hoge' };
          assert(!hasTargetError(validateSchedule(existSource), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistSource = {};
          assert(hasTargetError(validateSchedule(notExistSource), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_SOURCE_INVALID_TYPE;

        it('文字列の場合、該当のエラーメッセージは返さない。', () => {
          const strValSource = { source: 'hoge' };
          assert(!hasTargetError(validateSchedule(strValSource), err));

          const emptyStrValSource = { source: '' };
          assert(!hasTargetError(validateSchedule(emptyStrValSource), err));
        });

        it('文字列でない場合、該当のエラーメッセージを返す。', () => {
          const numValSource = { source: 0 };
          assert(hasTargetError(validateSchedule(numValSource), err));

          const boolValSource = { source: true };
          assert(hasTargetError(validateSchedule(boolValSource), err));

          const objValSource = { source: {} };
          assert(hasTargetError(validateSchedule(objValSource), err));

          const undefinedValSource = { source: undefined };
          assert(hasTargetError(validateSchedule(undefinedValSource), err));

          const nullValSource = { source: null };
          assert(hasTargetError(validateSchedule(nullValSource), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_SOURCE_INVALID_VAL;

        it('rtmp url 文字列の場合、該当のエラーメッセージは返さない。', () => {
          const urlStrValSource = { source: 'rtmp://example.com/hoge/fugo' };
          assert(!hasTargetError(validateSchedule(urlStrValSource), err));
        });

        it('指定された文字列の場合、該当のエラーメッセージは返さない。', () => {
          CONST_SET_CRONS.SOURCE_TYPE.forEach((type) => {
            const validValSource = { source: type };
            assert(!hasTargetError(validateSchedule(validValSource), err));
          });
        });

        it('不正な文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrSource = { source: 'hoge' };
          assert(hasTargetError(validateSchedule(invalidStrSource), err));
        });
      });
    });

    describe('schedule.recTime のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_RECTIME_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existRecTime = { recTime: 1 };
          assert(!hasTargetError(validateSchedule(existRecTime), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistRecTime = {};
          assert(hasTargetError(validateSchedule(notExistRecTime), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_RECTIME_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValRecTime = { recTime: 1 };
          assert(!hasTargetError(validateSchedule(plusIntValRecTime), err));

          const zeroValRecTime = { recTime: 0 };
          assert(!hasTargetError(validateSchedule(zeroValRecTime), err));

          const minusIntValRecTime = { recTime: -1 };
          assert(!hasTargetError(validateSchedule(minusIntValRecTime), err));

          const strPlusIntValRecTime = { recTime: '01' };
          assert(!hasTargetError(validateSchedule(strPlusIntValRecTime), err));

          const strZeroValRecTime = { recTime: '00' };
          assert(!hasTargetError(validateSchedule(strZeroValRecTime), err));

          const strMinusIntValRecTime = { recTime: '-1' };
          assert(!hasTargetError(validateSchedule(strMinusIntValRecTime), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValRecTime = { recTime: 1.1 };
          assert(hasTargetError(validateSchedule(floatValRecTime), err));

          const strFloatValRecTime = { recTime: '1.1' };
          assert(hasTargetError(validateSchedule(strFloatValRecTime), err));

          const NaNValRecTime = { recTime: NaN };
          assert(hasTargetError(validateSchedule(NaNValRecTime), err));

          const strValRecTime = { recTime: 'hoge' };
          assert(hasTargetError(validateSchedule(strValRecTime), err));

          const emptyStrValRecTime = { recTime: '' };
          assert(hasTargetError(validateSchedule(emptyStrValRecTime), err));

          const boolValRecTime = { recTime: true };
          assert(hasTargetError(validateSchedule(boolValRecTime), err));

          const objValRecTime = { recTime: {} };
          assert(hasTargetError(validateSchedule(objValRecTime), err));

          const undefinedValRecTime = { recTime: undefined };
          assert(hasTargetError(validateSchedule(undefinedValRecTime), err));

          const nullValRecTime = { recTime: null };
          assert(hasTargetError(validateSchedule(nullValRecTime), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_RECTIME_MIN_LESS;
        const overErr = ERROR.SCHEDULE_RECTIME_MAX_OVER;
        const minRecTime = CONST_SET_CRONS.RECTIME_RANGE_MIN;
        const maxRecTime = CONST_SET_CRONS.RECTIME_RANGE_MAX;

        it('既定値以内の場合、該当のエラーメッセージは返さない。', () => {
          const minValRecTime = { recTime: minRecTime };
          assert(!hasTargetError(validateSchedule(minValRecTime), lessErr));
          assert(!hasTargetError(validateSchedule(minValRecTime), overErr));

          const maxValRecTime = { recTime: maxRecTime };
          assert(!hasTargetError(validateSchedule(maxValRecTime), lessErr));
          assert(!hasTargetError(validateSchedule(maxValRecTime), overErr));

          const strMinValRecTime = { recTime: `${minRecTime}` };
          assert(!hasTargetError(validateSchedule(strMinValRecTime), lessErr));
          assert(!hasTargetError(validateSchedule(strMinValRecTime), overErr));

          const strMaxValRecTime = { recTime: `${maxRecTime}` };
          assert(!hasTargetError(validateSchedule(strMaxValRecTime), lessErr));
          assert(!hasTargetError(validateSchedule(strMaxValRecTime), overErr));
        });

        it('既定値未満の場合、該当のエラーメッセージを返す。', () => {
          const lessRecTime = minRecTime - 1;

          const lessMinValRecTime = { recTime: lessRecTime };
          assert(hasTargetError(validateSchedule(lessMinValRecTime), lessErr));

          const strLessMinValRecTime = { recTime: `${lessRecTime}` };
          assert(hasTargetError(validateSchedule(strLessMinValRecTime), lessErr));
        });

        it('既定値を超過の場合、該当のエラーメッセージを返す。', () => {
          const overRecTime = maxRecTime + 1;

          const overMaxValRecTime = { recTime: overRecTime };
          assert(hasTargetError(validateSchedule(overMaxValRecTime), overErr));

          const strOverMaxValRecTime = { recTime: `${overRecTime}` };
          assert(hasTargetError(validateSchedule(strOverMaxValRecTime), overErr));
        });
      });
    });

    describe('schedule.startTime のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existStartTime = { startTime: {} };
          assert(!hasTargetError(validateSchedule(existStartTime), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistStartTime = {};
          assert(hasTargetError(validateSchedule(notExistStartTime), err));
        });
      });
    });
  });

});

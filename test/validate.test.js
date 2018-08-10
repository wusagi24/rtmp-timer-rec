'use strict';

import assert from 'assert';

import * as CONST_SET_CRONS from '../src/const/setCrons';
import * as ERROR from '../src/const/error';
import { validateInputCronTime, validateInputSchedule } from '../src/validate';

const hasTargetError = (errors, errMsg) => {
  try {
    const errIndex = errors.indexOf(errMsg);

    return (errIndex !== -1);
  } catch (err) {
    assert.fail();
  }
};

describe('validate', () => {
  describe('validateInputCronTime(CronTime)', () => {
    describe('CronTime.dayOfWeek のチェック', () => {
      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_TYPE;

        it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDayOfWeek = { dayOfWeek: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValDayOfWeek), err));

          const zeroValDayOfWeek = { dayOfWeek: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValDayOfWeek), err));

          const minusIntValDayOfWeek = { dayOfWeek: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValDayOfWeek), err));

          const strValDayOfWeek = { dayOfWeek: 'hoge' };
          assert(!hasTargetError(validateInputCronTime(strValDayOfWeek), err));

          const emptyStrValDayOfWeek = { dayOfWeek: '' };
          assert(!hasTargetError(validateInputCronTime(emptyStrValDayOfWeek), err));
        });

        it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValDayOfWeek = { dayOfWeek: 1.1 };
          assert(hasTargetError(validateInputCronTime(floatValDayOfWeek), err));

          const NaNValDayOfWeek = { dayOfWeek: NaN };
          assert(hasTargetError(validateInputCronTime(NaNValDayOfWeek), err));

          const boolValDayOfWeek = { dayOfWeek: true };
          assert(hasTargetError(validateInputCronTime(boolValDayOfWeek), err));

          const objValDayOfWeek = { dayOfWeek: {} };
          assert(hasTargetError(validateInputCronTime(objValDayOfWeek), err));

          const undefinedValDayOfWeek = { dayOfWeek: undefined };
          assert(hasTargetError(validateInputCronTime(undefinedValDayOfWeek), err));

          const nullValDayOfWeek = { dayOfWeek: null };
          assert(hasTargetError(validateInputCronTime(nullValDayOfWeek), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_VAL;
        const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

        it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDayOfWeek = { dayOfWeek: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValDayOfWeek), err));

          const zeroValDayOfWeek = { dayOfWeek: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValDayOfWeek), err));

          const minusIntValDayOfWeek = { dayOfWeek: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValDayOfWeek), err));

          const strPlusIntValDayOfWeek = { dayOfWeek: '1' };
          assert(!hasTargetError(validateInputCronTime(strPlusIntValDayOfWeek), err));

          const strZeroValDayOfWeek = { dayOfWeek: '0' };
          assert(!hasTargetError(validateInputCronTime(strZeroValDayOfWeek), err));

          const strMinusIntValDayOfWeek = { dayOfWeek: '-1' };
          assert(!hasTargetError(validateInputCronTime(strMinusIntValDayOfWeek), err));
        });

        it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
          const validStrValDayOfWeek = { dayOfWeek: validStr };
          assert(!hasTargetError(validateInputCronTime(validStrValDayOfWeek), err));
        });

        it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrValDayOfWeek1 = { dayOfWeek: 'hoge' };
          assert(hasTargetError(validateInputCronTime(invalidStrValDayOfWeek1), err));

          const invalidStrValDayOfWeek2 = { dayOfWeek: `${validStr}${validStr}` };
          assert(hasTargetError(validateInputCronTime(invalidStrValDayOfWeek2), err));

          const emptyStrValDayOfWeek = { dayOfWeek: '' };
          assert(hasTargetError(validateInputCronTime(emptyStrValDayOfWeek), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MAX_OVER;
        const minDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MIN;
        const maxDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValDayOfWeek = { dayOfWeek: minDayOfWeek };
          assert(!hasTargetError(validateInputCronTime(minValDayOfWeek), lessErr));
          assert(!hasTargetError(validateInputCronTime(minValDayOfWeek), overErr));

          const maxValDayOfWeek = { dayOfWeek: maxDayOfWeek };
          assert(!hasTargetError(validateInputCronTime(maxValDayOfWeek), lessErr));
          assert(!hasTargetError(validateInputCronTime(maxValDayOfWeek), overErr));

          const strMinValDayOfWeek = { dayOfWeek: `${minDayOfWeek}` };
          assert(!hasTargetError(validateInputCronTime(strMinValDayOfWeek), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMinValDayOfWeek), overErr));

          const strMaxValDayOfWeek = { dayOfWeek: `${maxDayOfWeek}` };
          assert(!hasTargetError(validateInputCronTime(strMaxValDayOfWeek), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMaxValDayOfWeek), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessDayOfWeek = minDayOfWeek - 1;

          const minLessValDayOfWeek = { dayOfWeek: lessDayOfWeek };
          assert(hasTargetError(validateInputCronTime(minLessValDayOfWeek), lessErr));

          const strMinLessValDayOfWeek = { dayOfWeek: `${lessDayOfWeek}` };
          assert(hasTargetError(validateInputCronTime(strMinLessValDayOfWeek), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overDayOfWeek = maxDayOfWeek + 1;

          const maxOverValDayOfWeek = { dayOfWeek: overDayOfWeek };
          assert(hasTargetError(validateInputCronTime(maxOverValDayOfWeek), overErr));

          const strMaxOverValDayOfWeek = { dayOfWeek: `${overDayOfWeek}` };
          assert(hasTargetError(validateInputCronTime(strMaxOverValDayOfWeek), overErr));
        });
      });
    });

    describe('CronTime.month のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MONTH_NOT_EXIST;

        it('date が存在していて且つ month が存在する場合は、該当のエラーメッセージは返さない。', () => {
          const existDateAndMonth = { date: 1, month: 1 };
          assert(!hasTargetError(validateInputCronTime(existDateAndMonth), err));
        });

        it('date が存在していて且つ month が存在しない場合、該当のエラーメッセージを返す。', () => {
          const existDate = { date: 1 };
          assert(hasTargetError(validateInputCronTime(existDate), err));
        });

        it('date が存在しない場合 month の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
          const existMonth = { month: 1 };
          assert(!hasTargetError(validateInputCronTime(existMonth), err));

          const notexistDateAndMonth = {};
          assert(!hasTargetError(validateInputCronTime(notexistDateAndMonth), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_TYPE;

        it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValMonth = { month: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValMonth), err));

          const zeroValMonth = { month: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValMonth), err));

          const minusIntValMonth = { month: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValMonth), err));

          const strValMonth = { month: 'hoge' };
          assert(!hasTargetError(validateInputCronTime(strValMonth), err));

          const emptyStrValMonth = { month: '' };
          assert(!hasTargetError(validateInputCronTime(emptyStrValMonth), err));
        });

        it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValMonth = { month: 1.1 };
          assert(hasTargetError(validateInputCronTime(floatValMonth), err));

          const NaNValMonth = { month: NaN };
          assert(hasTargetError(validateInputCronTime(NaNValMonth), err));

          const boolValMonth = { month: true };
          assert(hasTargetError(validateInputCronTime(boolValMonth), err));

          const objValMonth = { month: {} };
          assert(hasTargetError(validateInputCronTime(objValMonth), err));

          const undefinedValMonth = { month: undefined };
          assert(hasTargetError(validateInputCronTime(undefinedValMonth), err));

          const nullValMonth = { month: null };
          assert(hasTargetError(validateInputCronTime(nullValMonth), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_VAL;
        const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

        it('整数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValMonth = { month: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValMonth), err));

          const zeroValMonth = { month: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValMonth), err));

          const minusIntValMonth = { month: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValMonth), err));

          const strPlusIntValMonth = { month: '1' };
          assert(!hasTargetError(validateInputCronTime(strPlusIntValMonth), err));

          const strZeroValMonth = { month: '0' };
          assert(!hasTargetError(validateInputCronTime(strZeroValMonth), err));

          const strMinusIntValMonth = { month: '-1' };
          assert(!hasTargetError(validateInputCronTime(strMinusIntValMonth), err));
        });

        it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
          const validStrValMonth = { month: validStr };
          assert(!hasTargetError(validateInputCronTime(validStrValMonth), err));
        });

        it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrValMonth1 = { month: 'hoge' };
          assert(hasTargetError(validateInputCronTime(invalidStrValMonth1), err));

          const invalidStrValMonth2 = { month: `${validStr}${validStr}` };
          assert(hasTargetError(validateInputCronTime(invalidStrValMonth2), err));

          const emptyStrValMonth = { month: '' };
          assert(hasTargetError(validateInputCronTime(emptyStrValMonth), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_MONTH_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_MONTH_MAX_OVER;
        const minMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MIN;
        const maxMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValMonth = { month: minMonth };
          assert(!hasTargetError(validateInputCronTime(minValMonth), lessErr));
          assert(!hasTargetError(validateInputCronTime(minValMonth), overErr));

          const maxValMonth = { month: maxMonth };
          assert(!hasTargetError(validateInputCronTime(maxValMonth), lessErr));
          assert(!hasTargetError(validateInputCronTime(maxValMonth), overErr));

          const strMinValMonth = { month: `${minMonth}` };
          assert(!hasTargetError(validateInputCronTime(strMinValMonth), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMinValMonth), overErr));

          const strMaxValMonth = { month: `${maxMonth}` };
          assert(!hasTargetError(validateInputCronTime(strMaxValMonth), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMaxValMonth), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessMonth = minMonth - 1;

          const minLessValMonth = { month: lessMonth };
          assert(hasTargetError(validateInputCronTime(minLessValMonth), lessErr));

          const strMinLessValMonth = { month: `${lessMonth}` };
          assert(hasTargetError(validateInputCronTime(strMinLessValMonth), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overMonth = maxMonth + 1;

          const maxOverValMonth = { month: overMonth };
          assert(hasTargetError(validateInputCronTime(maxOverValMonth), overErr));

          const strMaxOverValMonth = { month: `${overMonth}` };
          assert(hasTargetError(validateInputCronTime(strMaxOverValMonth), overErr));
        });
      });
    });

    describe('CronTime.date のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DATE_NOT_EXIST;

        it('month が存在していて且つ date が存在する場合は、該当のエラーメッセージは返さない。', () => {
          const existDateAndMonth = { date: 1, month: 1 };
          assert(!hasTargetError(validateInputCronTime(existDateAndMonth), err));
        });

        it('month が存在していて且つ date が存在しない場合、該当のエラーメッセージを返す。', () => {
          const existMonth = { month: 1 };
          assert(hasTargetError(validateInputCronTime(existMonth), err));
        });

        it('month が存在しない場合 date の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
          const existDate = { date: 1 };
          assert(!hasTargetError(validateInputCronTime(existDate), err));

          const notexistDateAndMonth = {};
          assert(!hasTargetError(validateInputCronTime(notexistDateAndMonth), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DATE_INVALID_TYPE;

        it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDate = { date: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValDate), err));

          const zeroValDate = { date: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValDate), err));

          const minusIntValDate = { date: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValDate), err));

          const strValDate = { date: 'hoge' };
          assert(!hasTargetError(validateInputCronTime(strValDate), err));

          const emptyStrValDate = { date: '' };
          assert(!hasTargetError(validateInputCronTime(emptyStrValDate), err));
        });

        it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValDate = { date: 1.1 };
          assert(hasTargetError(validateInputCronTime(floatValDate), err));

          const NaNValDate = { date: NaN };
          assert(hasTargetError(validateInputCronTime(NaNValDate), err));

          const boolValDate = { date: true };
          assert(hasTargetError(validateInputCronTime(boolValDate), err));

          const objValDate = { date: {} };
          assert(hasTargetError(validateInputCronTime(objValDate), err));

          const undefinedValDate = { date: undefined };
          assert(hasTargetError(validateInputCronTime(undefinedValDate), err));

          const nullValDate = { date: null };
          assert(hasTargetError(validateInputCronTime(nullValDate), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_DATE_INVALID_VAL;
        const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

        it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValDate = { date: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValDate), err));

          const zeroValDate = { date: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValDate), err));

          const minusIntValDate = { date: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValDate), err));

          const strPlusIntValDate = { date: '1' };
          assert(!hasTargetError(validateInputCronTime(strPlusIntValDate), err));

          const strZeroValDate = { date: '0' };
          assert(!hasTargetError(validateInputCronTime(strZeroValDate), err));

          const strMinusIntValDate = { date: '-1' };
          assert(!hasTargetError(validateInputCronTime(strMinusIntValDate), err));
        });

        it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
          const validStrValDate = { date: validStr };
          assert(!hasTargetError(validateInputCronTime(validStrValDate), err));
        });

        it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrValDate1 = { date: 'hoge' };
          assert(hasTargetError(validateInputCronTime(invalidStrValDate1), err));

          const invalidStrValDate2 = { date: `${validStr}${validStr}` };
          assert(hasTargetError(validateInputCronTime(invalidStrValDate2), err));

          const emptyStrValDate = { date: '' };
          assert(hasTargetError(validateInputCronTime(emptyStrValDate), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_DATE_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_DATE_MAX_OVER;
        const minDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MIN;
        const maxDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValDate = { date: minDate };
          assert(!hasTargetError(validateInputCronTime(minValDate), lessErr));
          assert(!hasTargetError(validateInputCronTime(minValDate), overErr));

          const maxValDate = { date: maxDate };
          assert(!hasTargetError(validateInputCronTime(maxValDate), lessErr));
          assert(!hasTargetError(validateInputCronTime(maxValDate), overErr));

          const strMinValDate = { date: `${minDate}` };
          assert(!hasTargetError(validateInputCronTime(strMinValDate), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMinValDate), overErr));

          const strMaxValDate = { date: `${maxDate}` };
          assert(!hasTargetError(validateInputCronTime(strMaxValDate), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMaxValDate), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessDate = minDate - 1;

          const minLessValDate = { date: lessDate };
          assert(hasTargetError(validateInputCronTime(minLessValDate), lessErr));

          const strMinLessValDate = { date: `${lessDate}` };
          assert(hasTargetError(validateInputCronTime(strMinLessValDate), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overDate = maxDate + 1;

          const maxOverValDate = { date: overDate };
          assert(hasTargetError(validateInputCronTime(maxOverValDate), overErr));

          const strMaxOverValDate = { date: `${overDate}` };
          assert(hasTargetError(validateInputCronTime(strMaxOverValDate), overErr));
        });
      });
    });

    describe('CronTime.hours のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_HOURS_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existHours = { hours: 1 };
          assert(!hasTargetError(validateInputCronTime(existHours), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistHours = {};
          assert(hasTargetError(validateInputCronTime(notExistHours), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_HOURS_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValHours = { hours: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValHours), err));

          const zeroValHours = { hours: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValHours), err));

          const minusIntValHours = { hours: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValHours), err));

          const strPlusIntValHours = { hours: '01' };
          assert(!hasTargetError(validateInputCronTime(strPlusIntValHours), err));

          const strZeroValHours = { hours: '00' };
          assert(!hasTargetError(validateInputCronTime(strZeroValHours), err));

          const strMinusIntValHours = { hours: '-1' };
          assert(!hasTargetError(validateInputCronTime(strMinusIntValHours), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValHours = { hours: 1.1 };
          assert(hasTargetError(validateInputCronTime(floatValHours), err));

          const strFloatValHours = { hours: '1.1' };
          assert(hasTargetError(validateInputCronTime(strFloatValHours), err));

          const NaNValHours = { hours: NaN };
          assert(hasTargetError(validateInputCronTime(NaNValHours), err));

          const strValHours = { hours: 'hoge' };
          assert(hasTargetError(validateInputCronTime(strValHours), err));

          const emptyStrValHours = { hours: '' };
          assert(hasTargetError(validateInputCronTime(emptyStrValHours), err));

          const boolValHours = { hours: true };
          assert(hasTargetError(validateInputCronTime(boolValHours), err));

          const objValHours = { hours: {} };
          assert(hasTargetError(validateInputCronTime(objValHours), err));

          const undefinedValHours = { hours: undefined };
          assert(hasTargetError(validateInputCronTime(undefinedValHours), err));

          const nullValHours = { hours: null };
          assert(hasTargetError(validateInputCronTime(nullValHours), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_HOURS_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_HOURS_MAX_OVER;
        const minHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MIN;
        const maxHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValHours = { hours: minHours };
          assert(!hasTargetError(validateInputCronTime(minValHours), lessErr));
          assert(!hasTargetError(validateInputCronTime(minValHours), overErr));

          const maxValHours = { hours: maxHours };
          assert(!hasTargetError(validateInputCronTime(maxValHours), lessErr));
          assert(!hasTargetError(validateInputCronTime(maxValHours), overErr));

          const strMinValHours = { hours: `${minHours}` };
          assert(!hasTargetError(validateInputCronTime(strMinValHours), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMinValHours), overErr));

          const strMaxValHours = { hours: `${maxHours}` };
          assert(!hasTargetError(validateInputCronTime(strMaxValHours), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMaxValHours), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessHours = minHours - 1;

          const minLessValHours = { hours: lessHours };
          assert(hasTargetError(validateInputCronTime(minLessValHours), lessErr));

          const strMinLessValHours = { hours: `${lessHours}` };
          assert(hasTargetError(validateInputCronTime(strMinLessValHours), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overHours = maxHours + 1;

          const maxOverValHours = { hours: overHours };
          assert(hasTargetError(validateInputCronTime(maxOverValHours), overErr));

          const strMaxOverValHours = { hours: `${overHours}` };
          assert(hasTargetError(validateInputCronTime(strMaxOverValHours), overErr));
        });
      });
    });

    describe('CronTime.minutes のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MINUTES_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existMinutes = { minutes: 1 };
          assert(!hasTargetError(validateInputCronTime(existMinutes), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistMinutes = {};
          assert(hasTargetError(validateInputCronTime(notExistMinutes), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_MINUTES_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValMinutes = { minutes: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValMinutes), err));

          const zeroValMinutes = { minutes: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValMinutes), err));

          const minusIntValMinutes = { minutes: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValMinutes), err));

          const strPlusIntValMinutes = { minutes: '01' };
          assert(!hasTargetError(validateInputCronTime(strPlusIntValMinutes), err));

          const strZeroValMinutes = { minutes: '00' };
          assert(!hasTargetError(validateInputCronTime(strZeroValMinutes), err));

          const strMinusIntValMinutes = { minutes: '-1' };
          assert(!hasTargetError(validateInputCronTime(strMinusIntValMinutes), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValMinutes = { minutes: 1.1 };
          assert(hasTargetError(validateInputCronTime(floatValMinutes), err));

          const strFloatValMinutes = { minutes: '1.1' };
          assert(hasTargetError(validateInputCronTime(strFloatValMinutes), err));

          const NaNValMinutes = { minutes: NaN };
          assert(hasTargetError(validateInputCronTime(NaNValMinutes), err));

          const strValMinutes = { minutes: 'hoge' };
          assert(hasTargetError(validateInputCronTime(strValMinutes), err));

          const emptyStrValMinutes = { minutes: '' };
          assert(hasTargetError(validateInputCronTime(emptyStrValMinutes), err));

          const boolValMinutes = { minutes: true };
          assert(hasTargetError(validateInputCronTime(boolValMinutes), err));

          const objValMinutes = { minutes: {} };
          assert(hasTargetError(validateInputCronTime(objValMinutes), err));

          const undefinedValMinutes = { minutes: undefined };
          assert(hasTargetError(validateInputCronTime(undefinedValMinutes), err));

          const nullValMinutes = { minutes: null };
          assert(hasTargetError(validateInputCronTime(nullValMinutes), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_MINUTES_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_MINUTES_MAX_OVER;
        const minMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MIN;
        const maxMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValMinutes = { minutes: minMinutes };
          assert(!hasTargetError(validateInputCronTime(minValMinutes), lessErr));
          assert(!hasTargetError(validateInputCronTime(minValMinutes), overErr));

          const maxValMinutes = { minutes: maxMinutes };
          assert(!hasTargetError(validateInputCronTime(maxValMinutes), lessErr));
          assert(!hasTargetError(validateInputCronTime(maxValMinutes), overErr));

          const strMinValMinutes = { minutes: `${minMinutes}` };
          assert(!hasTargetError(validateInputCronTime(strMinValMinutes), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMinValMinutes), overErr));

          const strMaxValMinutes = { minutes: `${maxMinutes}` };
          assert(!hasTargetError(validateInputCronTime(strMaxValMinutes), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMaxValMinutes), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessMinutes = minMinutes - 1;

          const minLessValMinutes = { minutes: lessMinutes };
          assert(hasTargetError(validateInputCronTime(minLessValMinutes), lessErr));

          const strMinLessValMinutes = { minutes: `${lessMinutes}` };
          assert(hasTargetError(validateInputCronTime(strMinLessValMinutes), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overMinutes = maxMinutes + 1;

          const maxOverValMinutes = { minutes: overMinutes };
          assert(hasTargetError(validateInputCronTime(maxOverValMinutes), overErr));

          const strMaxOverValMinutes = { minutes: `${overMinutes}` };
          assert(hasTargetError(validateInputCronTime(strMaxOverValMinutes), overErr));
        });
      });
    });

    describe('CronTime.seconds のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_SECONDS_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existSeconds = { seconds: 1 };
          assert(!hasTargetError(validateInputCronTime(existSeconds), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistSeconds = {};
          assert(hasTargetError(validateInputCronTime(notExistSeconds), err));
        });
      });


      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_SECONDS_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValSeconds = { seconds: 1 };
          assert(!hasTargetError(validateInputCronTime(plusIntValSeconds), err));

          const zeroValSeconds = { seconds: 0 };
          assert(!hasTargetError(validateInputCronTime(zeroValSeconds), err));

          const minusIntValSeconds = { seconds: -1 };
          assert(!hasTargetError(validateInputCronTime(minusIntValSeconds), err));

          const strPlusIntValSeconds = { seconds: '01' };
          assert(!hasTargetError(validateInputCronTime(strPlusIntValSeconds), err));

          const strZeroValSeconds = { seconds: '00' };
          assert(!hasTargetError(validateInputCronTime(strZeroValSeconds), err));

          const strMinusIntValSeconds = { seconds: '-1' };
          assert(!hasTargetError(validateInputCronTime(strMinusIntValSeconds), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValSeconds = { seconds: 1.1 };
          assert(hasTargetError(validateInputCronTime(floatValSeconds), err));

          const strFloatValSeconds = { seconds: '1.1' };
          assert(hasTargetError(validateInputCronTime(strFloatValSeconds), err));

          const NaNValSeconds = { seconds: NaN };
          assert(hasTargetError(validateInputCronTime(NaNValSeconds), err));

          const strValSeconds = { seconds: 'hoge' };
          assert(hasTargetError(validateInputCronTime(strValSeconds), err));

          const emptyStrValSeconds = { seconds: '' };
          assert(hasTargetError(validateInputCronTime(emptyStrValSeconds), err));

          const boolValSeconds = { seconds: true };
          assert(hasTargetError(validateInputCronTime(boolValSeconds), err));

          const objValSeconds = { seconds: {} };
          assert(hasTargetError(validateInputCronTime(objValSeconds), err));

          const undefinedValSeconds = { seconds: undefined };
          assert(hasTargetError(validateInputCronTime(undefinedValSeconds), err));

          const nullValSeconds = { seconds: null };
          assert(hasTargetError(validateInputCronTime(nullValSeconds), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_STARTTIME_SECONDS_MIN_LESS;
        const overErr = ERROR.SCHEDULE_STARTTIME_SECONDS_MAX_OVER;
        const minSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MIN;
        const maxSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MAX;

        it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
          const minValSeconds = { seconds: minSeconds };
          assert(!hasTargetError(validateInputCronTime(minValSeconds), lessErr));
          assert(!hasTargetError(validateInputCronTime(minValSeconds), overErr));

          const maxValSeconds = { seconds: maxSeconds };
          assert(!hasTargetError(validateInputCronTime(maxValSeconds), lessErr));
          assert(!hasTargetError(validateInputCronTime(maxValSeconds), overErr));

          const strMinValSeconds = { seconds: `${minSeconds}` };
          assert(!hasTargetError(validateInputCronTime(strMinValSeconds), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMinValSeconds), overErr));

          const strMaxValSeconds = { seconds: `${maxSeconds}` };
          assert(!hasTargetError(validateInputCronTime(strMaxValSeconds), lessErr));
          assert(!hasTargetError(validateInputCronTime(strMaxValSeconds), overErr));
        });

        it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
          const lessSeconds = minSeconds - 1;

          const minLessValSeconds = { seconds: lessSeconds };
          assert(hasTargetError(validateInputCronTime(minLessValSeconds), lessErr));

          const strMinLessValSeconds = { seconds: `${lessSeconds}` };
          assert(hasTargetError(validateInputCronTime(strMinLessValSeconds), lessErr));
        });

        it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
          const overSeconds = maxSeconds + 1;

          const maxOverValSeconds = { seconds: overSeconds };
          assert(hasTargetError(validateInputCronTime(maxOverValSeconds), overErr));

          const strMaxOverValSeconds = { seconds: `${overSeconds}` };
          assert(hasTargetError(validateInputCronTime(strMaxOverValSeconds), overErr));
        });
      });
    });
  });

  describe('validateInputSchedule(Schedule)', () => {
    describe('schedule.title のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_TITLE_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existTitle = { title: 'hoge' };
          assert(!hasTargetError(validateInputSchedule(existTitle), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistTitle = {};
          assert(hasTargetError(validateInputSchedule(notExistTitle), err));
        });
      });

      describe('値の型チェック', () => {
        const err = ERROR.SCHEDULE_TITLE_INVALID_TYPE;

        it('文字列の場合、該当のエラーメッセージは返さない。', () => {
          const strValTitle = { title: 'hoge' };
          assert(!hasTargetError(validateInputSchedule(strValTitle), err));

          const empStrValTitle = { title: '' };
          assert(!hasTargetError(validateInputSchedule(empStrValTitle), err));
        });

        it('文字列でない場合、該当のエラーメッセージを返す。', () => {
          const numValTitle = { title: 0 };
          assert(hasTargetError(validateInputSchedule(numValTitle), err));

          const boolValTitle = { title: true };
          assert(hasTargetError(validateInputSchedule(boolValTitle), err));

          const objValTitle = { title: {} };
          assert(hasTargetError(validateInputSchedule(objValTitle), err));

          const undefinedValTitle = { title: undefined };
          assert(hasTargetError(validateInputSchedule(undefinedValTitle), err));

          const nullValTitle = { title: null };
          assert(hasTargetError(validateInputSchedule(nullValTitle), err));
        });
      });
    });

    describe('schedule.source のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_SOURCE_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existSource = { source: 'hoge' };
          assert(!hasTargetError(validateInputSchedule(existSource), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistSource = {};
          assert(hasTargetError(validateInputSchedule(notExistSource), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_SOURCE_INVALID_TYPE;

        it('文字列の場合、該当のエラーメッセージは返さない。', () => {
          const strValSource = { source: 'hoge' };
          assert(!hasTargetError(validateInputSchedule(strValSource), err));

          const emptyStrValSource = { source: '' };
          assert(!hasTargetError(validateInputSchedule(emptyStrValSource), err));
        });

        it('文字列でない場合、該当のエラーメッセージを返す。', () => {
          const numValSource = { source: 0 };
          assert(hasTargetError(validateInputSchedule(numValSource), err));

          const boolValSource = { source: true };
          assert(hasTargetError(validateInputSchedule(boolValSource), err));

          const objValSource = { source: {} };
          assert(hasTargetError(validateInputSchedule(objValSource), err));

          const undefinedValSource = { source: undefined };
          assert(hasTargetError(validateInputSchedule(undefinedValSource), err));

          const nullValSource = { source: null };
          assert(hasTargetError(validateInputSchedule(nullValSource), err));
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR.SCHEDULE_SOURCE_INVALID_VAL;

        it('rtmp url 文字列の場合、該当のエラーメッセージは返さない。', () => {
          const urlStrValSource = { source: 'rtmp://example.com/hoge/fugo' };
          assert(!hasTargetError(validateInputSchedule(urlStrValSource), err));
        });

        it('指定された文字列の場合、該当のエラーメッセージは返さない。', () => {
          CONST_SET_CRONS.SOURCE_TYPE.forEach((type) => {
            const validValSource = { source: type };
            assert(!hasTargetError(validateInputSchedule(validValSource), err));
          });
        });

        it('不正な文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrSource = { source: 'hoge' };
          assert(hasTargetError(validateInputSchedule(invalidStrSource), err));
        });
      });
    });

    describe('schedule.recTime のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_RECTIME_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existRecTime = { recTime: 1 };
          assert(!hasTargetError(validateInputSchedule(existRecTime), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistRecTime = {};
          assert(hasTargetError(validateInputSchedule(notExistRecTime), err));
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR.SCHEDULE_RECTIME_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValRecTime = { recTime: 1 };
          assert(!hasTargetError(validateInputSchedule(plusIntValRecTime), err));

          const zeroValRecTime = { recTime: 0 };
          assert(!hasTargetError(validateInputSchedule(zeroValRecTime), err));

          const minusIntValRecTime = { recTime: -1 };
          assert(!hasTargetError(validateInputSchedule(minusIntValRecTime), err));

          const strPlusIntValRecTime = { recTime: '01' };
          assert(!hasTargetError(validateInputSchedule(strPlusIntValRecTime), err));

          const strZeroValRecTime = { recTime: '00' };
          assert(!hasTargetError(validateInputSchedule(strZeroValRecTime), err));

          const strMinusIntValRecTime = { recTime: '-1' };
          assert(!hasTargetError(validateInputSchedule(strMinusIntValRecTime), err));
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValRecTime = { recTime: 1.1 };
          assert(hasTargetError(validateInputSchedule(floatValRecTime), err));

          const strFloatValRecTime = { recTime: '1.1' };
          assert(hasTargetError(validateInputSchedule(strFloatValRecTime), err));

          const NaNValRecTime = { recTime: NaN };
          assert(hasTargetError(validateInputSchedule(NaNValRecTime), err));

          const strValRecTime = { recTime: 'hoge' };
          assert(hasTargetError(validateInputSchedule(strValRecTime), err));

          const emptyStrValRecTime = { recTime: '' };
          assert(hasTargetError(validateInputSchedule(emptyStrValRecTime), err));

          const boolValRecTime = { recTime: true };
          assert(hasTargetError(validateInputSchedule(boolValRecTime), err));

          const objValRecTime = { recTime: {} };
          assert(hasTargetError(validateInputSchedule(objValRecTime), err));

          const undefinedValRecTime = { recTime: undefined };
          assert(hasTargetError(validateInputSchedule(undefinedValRecTime), err));

          const nullValRecTime = { recTime: null };
          assert(hasTargetError(validateInputSchedule(nullValRecTime), err));
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR.SCHEDULE_RECTIME_MIN_LESS;
        const overErr = ERROR.SCHEDULE_RECTIME_MAX_OVER;
        const minRecTime = CONST_SET_CRONS.RECTIME_RANGE_MIN;
        const maxRecTime = CONST_SET_CRONS.RECTIME_RANGE_MAX;

        it('既定値以内の場合、該当のエラーメッセージは返さない。', () => {
          const minValRecTime = { recTime: minRecTime };
          assert(!hasTargetError(validateInputSchedule(minValRecTime), lessErr));
          assert(!hasTargetError(validateInputSchedule(minValRecTime), overErr));

          const maxValRecTime = { recTime: maxRecTime };
          assert(!hasTargetError(validateInputSchedule(maxValRecTime), lessErr));
          assert(!hasTargetError(validateInputSchedule(maxValRecTime), overErr));

          const strMinValRecTime = { recTime: `${minRecTime}` };
          assert(!hasTargetError(validateInputSchedule(strMinValRecTime), lessErr));
          assert(!hasTargetError(validateInputSchedule(strMinValRecTime), overErr));

          const strMaxValRecTime = { recTime: `${maxRecTime}` };
          assert(!hasTargetError(validateInputSchedule(strMaxValRecTime), lessErr));
          assert(!hasTargetError(validateInputSchedule(strMaxValRecTime), overErr));
        });

        it('既定値未満の場合、該当のエラーメッセージを返す。', () => {
          const lessRecTime = minRecTime - 1;

          const lessMinValRecTime = { recTime: lessRecTime };
          assert(hasTargetError(validateInputSchedule(lessMinValRecTime), lessErr));

          const strLessMinValRecTime = { recTime: `${lessRecTime}` };
          assert(hasTargetError(validateInputSchedule(strLessMinValRecTime), lessErr));
        });

        it('既定値を超過の場合、該当のエラーメッセージを返す。', () => {
          const overRecTime = maxRecTime + 1;

          const overMaxValRecTime = { recTime: overRecTime };
          assert(hasTargetError(validateInputSchedule(overMaxValRecTime), overErr));

          const strOverMaxValRecTime = { recTime: `${overRecTime}` };
          assert(hasTargetError(validateInputSchedule(strOverMaxValRecTime), overErr));
        });
      });
    });

    describe('schedule.startTime のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR.SCHEDULE_STARTTIME_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existStartTime = { startTime: {} };
          assert(!hasTargetError(validateInputSchedule(existStartTime), err));
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistStartTime = {};
          assert(hasTargetError(validateInputSchedule(notExistStartTime), err));
        });
      });
    });
  });
});

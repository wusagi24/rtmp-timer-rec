'use strict';

import assert from 'assert';
import fs from 'fs';
import path from 'path';

import * as CONST from '../src/const/common';
import * as CONST_SET_CRONS from '../src/const/setCrons';
import * as ERROR from '../src/const/error';
import * as CONFIG from '../config/config.json';
import * as TEST_CONST from './const';
import { loadLocalJsonData, validateSchedule, fetchXmlStr, parseXml } from '../src/util';

const DUMMY_DATA_DIR_PATH = path.join(path.resolve(''), CONST.TEST_DIR, TEST_CONST.DUMMY_DATA_DIR);
const DUMMY_XML_PATH = path.join(DUMMY_DATA_DIR_PATH, 'agqrServerInfo.xml');
const DUMMY_OBJ_PATH = path.join(DUMMY_DATA_DIR_PATH, 'agqrServerInfo.js');

describe('Util', () => {
  describe('loadLocalJsonData(path)', () => {
    const jsonPath = path.join(path.resolve(''), CONST.CONFIG_DIR, CONST.SCHEDULES_DATA);

    let jsonData = {};

    before(() => {
      jsonData = require(jsonPath);
    });

    it('Json ファイルをオブジェクトとして読み込む', async () => {
      const loadData = await loadLocalJsonData(jsonPath);
      assert.deepEqual(loadData, jsonData);
    });
  });

  describe('validateSchedule(schedule)', () => {
    const hasTargetError = (errors, errMsg) => {
      try {
        const errIndex = errors.indexOf(errMsg);

        return (errIndex !== -1);
      } catch (err) {
        assert.fail();
      }
    };

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

      describe('dayOfWeek のチェック', () => {
        describe('値の形式チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_TYPE;

          it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDayOfWeek = { startTime: { dayOfWeek: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValDayOfWeek), err));

            const zeroValDayOfWeek = { startTime: { dayOfWeek: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValDayOfWeek), err));

            const minusIntValDayOfWeek = { startTime: { dayOfWeek: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValDayOfWeek), err));

            const strValDayOfWeek = { startTime: { dayOfWeek: 'hoge' } };
            assert(!hasTargetError(validateSchedule(strValDayOfWeek), err));

            const emptyStrValDayOfWeek = { startTime: { dayOfWeek: '' } };
            assert(!hasTargetError(validateSchedule(emptyStrValDayOfWeek), err));
          });

          it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValDayOfWeek = { startTime: { dayOfWeek: 1.1 } };
            assert(hasTargetError(validateSchedule(floatValDayOfWeek), err));

            const NaNValDayOfWeek = { startTime: { dayOfWeek: NaN } };
            assert(hasTargetError(validateSchedule(NaNValDayOfWeek), err));

            const boolValDayOfWeek = { startTime: { dayOfWeek: true } };
            assert(hasTargetError(validateSchedule(boolValDayOfWeek), err));

            const objValDayOfWeek = { startTime: { dayOfWeek: {} } };
            assert(hasTargetError(validateSchedule(objValDayOfWeek), err));

            const undefinedValDayOfWeek = { startTime: { dayOfWeek: undefined } };
            assert(hasTargetError(validateSchedule(undefinedValDayOfWeek), err));

            const nullValDayOfWeek = { startTime: { dayOfWeek: null } };
            assert(hasTargetError(validateSchedule(nullValDayOfWeek), err));
          });
        });

        describe('値の内容チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_VAL;
          const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

          it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDayOfWeek = { startTime: { dayOfWeek: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValDayOfWeek), err));

            const zeroValDayOfWeek = { startTime: { dayOfWeek: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValDayOfWeek), err));

            const minusIntValDayOfWeek = { startTime: { dayOfWeek: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValDayOfWeek), err));

            const strPlusIntValDayOfWeek = { startTime: { dayOfWeek: '1' } };
            assert(!hasTargetError(validateSchedule(strPlusIntValDayOfWeek), err));

            const strZeroValDayOfWeek = { startTime: { dayOfWeek: '0' } };
            assert(!hasTargetError(validateSchedule(strZeroValDayOfWeek), err));

            const strMinusIntValDayOfWeek = { startTime: { dayOfWeek: '-1' } };
            assert(!hasTargetError(validateSchedule(strMinusIntValDayOfWeek), err));
          });

          it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
            const validStrValDayOfWeek = { startTime: { dayOfWeek: validStr } };
            assert(!hasTargetError(validateSchedule(validStrValDayOfWeek), err));
          });

          it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
            const invalidStrValDayOfWeek1 = { startTime: { dayOfWeek: 'hoge' } };
            assert(hasTargetError(validateSchedule(invalidStrValDayOfWeek1), err));

            const invalidStrValDayOfWeek2 = { startTime: { dayOfWeek: `${validStr}${validStr}` } };
            assert(hasTargetError(validateSchedule(invalidStrValDayOfWeek2), err));

            const emptyStrValDayOfWeek = { startTime: { dayOfWeek: '' } };
            assert(hasTargetError(validateSchedule(emptyStrValDayOfWeek), err));
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MIN_LESS;
          const overErr = ERROR.SCHEDULE_STARTTIME_DAYOFWEEK_MAX_OVER;
          const minDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MIN;
          const maxDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValDayOfWeek = { startTime: { dayOfWeek: minDayOfWeek } };
            assert(!hasTargetError(validateSchedule(minValDayOfWeek), lessErr));
            assert(!hasTargetError(validateSchedule(minValDayOfWeek), overErr));

            const maxValDayOfWeek = { startTime: { dayOfWeek: maxDayOfWeek } };
            assert(!hasTargetError(validateSchedule(maxValDayOfWeek), lessErr));
            assert(!hasTargetError(validateSchedule(maxValDayOfWeek), overErr));

            const strMinValDayOfWeek = { startTime: { dayOfWeek: `${minDayOfWeek}` } };
            assert(!hasTargetError(validateSchedule(strMinValDayOfWeek), lessErr));
            assert(!hasTargetError(validateSchedule(strMinValDayOfWeek), overErr));

            const strMaxValDayOfWeek = { startTime: { dayOfWeek: `${maxDayOfWeek}` } };
            assert(!hasTargetError(validateSchedule(strMaxValDayOfWeek), lessErr));
            assert(!hasTargetError(validateSchedule(strMaxValDayOfWeek), overErr));
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessDayOfWeek = minDayOfWeek - 1;

            const minLessValDayOfWeek = { startTime: { dayOfWeek: lessDayOfWeek } };
            assert(hasTargetError(validateSchedule(minLessValDayOfWeek), lessErr));

            const strMinLessValDayOfWeek = { startTime: { dayOfWeek: `${lessDayOfWeek}` } };
            assert(hasTargetError(validateSchedule(strMinLessValDayOfWeek), lessErr));
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overDayOfWeek = maxDayOfWeek + 1;

            const maxOverValDayOfWeek = { startTime: { dayOfWeek: overDayOfWeek } };
            assert(hasTargetError(validateSchedule(maxOverValDayOfWeek), overErr));

            const strMaxOverValDayOfWeek = { startTime: { dayOfWeek: `${overDayOfWeek}` } };
            assert(hasTargetError(validateSchedule(strMaxOverValDayOfWeek), overErr));
          });
        });
      });

      describe('month のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_MONTH_NOT_EXIST;

          it('date が存在していて且つ month が存在する場合は、該当のエラーメッセージは返さない。', () => {
            const existDateAndMonth = {
              startTime: { date: 1, month: 1 },
            };
            assert(!hasTargetError(validateSchedule(existDateAndMonth), err));
          });

          it('date が存在していて且つ month が存在しない場合、該当のエラーメッセージを返す。', () => {
            const existDate = {
              startTime: { date: 1 },
            };
            assert(hasTargetError(validateSchedule(existDate), err));
          });

          it('date が存在しない場合 month の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
            const existMonth = {
              startTime: { month: 1 },
            };
            assert(!hasTargetError(validateSchedule(existMonth), err));

            const notexistDateAndMonth = {
              startTime: {},
            };
            assert(!hasTargetError(validateSchedule(notexistDateAndMonth), err));
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_TYPE;

          it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValMonth = { startTime: { month: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValMonth), err));

            const zeroValMonth = { startTime: { month: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValMonth), err));

            const minusIntValMonth = { startTime: { month: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValMonth), err));

            const strValMonth = { startTime: { month: 'hoge' } };
            assert(!hasTargetError(validateSchedule(strValMonth), err));

            const emptyStrValMonth = { startTime: { month: '' } };
            assert(!hasTargetError(validateSchedule(emptyStrValMonth), err));
          });

          it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValMonth = { startTime: { month: 1.1 } };
            assert(hasTargetError(validateSchedule(floatValMonth), err));

            const NaNValMonth = { startTime: { month: NaN } };
            assert(hasTargetError(validateSchedule(NaNValMonth), err));

            const boolValMonth = { startTime: { month: true } };
            assert(hasTargetError(validateSchedule(boolValMonth), err));

            const objValMonth = { startTime: { month: {} } };
            assert(hasTargetError(validateSchedule(objValMonth), err));

            const undefinedValMonth = { startTime: { month: undefined } };
            assert(hasTargetError(validateSchedule(undefinedValMonth), err));

            const nullValMonth = { startTime: { month: null } };
            assert(hasTargetError(validateSchedule(nullValMonth), err));
          });
        });

        describe('値の内容チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_MONTH_INVALID_VAL;
          const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

          it('整数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValMonth = { startTime: { month: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValMonth), err));

            const zeroValMonth = { startTime: { month: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValMonth), err));

            const minusIntValMonth = { startTime: { month: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValMonth), err));

            const strPlusIntValMonth = { startTime: { month: '1' } };
            assert(!hasTargetError(validateSchedule(strPlusIntValMonth), err));

            const strZeroValMonth = { startTime: { month: '0' } };
            assert(!hasTargetError(validateSchedule(strZeroValMonth), err));

            const strMinusIntValMonth = { startTime: { month: '-1' } };
            assert(!hasTargetError(validateSchedule(strMinusIntValMonth), err));
          });

          it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
            const validStrValMonth = { startTime: { month: validStr } };
            assert(!hasTargetError(validateSchedule(validStrValMonth), err));
          });

          it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
            const invalidStrValMonth1 = { startTime: { month: 'hoge' } };
            assert(hasTargetError(validateSchedule(invalidStrValMonth1), err));

            const invalidStrValMonth2 = { startTime: { month: `${validStr}${validStr}` } };
            assert(hasTargetError(validateSchedule(invalidStrValMonth2), err));

            const emptyStrValMonth = { startTime: { month: '' } };
            assert(hasTargetError(validateSchedule(emptyStrValMonth), err));
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR.SCHEDULE_STARTTIME_MONTH_MIN_LESS;
          const overErr = ERROR.SCHEDULE_STARTTIME_MONTH_MAX_OVER;
          const minMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MIN;
          const maxMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValMonth = { startTime: { month: minMonth } };
            assert(!hasTargetError(validateSchedule(minValMonth), lessErr));
            assert(!hasTargetError(validateSchedule(minValMonth), overErr));

            const maxValMonth = { startTime: { month: maxMonth } };
            assert(!hasTargetError(validateSchedule(maxValMonth), lessErr));
            assert(!hasTargetError(validateSchedule(maxValMonth), overErr));

            const strMinValMonth = { startTime: { month: `${minMonth}` } };
            assert(!hasTargetError(validateSchedule(strMinValMonth), lessErr));
            assert(!hasTargetError(validateSchedule(strMinValMonth), overErr));

            const strMaxValMonth = { startTime: { month: `${maxMonth}` } };
            assert(!hasTargetError(validateSchedule(strMaxValMonth), lessErr));
            assert(!hasTargetError(validateSchedule(strMaxValMonth), overErr));
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessMonth = minMonth - 1;

            const minLessValMonth = { startTime: { month: lessMonth } };
            assert(hasTargetError(validateSchedule(minLessValMonth), lessErr));

            const strMinLessValMonth = { startTime: { month: `${lessMonth}` } };
            assert(hasTargetError(validateSchedule(strMinLessValMonth), lessErr));
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overMonth = maxMonth + 1;

            const maxOverValMonth = { startTime: { month: overMonth } };
            assert(hasTargetError(validateSchedule(maxOverValMonth), overErr));

            const strMaxOverValMonth = { startTime: { month: `${overMonth}` } };
            assert(hasTargetError(validateSchedule(strMaxOverValMonth), overErr));
          });
        });
      });

      describe('date のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_DATE_NOT_EXIST;

          it('month が存在していて且つ date が存在する場合は、該当のエラーメッセージは返さない。', () => {
            const existDateAndMonth = {
              startTime: { date: 1, month: 1 },
            };
            assert(!hasTargetError(validateSchedule(existDateAndMonth), err));
          });

          it('month が存在していて且つ date が存在しない場合、該当のエラーメッセージを返す。', () => {
            const existMonth = {
              startTime: { month: 1 },
            };
            assert(hasTargetError(validateSchedule(existMonth), err));
          });

          it('month が存在しない場合 date の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
            const existDate = {
              startTime: { date: 1 },
            };
            assert(!hasTargetError(validateSchedule(existDate), err));

            const notexistDateAndMonth = {
              startTime: {}
            };
            assert(!hasTargetError(validateSchedule(notexistDateAndMonth), err));
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_DATE_INVALID_TYPE;

          it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDate = { startTime: { date: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValDate), err));

            const zeroValDate = { startTime: { date: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValDate), err));

            const minusIntValDate = { startTime: { date: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValDate), err));

            const strValDate = { startTime: { date: 'hoge' } };
            assert(!hasTargetError(validateSchedule(strValDate), err));

            const emptyStrValDate = { startTime: { date: '' } };
            assert(!hasTargetError(validateSchedule(emptyStrValDate), err));
          });

          it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValDate = { startTime: { date: 1.1 } };
            assert(hasTargetError(validateSchedule(floatValDate), err));

            const NaNValDate = { startTime: { date: NaN } };
            assert(hasTargetError(validateSchedule(NaNValDate), err));

            const boolValDate = { startTime: { date: true } };
            assert(hasTargetError(validateSchedule(boolValDate), err));

            const objValDate = { startTime: { date: {} } };
            assert(hasTargetError(validateSchedule(objValDate), err));

            const undefinedValDate = { startTime: { date: undefined } };
            assert(hasTargetError(validateSchedule(undefinedValDate), err));

            const nullValDate = { startTime: { date: null } };
            assert(hasTargetError(validateSchedule(nullValDate), err));
          });
        });

        describe('値の内容チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_DATE_INVALID_VAL;
          const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

          it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDate = { startTime: { date: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValDate), err));

            const zeroValDate = { startTime: { date: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValDate), err));

            const minusIntValDate = { startTime: { date: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValDate), err));

            const strPlusIntValDate = { startTime: { date: '1' } };
            assert(!hasTargetError(validateSchedule(strPlusIntValDate), err));

            const strZeroValDate = { startTime: { date: '0' } };
            assert(!hasTargetError(validateSchedule(strZeroValDate), err));

            const strMinusIntValDate = { startTime: { date: '-1' } };
            assert(!hasTargetError(validateSchedule(strMinusIntValDate), err));
          });

          it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
            const validStrValDate = { startTime: { date: validStr } };
            assert(!hasTargetError(validateSchedule(validStrValDate), err));
          });

          it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
            const invalidStrValDate1 = { startTime: { date: 'hoge' } };
            assert(hasTargetError(validateSchedule(invalidStrValDate1), err));

            const invalidStrValDate2 = { startTime: { date: `${validStr}${validStr}` } };
            assert(hasTargetError(validateSchedule(invalidStrValDate2), err));

            const emptyStrValDate = { startTime: { date: '' } };
            assert(hasTargetError(validateSchedule(emptyStrValDate), err));
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR.SCHEDULE_STARTTIME_DATE_MIN_LESS;
          const overErr = ERROR.SCHEDULE_STARTTIME_DATE_MAX_OVER;
          const minDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MIN;
          const maxDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValDate = { startTime: { date: minDate } };
            assert(!hasTargetError(validateSchedule(minValDate), lessErr));
            assert(!hasTargetError(validateSchedule(minValDate), overErr));

            const maxValDate = { startTime: { date: maxDate } };
            assert(!hasTargetError(validateSchedule(maxValDate), lessErr));
            assert(!hasTargetError(validateSchedule(maxValDate), overErr));

            const strMinValDate = { startTime: { date: `${minDate}` } };
            assert(!hasTargetError(validateSchedule(strMinValDate), lessErr));
            assert(!hasTargetError(validateSchedule(strMinValDate), overErr));

            const strMaxValDate = { startTime: { date: `${maxDate}` } };
            assert(!hasTargetError(validateSchedule(strMaxValDate), lessErr));
            assert(!hasTargetError(validateSchedule(strMaxValDate), overErr));
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessDate = minDate - 1;

            const minLessValDate = { startTime: { date: lessDate } };
            assert(hasTargetError(validateSchedule(minLessValDate), lessErr));

            const strMinLessValDate = { startTime: { date: `${lessDate}` } };
            assert(hasTargetError(validateSchedule(strMinLessValDate), lessErr));
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overDate = maxDate + 1;

            const maxOverValDate = { startTime: { date: overDate } };
            assert(hasTargetError(validateSchedule(maxOverValDate), overErr));

            const strMaxOverValDate = { startTime: { date: `${overDate}` } };
            assert(hasTargetError(validateSchedule(strMaxOverValDate), overErr));
          });
        });
      });

      describe('hours のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_HOURS_NOT_EXIST;

          it('存在する場合、該当のエラーメッセージは返さない。', () => {
            const existHours = { startTime: { hours: 1 } };
            assert(!hasTargetError(validateSchedule(existHours), err));
          });

          it('存在しない場合、該当のエラーメッセージを返す。', () => {
            const notExistHours = { startTime: {} };
            assert(hasTargetError(validateSchedule(notExistHours), err));
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_HOURS_INVALID_VAL;

          it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValHours = { startTime: { hours: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValHours), err));

            const zeroValHours = { startTime: { hours: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValHours), err));

            const minusIntValHours = { startTime: { hours: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValHours), err));

            const strPlusIntValHours = { startTime: { hours: '01' } };
            assert(!hasTargetError(validateSchedule(strPlusIntValHours), err));

            const strZeroValHours = { startTime: { hours: '00' } };
            assert(!hasTargetError(validateSchedule(strZeroValHours), err));

            const strMinusIntValHours = { startTime: { hours: '-1' } };
            assert(!hasTargetError(validateSchedule(strMinusIntValHours), err));
          });

          it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValHours = { startTime: { hours: 1.1 } };
            assert(hasTargetError(validateSchedule(floatValHours), err));

            const strFloatValHours = { startTime: { hours: '1.1' } };
            assert(hasTargetError(validateSchedule(strFloatValHours), err));

            const NaNValHours = { startTime: { hours: NaN } };
            assert(hasTargetError(validateSchedule(NaNValHours), err));

            const strValHours = { startTime: { hours: 'hoge' } };
            assert(hasTargetError(validateSchedule(strValHours), err));

            const boolValHours = { startTime: { hours: true } };
            assert(hasTargetError(validateSchedule(boolValHours), err));

            const objValHours = { startTime: { hours: {} } };
            assert(hasTargetError(validateSchedule(objValHours), err));

            const undefinedValHours = { startTime: { hours: undefined } };
            assert(hasTargetError(validateSchedule(undefinedValHours), err));

            const nullValHours = { startTime: { hours: null } };
            assert(hasTargetError(validateSchedule(nullValHours), err));
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR.SCHEDULE_STARTTIME_HOURS_MIN_LESS;
          const overErr = ERROR.SCHEDULE_STARTTIME_HOURS_MAX_OVER;
          const minHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MIN;
          const maxHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValHours = { startTime: { hours: minHours } };
            assert(!hasTargetError(validateSchedule(minValHours), lessErr));
            assert(!hasTargetError(validateSchedule(minValHours), overErr));

            const maxValHours = { startTime: { hours: maxHours } };
            assert(!hasTargetError(validateSchedule(maxValHours), lessErr));
            assert(!hasTargetError(validateSchedule(maxValHours), overErr));

            const strMinValHours = { startTime: { hours: `${minHours}` } };
            assert(!hasTargetError(validateSchedule(strMinValHours), lessErr));
            assert(!hasTargetError(validateSchedule(strMinValHours), overErr));

            const strMaxValHours = { startTime: { hours: `${maxHours}` } };
            assert(!hasTargetError(validateSchedule(strMaxValHours), lessErr));
            assert(!hasTargetError(validateSchedule(strMaxValHours), overErr));
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessHours = minHours - 1;

            const minLessValHours = { startTime: { hours: lessHours } };
            assert(hasTargetError(validateSchedule(minLessValHours), lessErr));

            const strMinLessValHours = { startTime: { hours: `${lessHours}` } };
            assert(hasTargetError(validateSchedule(strMinLessValHours), lessErr));
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overHours = maxHours + 1;

            const maxOverValHours = { startTime: { hours: overHours } };
            assert(hasTargetError(validateSchedule(maxOverValHours), overErr));

            const strMaxOverValHours = { startTime: { hours: `${overHours}` } };
            assert(hasTargetError(validateSchedule(strMaxOverValHours), overErr));
          });
        });
      });

      describe('minutes のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_MINUTES_NOT_EXIST;

          it('存在する場合、該当のエラーメッセージは返さない。', () => {
            const existMinutes = { startTime: { minutes: 1 } };
            assert(!hasTargetError(validateSchedule(existMinutes), err));
          });

          it('存在しない場合、該当のエラーメッセージを返す。', () => {
            const notExistMinutes = { startTime: {} };
            assert(hasTargetError(validateSchedule(notExistMinutes), err));
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_MINUTES_INVALID_VAL;

          it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValMinutes = { startTime: { minutes: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValMinutes), err));

            const zeroValMinutes = { startTime: { minutes: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValMinutes), err));

            const minusIntValMinutes = { startTime: { minutes: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValMinutes), err));

            const strPlusIntValMinutes = { startTime: { minutes: '01' } };
            assert(!hasTargetError(validateSchedule(strPlusIntValMinutes), err));

            const strZeroValMinutes = { startTime: { minutes: '00' } };
            assert(!hasTargetError(validateSchedule(strZeroValMinutes), err));

            const strMinusIntValMinutes = { startTime: { minutes: '-1' } };
            assert(!hasTargetError(validateSchedule(strMinusIntValMinutes), err));
          });

          it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValMinutes = { startTime: { minutes: 1.1 } };
            assert(hasTargetError(validateSchedule(floatValMinutes), err));

            const strFloatValMinutes = { startTime: { minutes: '1.1' } };
            assert(hasTargetError(validateSchedule(strFloatValMinutes), err));

            const NaNValMinutes = { startTime: { minutes: NaN } };
            assert(hasTargetError(validateSchedule(NaNValMinutes), err));

            const strValMinutes = { startTime: { minutes: 'hoge' } };
            assert(hasTargetError(validateSchedule(strValMinutes), err));

            const boolValMinutes = { startTime: { minutes: true } };
            assert(hasTargetError(validateSchedule(boolValMinutes), err));

            const objValMinutes = { startTime: { minutes: {} } };
            assert(hasTargetError(validateSchedule(objValMinutes), err));

            const undefinedValMinutes = { startTime: { minutes: undefined } };
            assert(hasTargetError(validateSchedule(undefinedValMinutes), err));

            const nullValMinutes = { startTime: { minutes: null } };
            assert(hasTargetError(validateSchedule(nullValMinutes), err));
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR.SCHEDULE_STARTTIME_MINUTES_MIN_LESS;
          const overErr = ERROR.SCHEDULE_STARTTIME_MINUTES_MAX_OVER;
          const minMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MIN;
          const maxMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValMinutes = { startTime: { minutes: minMinutes } };
            assert(!hasTargetError(validateSchedule(minValMinutes), lessErr));
            assert(!hasTargetError(validateSchedule(minValMinutes), overErr));

            const maxValMinutes = { startTime: { minutes: maxMinutes } };
            assert(!hasTargetError(validateSchedule(maxValMinutes), lessErr));
            assert(!hasTargetError(validateSchedule(maxValMinutes), overErr));

            const strMinValMinutes = { startTime: { minutes: `${minMinutes}` } };
            assert(!hasTargetError(validateSchedule(strMinValMinutes), lessErr));
            assert(!hasTargetError(validateSchedule(strMinValMinutes), overErr));

            const strMaxValMinutes = { startTime: { minutes: `${maxMinutes}` } };
            assert(!hasTargetError(validateSchedule(strMaxValMinutes), lessErr));
            assert(!hasTargetError(validateSchedule(strMaxValMinutes), overErr));
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessMinutes = minMinutes - 1;

            const minLessValMinutes = { startTime: { minutes: lessMinutes } };
            assert(hasTargetError(validateSchedule(minLessValMinutes), lessErr));

            const strMinLessValMinutes = { startTime: { minutes: `${lessMinutes}` } };
            assert(hasTargetError(validateSchedule(strMinLessValMinutes), lessErr));
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overMinutes = maxMinutes + 1;

            const maxOverValMinutes = { startTime: { minutes: overMinutes } };
            assert(hasTargetError(validateSchedule(maxOverValMinutes), overErr));

            const strMaxOverValMinutes = { startTime: { minutes: `${overMinutes}` } };
            assert(hasTargetError(validateSchedule(strMaxOverValMinutes), overErr));
          });
        });
      });

      describe('seconds のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_SECONDS_NOT_EXIST;

          it('存在する場合、該当のエラーメッセージは返さない。', () => {
            const existSeconds = { startTime: { seconds: 1 } };
            assert(!hasTargetError(validateSchedule(existSeconds), err));
          });

          it('存在しない場合、該当のエラーメッセージを返す。', () => {
            const notExistSeconds = { startTime: {} };
            assert(hasTargetError(validateSchedule(notExistSeconds), err));
          });
        });


        describe('値の形式チェック', () => {
          const err = ERROR.SCHEDULE_STARTTIME_SECONDS_INVALID_VAL;

          it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValSeconds = { startTime: { seconds: 1 } };
            assert(!hasTargetError(validateSchedule(plusIntValSeconds), err));

            const zeroValSeconds = { startTime: { seconds: 0 } };
            assert(!hasTargetError(validateSchedule(zeroValSeconds), err));

            const minusIntValSeconds = { startTime: { seconds: -1 } };
            assert(!hasTargetError(validateSchedule(minusIntValSeconds), err));

            const strPlusIntValSeconds = { startTime: { seconds: '01' } };
            assert(!hasTargetError(validateSchedule(strPlusIntValSeconds), err));

            const strZeroValSeconds = { startTime: { seconds: '00' } };
            assert(!hasTargetError(validateSchedule(strZeroValSeconds), err));

            const strMinusIntValSeconds = { startTime: { seconds: '-1' } };
            assert(!hasTargetError(validateSchedule(strMinusIntValSeconds), err));
          });

          it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValSeconds = { startTime: { seconds: 1.1 } };
            assert(hasTargetError(validateSchedule(floatValSeconds), err));

            const strFloatValSeconds = { startTime: { seconds: '1.1' } };
            assert(hasTargetError(validateSchedule(strFloatValSeconds), err));

            const NaNValSeconds = { startTime: { seconds: NaN } };
            assert(hasTargetError(validateSchedule(NaNValSeconds), err));

            const strValSeconds = { startTime: { seconds: 'hoge' } };
            assert(hasTargetError(validateSchedule(strValSeconds), err));

            const boolValSeconds = { startTime: { seconds: true } };
            assert(hasTargetError(validateSchedule(boolValSeconds), err));

            const objValSeconds = { startTime: { seconds: {} } };
            assert(hasTargetError(validateSchedule(objValSeconds), err));

            const undefinedValSeconds = { startTime: { seconds: undefined } };
            assert(hasTargetError(validateSchedule(undefinedValSeconds), err));

            const nullValSeconds = { startTime: { seconds: null } };
            assert(hasTargetError(validateSchedule(nullValSeconds), err));
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR.SCHEDULE_STARTTIME_SECONDS_MIN_LESS;
          const overErr = ERROR.SCHEDULE_STARTTIME_SECONDS_MAX_OVER;
          const minSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MIN;
          const maxSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValSeconds = { startTime: { seconds: minSeconds } };
            assert(!hasTargetError(validateSchedule(minValSeconds), lessErr));
            assert(!hasTargetError(validateSchedule(minValSeconds), overErr));

            const maxValSeconds = { startTime: { seconds: maxSeconds } };
            assert(!hasTargetError(validateSchedule(maxValSeconds), lessErr));
            assert(!hasTargetError(validateSchedule(maxValSeconds), overErr));

            const strMinValSeconds = { startTime: { seconds: `${minSeconds}` } };
            assert(!hasTargetError(validateSchedule(strMinValSeconds), lessErr));
            assert(!hasTargetError(validateSchedule(strMinValSeconds), overErr));

            const strMaxValSeconds = { startTime: { seconds: `${maxSeconds}` } };
            assert(!hasTargetError(validateSchedule(strMaxValSeconds), lessErr));
            assert(!hasTargetError(validateSchedule(strMaxValSeconds), overErr));
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessSeconds = minSeconds - 1;

            const minLessValSeconds = { startTime: { seconds: lessSeconds } };
            assert(hasTargetError(validateSchedule(minLessValSeconds), lessErr));

            const strMinLessValSeconds = { startTime: { seconds: `${lessSeconds}` } };
            assert(hasTargetError(validateSchedule(strMinLessValSeconds), lessErr));
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overSeconds = maxSeconds + 1;

            const maxOverValSeconds = { startTime: { seconds: overSeconds } };
            assert(hasTargetError(validateSchedule(maxOverValSeconds), overErr));

            const strMaxOverValSeconds = { startTime: { seconds: `${overSeconds}` } };
            assert(hasTargetError(validateSchedule(strMaxOverValSeconds), overErr));
          });
        });
      });
    });
  });

  describe('fetchXmlStr()', () => {
    it('URL から XML を文字列として取得できる', async () => {
      const result = await fetchXmlStr(CONFIG.AGQR_SERVER_INFO_URL);
      assert.strictEqual(typeof result, 'string');
    });
  });

  describe('parseXml(xml)', () => {
    let xml = '';
    let obj = {};

    before(() => {
      xml = fs.readFileSync(DUMMY_XML_PATH, CONST.ENCODE_TYPE);
      obj = require(DUMMY_OBJ_PATH).default;
    });

    it('XML 文字列が正しくオブジェクトに変換されている', async () => {
      const result = await parseXml(xml);
      assert.deepEqual(result, obj);
    });
  });
});

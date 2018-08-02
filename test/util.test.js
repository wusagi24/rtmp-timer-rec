'use strict';

import assert from 'assert';
import fs from 'fs';
import path from 'path';

import * as CONST from '../src/const/common';
import * as CONST_SET_CRONS from '../src/const/setCrons';
import * as ERROR_MSG from '../src/const/text_error';
import * as CONFIG from '../config/config.json';
import * as TEST_CONST from './const';
import { loadLocalJsonData, validScheduleData, fetchXmlStr, parseXml } from '../src/util';

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

  describe('validScheduleData(schedule)', () => {
    const isTargetError = (data, errMsg) => {
      try {
        const { error } = validScheduleData(data);
        const errIndex = error.indexOf(errMsg);

        return (errIndex !== -1);
      } catch (err) {
        assert.fail();
      }
    };

    describe('schedule.title のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR_MSG.SCHEDULE_TITLE_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existTitle = { title: 'hoge' };
          assert.strictEqual(isTargetError(existTitle, err), false);
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistTitle = {};
          assert.strictEqual(isTargetError(notExistTitle, err), true);
        });
      });

      describe('値の型チェック', () => {
        const err = ERROR_MSG.SCHEDULE_TITLE_INVALID_VAL;

        it('文字列の場合、該当のエラーメッセージは返さない。', () => {
          const strValTitle = { title: 'hoge' };
          assert.strictEqual(isTargetError(strValTitle, err), false);

          const empStrValTitle = { title: '' };
          assert.strictEqual(isTargetError(empStrValTitle, err), false);
        });

        it('文字列でない場合、該当のエラーメッセージを返す。', () => {
          const numValTitle = { title: 0 };
          assert.strictEqual(isTargetError(numValTitle, err), true);

          const boolValTitle = { title: true };
          assert.strictEqual(isTargetError(boolValTitle, err), true);

          const objValTitle = { title: {} };
          assert.strictEqual(isTargetError(objValTitle, err), true);

          const undefinedValTitle = { title: undefined };
          assert.strictEqual(isTargetError(undefinedValTitle, err), true);

          const nullValTitle = { title: null };
          assert.strictEqual(isTargetError(nullValTitle, err), true);
        });
      });
    });

    describe('schedule.source のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR_MSG.SCHEDULE_SOURCE_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existSource = { source: 'hoge' };
          assert.strictEqual(isTargetError(existSource, err), false);
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistSource = {};
          assert.strictEqual(isTargetError(notExistSource, err), true);
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR_MSG.SCHEDULE_SOURCE_INVALID_VAL;

        it('文字列の場合、該当のエラーメッセージは返さない。', () => {
          const strValSource = { source: 'hoge' };
          assert.strictEqual(isTargetError(strValSource, err), false);

          const emptyStrValSource = { source: '' };
          assert.strictEqual(isTargetError(emptyStrValSource, err), false);
        });

        it('文字列でない場合、該当のエラーメッセージを返す。', () => {
          const numValSource = { source: 0 };
          assert.strictEqual(isTargetError(numValSource, err), true);

          const boolValSource = { source: true };
          assert.strictEqual(isTargetError(boolValSource, err), true);

          const objValSource = { source: {} };
          assert.strictEqual(isTargetError(objValSource, err), true);

          const undefinedValSource = { source: undefined };
          assert.strictEqual(isTargetError(undefinedValSource, err), true);

          const nullValSource = { source: null };
          assert.strictEqual(isTargetError(nullValSource, err), true);
        });
      });

      describe('値の内容チェック', () => {
        const err = ERROR_MSG.SCHEDULE_SOURCE_INVALID_VAL;

        it('rtmp url 文字列の場合、該当のエラーメッセージは返さない。', () => {
          const urlStrValSource = 'rtmp://example.com/hoge/fugo';
          assert.strictEqual(isTargetError(urlStrValSource, err), false);
        });

        it('指定された文字列の場合、該当のエラーメッセージは返さない。', () => {
          CONST.SOURCE_TYPE.forEach((type) => {
            const validValSource = { source: type };
            assert.strictEqual(isTargetError(validValSource, err), false);
          });
        });

        it('不正な文字列の場合、該当のエラーメッセージを返す。', () => {
          const invalidStrSource = 'hoge';
          assert.strictEqual(isTargetError(invalidStrSource, err), true);
        });
      });
    });

    describe('schedule.recTime のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR_MSG.SCHEDULE_RECTIME_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existRecTime = { recTime: 1 };
          assert.strictEqual(isTargetError(existRecTime, err), false);
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistRecTime = {};
          assert.strictEqual(isTargetError(notExistRecTime, err), true);
        });
      });

      describe('値の形式チェック', () => {
        const err = ERROR_MSG.SCHEDULE_RECTIME_INVALID_VAL;

        it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
          const plusIntValRecTime = { recTime: 1 };
          assert.strictEqual(isTargetError(plusIntValRecTime, err), false);

          const zeroValRecTime = { recTime: 0 };
          assert.strictEqual(isTargetError(zeroValRecTime, err), false);

          const minusIntValRecTime = { recTime: -1 };
          assert.strictEqual(isTargetError(minusIntValRecTime, err), false);

          const strPlusIntValRecTime = { recTime: '01' };
          assert.strictEqual(isTargetError(strPlusIntValRecTime, err), false);

          const strZeroValRecTime = { recTime: '00' };
          assert.strictEqual(isTargetError(strZeroValRecTime, err), false);

          const strMinusIntValRecTime = { recTime: '-1' };
          assert.strictEqual(isTargetError(strMinusIntValRecTime, err), false);
        });

        it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
          const floatValRecTime = { recTime: 1.1 };
          assert.strictEqual(isTargetError(floatValRecTime, err), true);

          const strFloatValRecTime = { recTime: '1.1' };
          assert.strictEqual(isTargetError(strFloatValRecTime, err), true);

          const NaNValRecTime = { recTime: NaN };
          assert.strictEqual(isTargetError(NaNValRecTime, err), true);

          const strValRecTime = { recTime: 'hoge' };
          assert.strictEqual(isTargetError(strValRecTime, err), true);

          const boolValRecTime = { recTime: true };
          assert.strictEqual(isTargetError(boolValRecTime, err), true);

          const objValRecTime = { recTime: {} };
          assert.strictEqual(isTargetError(objValRecTime, err), true);

          const undefinedValRecTime = { recTime: undefined };
          assert.strictEqual(isTargetError(undefinedValRecTime, err), true);

          const nullValRecTime = { recTime: null };
          assert.strictEqual(isTargetError(nullValRecTime, err), true);
        });
      });

      describe('値の範囲チェック', () => {
        const lessErr = ERROR_MSG.SCHEDULE_RECTIME_MIN_LESS;
        const overErr = ERROR_MSG.SCHEDULE_RECTIME_MAX_OVER;
        const minRecTime = CONST_SET_CRONS.RECTIME_RANGE_MIN;
        const maxRecTime = CONST_SET_CRONS.RECTIME_RANGE_MAX;

        it('既定値以内の場合、該当のエラーメッセージは返さない。', () => {
          const minValRecTime = { recTime: minRecTime };
          assert.strictEqual(isTargetError(minValRecTime, lessErr), false);
          assert.strictEqual(isTargetError(minValRecTime, overErr), false);

          const maxValRecTime = { recTime: maxRecTime };
          assert.strictEqual(isTargetError(maxValRecTime, lessErr), false);
          assert.strictEqual(isTargetError(maxValRecTime, overErr), false);

          const strMinValRecTime = { recTime: `${minRecTime}` };
          assert.strictEqual(isTargetError(strMinValRecTime, lessErr), false);
          assert.strictEqual(isTargetError(strMinValRecTime, overErr), false);

          const strMaxValRecTime = { recTime: `${maxRecTime}` };
          assert.strictEqual(isTargetError(strMaxValRecTime, lessErr), false);
          assert.strictEqual(isTargetError(strMaxValRecTime, overErr), false);
        });

        it('既定値未満の場合、該当のエラーメッセージを返す。', () => {
          const lessRecTime = minRecTime - 1;

          const lessMinValRecTime = { recTime: lessRecTime };
          assert.strictEqual(isTargetError(lessMinValRecTime, lessErr), true);

          const strLessMinValRecTime = { recTime: `${lessRecTime}` };
          assert.strictEqual(isTargetError(strLessMinValRecTime, lessErr), true);
        });

        it('既定値を超過の場合、該当のエラーメッセージを返す。', () => {
          const overRecTime = maxRecTime + 1;

          const overMaxValRecTime = { recTime: overRecTime };
          assert.strictEqual(isTargetError(overMaxValRecTime, overErr), true);

          const strOverMaxValRecTime = { recTime: `${overRecTime}` };
          assert.strictEqual(isTargetError(strOverMaxValRecTime, overErr), true);
        });
      });
    });

    describe('schedule.startTime のチェック', () => {
      describe('項目の存在チェック', () => {
        const err = ERROR_MSG.SCHEDULE_STARTTIME_NOT_EXIST;

        it('存在する場合、該当のエラーメッセージは返さない。', () => {
          const existStartTime = { startTime: {} };
          assert.strictEqual(isTargetError(existStartTime, err), false);
        });

        it('存在しない場合、該当のエラーメッセージを返す。', () => {
          const notExistStartTime = {};
          assert.strictEqual(isTargetError(notExistStartTime, err), true);
        });
      });

      describe('dayOfWeek のチェック', () => {
        describe('値の形式チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_VAL;

          it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDayOfWeek = { startTime: { dayOfWeek: 1 } };
            assert.strictEqual(isTargetError(plusIntValDayOfWeek, err), false);

            const zeroValDayOfWeek = { startTime: { dayOfWeek: 0 } };
            assert.strictEqual(isTargetError(zeroValDayOfWeek, err), false);

            const minusIntValDayOfWeek = { startTime: { dayOfWeek: -1 } };
            assert.strictEqual(isTargetError(minusIntValDayOfWeek, err), false);

            const strValDayOfWeek = { startTime: { dayOfWeek: 'hoge' } };
            assert.strictEqual(isTargetError(strValDayOfWeek, err), false);

            const emptyStrValDayOfWeek = { startTime: { dayOfWeek: '' } };
            assert.strictEqual(isTargetError(emptyStrValDayOfWeek, err), false);
          });

          it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValDayOfWeek = { startTime: { dayOfWeek: 1.1 } };
            assert.strictEqual(isTargetError(floatValDayOfWeek, err), true);

            const NaNValDayOfWeek = { startTime: { dayOfWeek: NaN } };
            assert.strictEqual(isTargetError(NaNValDayOfWeek, err), true);

            const boolValDayOfWeek = { startTime: { dayOfWeek: true } };
            assert.strictEqual(isTargetError(boolValDayOfWeek, err), true);

            const objValDayOfWeek = { startTime: { dayOfWeek: {} } };
            assert.strictEqual(isTargetError(objValDayOfWeek, err), true);

            const undefinedValDayOfWeek = { startTime: { dayOfWeek: undefined } };
            assert.strictEqual(isTargetError(undefinedValDayOfWeek, err), true);

            const nullValDayOfWeek = { startTime: { dayOfWeek: null } };
            assert.strictEqual(isTargetError(nullValDayOfWeek, err), true);
          });
        });

        describe('値の内容チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_DAYOFWEEK_INVALID_VAL;
          const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

          it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDayOfWeek = { startTime: { dayOfWeek: 1 } };
            assert.strictEqual(isTargetError(plusIntValDayOfWeek, err), false);

            const zeroValDayOfWeek = { startTime: { dayOfWeek: 0 } };
            assert.strictEqual(isTargetError(zeroValDayOfWeek, err), false);

            const minusIntValDayOfWeek = { startTime: { dayOfWeek: -1 } };
            assert.strictEqual(isTargetError(minusIntValDayOfWeek, err), false);

            const strPlusIntValDayOfWeek = { startTime: { dayOfWeek: '1' } };
            assert.strictEqual(isTargetError(strPlusIntValDayOfWeek, err), false);

            const strZeroValDayOfWeek = { startTime: { dayOfWeek: '0' } };
            assert.strictEqual(isTargetError(strZeroValDayOfWeek, err), false);

            const strMinusIntValDayOfWeek = { startTime: { dayOfWeek: '-1' } };
            assert.strictEqual(isTargetError(strMinusIntValDayOfWeek, err), false);
          });

          it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
            const validStrValDayOfWeek = { startTime: { dayOfWeek: validStr } };
            assert.strictEqual(isTargetError(validStrValDayOfWeek, err), false);
          });

          it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
            const invalidStrValDayOfWeek1 = { startTime: { dayOfWeek: 'hoge' } };
            assert.strictEqual(isTargetError(invalidStrValDayOfWeek1, err), true);

            const invalidStrValDayOfWeek2 = { startTime: { dayOfWeek: `${validStr}${validStr}` } };
            assert.strictEqual(isTargetError(invalidStrValDayOfWeek2, err), true);

            const emptyStrValDayOfWeek = { startTime: { dayOfWeek: '' } };
            assert.strictEqual(isTargetError(emptyStrValDayOfWeek, err), true);
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR_MSG.SCHEDULE_STARTTIME_DAYOFWEEK_MIN_LESS;
          const overErr = ERROR_MSG.SCHEDULE_STARTTIME_DAYOFWEEK_MAX_OVER;
          const minDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MIN;
          const maxDayOfWeek = CONST_SET_CRONS.STARTTIME_DAYOFWEEK_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValDayOfWeek = { startTime: { dayOfWeek: minDayOfWeek } };
            assert.strictEqual(isTargetError(minValDayOfWeek, lessErr), false);
            assert.strictEqual(isTargetError(minValDayOfWeek, overErr), false);

            const maxValDayOfWeek = { startTime: { dayOfWeek: maxDayOfWeek } };
            assert.strictEqual(isTargetError(maxValDayOfWeek, lessErr), false);
            assert.strictEqual(isTargetError(maxValDayOfWeek, overErr), false);

            const strMinValDayOfWeek = { startTime: { dayOfWeek: `${minDayOfWeek}` } };
            assert.strictEqual(isTargetError(strMinValDayOfWeek, lessErr), false);
            assert.strictEqual(isTargetError(strMinValDayOfWeek, overErr), false);

            const strMaxValDayOfWeek = { startTime: { dayOfWeek: `${maxDayOfWeek}` } };
            assert.strictEqual(isTargetError(strMaxValDayOfWeek, lessErr), false);
            assert.strictEqual(isTargetError(strMaxValDayOfWeek, overErr), false);
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessDayOfWeek = minDayOfWeek - 1;

            const minLessValDayOfWeek = { startTime: { dayOfWeek: lessDayOfWeek } };
            assert.strictEqual(isTargetError(minLessValDayOfWeek, lessErr), true);

            const strMinLessValDayOfWeek = { startTime: { dayOfWeek: `${lessDayOfWeek}` } };
            assert.strictEqual(isTargetError(strMinLessValDayOfWeek, lessErr), true);
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overDayOfWeek = maxDayOfWeek + 1;

            const maxOverValDayOfWeek = { startTime: { dayOfWeek: overDayOfWeek } };
            assert.strictEqual(isTargetError(maxOverValDayOfWeek, overErr), true);

            const strMaxOverValDayOfWeek = { startTime: { dayOfWeek: `${overDayOfWeek}` } };
            assert.strictEqual(isTargetError(strMaxOverValDayOfWeek, overErr), true);
          });
        });
      });

      describe('month のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_MONTH_NOT_EXIST;

          it('date が存在していて且つ month が存在する場合は、該当のエラーメッセージは返さない。', () => {
            const existDateAndMonth = {
              startTime: { date: 1, month: 1 },
            };
            assert.strictEqual(isTargetError(existDateAndMonth, err), false);
          });

          it('date が存在していて且つ month が存在しない場合、該当のエラーメッセージを返す。', () => {
            const existDate = {
              startTime: { date: 1 },
            };
            assert.strictEqual(isTargetError(existDate, err), true);
          });

          it('date が存在しない場合 month の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
            const existMonth = {
              startTime: { month: 1 },
            };
            assert.strictEqual(isTargetError(existMonth, err), false);

            const notexistDateAndMonth = { startTime: {} };
            assert.strictEqual(isTargetError(notexistDateAndMonth, err), false);
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_MONTH_INVALID_VAL;

          it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValMonth = { startTime: { month: 1 } };
            assert.strictEqual(isTargetError(plusIntValMonth, err), false);

            const zeroValMonth = { startTime: { month: 0 } };
            assert.strictEqual(isTargetError(zeroValMonth, err), false);

            const minusIntValMonth = { startTime: { month: -1 } };
            assert.strictEqual(isTargetError(minusIntValMonth, err), false);

            const strValMonth = { startTime: { month: 'hoge' } };
            assert.strictEqual(isTargetError(strValMonth, err), false);

            const emptyStrValMonth = { startTime: { month: '' } };
            assert.strictEqual(isTargetError(emptyStrValMonth, err), false);
          });

          it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValMonth = { startTime: { month: 1.1 } };
            assert.strictEqual(isTargetError(floatValMonth, err), true);

            const NaNValMonth = { startTime: { month: NaN } };
            assert.strictEqual(isTargetError(NaNValMonth, err), true);

            const boolValMonth = { startTime: { month: true } };
            assert.strictEqual(isTargetError(boolValMonth, err), true);

            const objValMonth = { startTime: { month: {} } };
            assert.strictEqual(isTargetError(objValMonth, err), true);

            const undefinedValMonth = { startTime: { month: undefined } };
            assert.strictEqual(isTargetError(undefinedValMonth, err), true);

            const nullValMonth = { startTime: { month: null } };
            assert.strictEqual(isTargetError(nullValMonth, err), true);
          });
        });

        describe('値の内容チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_MONTH_INVALID_VAL;
          const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

          it('整数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValMonth = { startTime: { month: 1 } };
            assert.strictEqual(isTargetError(plusIntValMonth, err), false);

            const zeroValMonth = { startTime: { month: 0 } };
            assert.strictEqual(isTargetError(zeroValMonth, err), false);

            const minusIntValMonth = { startTime: { month: -1 } };
            assert.strictEqual(isTargetError(minusIntValMonth, err), false);

            const strPlusIntValMonth = { startTime: { month: '1' } };
            assert.strictEqual(isTargetError(strPlusIntValMonth, err), false);

            const strZeroValMonth = { startTime: { month: '0' } };
            assert.strictEqual(isTargetError(strZeroValMonth, err), false);

            const strMinusIntValMonth = { startTime: { month: '-1' } };
            assert.strictEqual(isTargetError(strMinusIntValMonth, err), false);
          });

          it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
            const validStrValMonth = { startTime: { month: validStr } };
            assert.strictEqual(isTargetError(validStrValMonth, err), false);
          });

          it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
            const invalidStrValMonth1 = { startTime: { month: 'hoge' } };
            assert.strictEqual(isTargetError(invalidStrValMonth1, err), true);

            const invalidStrValMonth2 = { startTime: { month: `${validStr}${validStr}` } };
            assert.strictEqual(isTargetError(invalidStrValMonth2, err), true);

            const emptyStrValMonth = { startTime: { month: '' } };
            assert.strictEqual(isTargetError(emptyStrValMonth, err), true);
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR_MSG.SCHEDULE_STARTTIME_MONTH_MIN_LESS;
          const overErr = ERROR_MSG.SCHEDULE_STARTTIME_MONTH_MAX_OVER;
          const minMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MIN;
          const maxMonth = CONST_SET_CRONS.STARTTIME_MONTH_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValMonth = { startTime: { month: minMonth } };
            assert.strictEqual(isTargetError(minValMonth, lessErr), false);
            assert.strictEqual(isTargetError(minValMonth, overErr), false);

            const maxValMonth = { startTime: { month: maxMonth } };
            assert.strictEqual(isTargetError(maxValMonth, lessErr), false);
            assert.strictEqual(isTargetError(maxValMonth, overErr), false);

            const strMinValMonth = { startTime: { month: `${minMonth}` } };
            assert.strictEqual(isTargetError(strMinValMonth, lessErr), false);
            assert.strictEqual(isTargetError(strMinValMonth, overErr), false);

            const strMaxValMonth = { startTime: { month: `${maxMonth}` } };
            assert.strictEqual(isTargetError(strMaxValMonth, lessErr), false);
            assert.strictEqual(isTargetError(strMaxValMonth, overErr), false);
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessMonth = minMonth - 1;

            const minLessValMonth = { startTime: { month: lessMonth } };
            assert.strictEqual(isTargetError(minLessValMonth, lessErr), true);

            const strMinLessValMonth = { startTime: { month: `${lessMonth}` } };
            assert.strictEqual(isTargetError(strMinLessValMonth, lessErr), true);
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overMonth = maxMonth + 1;

            const maxOverValMonth = { startTime: { month: overMonth } };
            assert.strictEqual(isTargetError(maxOverValMonth, overErr), true);

            const strMaxOverValMonth = { startTime: { month: `${overMonth}` } };
            assert.strictEqual(isTargetError(strMaxOverValMonth, overErr), true);
          });
        });
      });

      describe('date のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_DATE_NOT_EXIST;

          it('month が存在していて且つ date が存在する場合は、該当のエラーメッセージは返さない。', () => {
            const existDateAndMonth = {
              startTime: { date: 1, month: 1 },
            };
            assert.strictEqual(isTargetError(existDateAndMonth, err), false);
          });

          it('month が存在していて且つ date が存在しない場合、該当のエラーメッセージを返す。', () => {
            const existMonth = {
              startTime: { month: 1 },
            };
            assert.strictEqual(isTargetError(existMonth, err), true);
          });

          it('month が存在しない場合 date の有無にかかわらず、該当のエラーメッセージは返さない。', () => {
            const existDate = {
              startTime: { date: 1 },
            };
            assert.strictEqual(isTargetError(existDate, err), false);

            const notexistDateAndMonth = { startTime: {} };
            assert.strictEqual(isTargetError(notexistDateAndMonth, err), false);
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_DATE_INVALID_VAL;

          it('整数値か文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDate = { startTime: { date: 1 } };
            assert.strictEqual(isTargetError(plusIntValDate, err), false);

            const zeroValDate = { startTime: { date: 0 } };
            assert.strictEqual(isTargetError(zeroValDate, err), false);

            const minusIntValDate = { startTime: { date: -1 } };
            assert.strictEqual(isTargetError(minusIntValDate, err), false);

            const strValDate = { startTime: { date: 'hoge' } };
            assert.strictEqual(isTargetError(strValDate, err), false);

            const emptyStrValDate = { startTime: { date: '' } };
            assert.strictEqual(isTargetError(emptyStrValDate, err), false);
          });

          it('整数値か文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValDate = { startTime: { date: 1.1 } };
            assert.strictEqual(isTargetError(floatValDate, err), true);

            const NaNValDate = { startTime: { date: NaN } };
            assert.strictEqual(isTargetError(NaNValDate, err), true);

            const boolValDate = { startTime: { date: true } };
            assert.strictEqual(isTargetError(boolValDate, err), true);

            const objValDate = { startTime: { date: {} } };
            assert.strictEqual(isTargetError(objValDate, err), true);

            const undefinedValDate = { startTime: { date: undefined } };
            assert.strictEqual(isTargetError(undefinedValDate, err), true);

            const nullValDate = { startTime: { date: null } };
            assert.strictEqual(isTargetError(nullValDate, err), true);
          });
        });

        describe('値の内容チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_DATE_INVALID_VAL;
          const validStr = CONST_SET_CRONS.WILDCARD_CHAR;

          it('数値もしくは数字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValDate = { startTime: { date: 1 } };
            assert.strictEqual(isTargetError(plusIntValDate, err), false);

            const zeroValDate = { startTime: { date: 0 } };
            assert.strictEqual(isTargetError(zeroValDate, err), false);

            const minusIntValDate = { startTime: { date: -1 } };
            assert.strictEqual(isTargetError(minusIntValDate, err), false);

            const strPlusIntValDate = { startTime: { date: '1' } };
            assert.strictEqual(isTargetError(strPlusIntValDate, err), false);

            const strZeroValDate = { startTime: { date: '0' } };
            assert.strictEqual(isTargetError(strZeroValDate, err), false);

            const strMinusIntValDate = { startTime: { date: '-1' } };
            assert.strictEqual(isTargetError(strMinusIntValDate, err), false);
          });

          it('既定の文字列の場合、該当のエラーメッセージは返さない。', () => {
            const validStrValDate = { startTime: { date: validStr } };
            assert.strictEqual(isTargetError(validStrValDate, err), false);
          });

          it('数字列か既定以外の文字列の場合、該当のエラーメッセージを返す。', () => {
            const invalidStrValDate1 = { startTime: { date: 'hoge' } };
            assert.strictEqual(isTargetError(invalidStrValDate1, err), true);

            const invalidStrValDate2 = { startTime: { date: `${validStr}${validStr}` } };
            assert.strictEqual(isTargetError(invalidStrValDate2, err), true);

            const emptyStrValDate = { startTime: { date: '' } };
            assert.strictEqual(isTargetError(emptyStrValDate, err), true);
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR_MSG.SCHEDULE_STARTTIME_DATE_MIN_LESS;
          const overErr = ERROR_MSG.SCHEDULE_STARTTIME_DATE_MAX_OVER;
          const minDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MIN;
          const maxDate = CONST_SET_CRONS.STARTTIME_DATE_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValDate = { startTime: { date: minDate } };
            assert.strictEqual(isTargetError(minValDate, lessErr), false);
            assert.strictEqual(isTargetError(minValDate, overErr), false);

            const maxValDate = { startTime: { date: maxDate } };
            assert.strictEqual(isTargetError(maxValDate, lessErr), false);
            assert.strictEqual(isTargetError(maxValDate, overErr), false);

            const strMinValDate = { startTime: { date: `${minDate}` } };
            assert.strictEqual(isTargetError(strMinValDate, lessErr), false);
            assert.strictEqual(isTargetError(strMinValDate, overErr), false);

            const strMaxValDate = { startTime: { date: `${maxDate}` } };
            assert.strictEqual(isTargetError(strMaxValDate, lessErr), false);
            assert.strictEqual(isTargetError(strMaxValDate, overErr), false);
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessDate = minDate - 1;

            const minLessValDate = { startTime: { date: lessDate } };
            assert.strictEqual(isTargetError(minLessValDate, lessErr), true);

            const strMinLessValDate = { startTime: { date: `${lessDate}` } };
            assert.strictEqual(isTargetError(strMinLessValDate, lessErr), true);
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overDate = maxDate + 1;

            const maxOverValDate = { startTime: { date: overDate } };
            assert.strictEqual(isTargetError(maxOverValDate, overErr), true);

            const strMaxOverValDate = { startTime: { date: `${overDate}` } };
            assert.strictEqual(isTargetError(strMaxOverValDate, overErr), true);
          });
        });
      });

      describe('hours のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_HOURS_NOT_EXIST;

          it('存在する場合、該当のエラーメッセージは返さない。', () => {
            const existHours = { startTime: { hours: 1 } };
            assert.strictEqual(isTargetError(existHours, err), false);
          });

          it('存在しない場合、該当のエラーメッセージを返す。', () => {
            const notExistHours = { startTime: {} };
            assert.strictEqual(isTargetError(notExistHours, err), true);
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_HOURS_INVALID_VAL;

          it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValHours = { startTime: { hours: 1 } };
            assert.strictEqual(isTargetError(plusIntValHours, err), false);

            const zeroValHours = { startTime: { hours: 0 } };
            assert.strictEqual(isTargetError(zeroValHours, err), false);

            const minusIntValHours = { startTime: { hours: -1 } };
            assert.strictEqual(isTargetError(minusIntValHours, err), false);

            const strPlusIntValHours = { startTime: { hours: '01' } };
            assert.strictEqual(isTargetError(strPlusIntValHours, err), false);

            const strZeroValHours = { startTime: { hours: '00' } };
            assert.strictEqual(isTargetError(strZeroValHours, err), false);

            const strMinusIntValHours = { startTime: { hours: '-1' } };
            assert.strictEqual(isTargetError(strMinusIntValHours, err), false);
          });

          it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValHours = { startTime: { hours: 1.1 } };
            assert.strictEqual(isTargetError(floatValHours, err), true);

            const strFloatValHours = { startTime: { hours: '1.1' } };
            assert.strictEqual(isTargetError(strFloatValHours, err), true);

            const NaNValHours = { startTime: { hours: NaN } };
            assert.strictEqual(isTargetError(NaNValHours, err), true);

            const strValHours = { startTime: { hours: 'hoge' } };
            assert.strictEqual(isTargetError(strValHours, err), true);

            const boolValHours = { startTime: { hours: true } };
            assert.strictEqual(isTargetError(boolValHours, err), true);

            const objValHours = { startTime: { hours: {} } };
            assert.strictEqual(isTargetError(objValHours, err), true);

            const undefinedValHours = { startTime: { hours: undefined } };
            assert.strictEqual(isTargetError(undefinedValHours, err), true);

            const nullValHours = { startTime: { hours: null } };
            assert.strictEqual(isTargetError(nullValHours, err), true);
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR_MSG.SCHEDULE_STARTTIME_HOURS_MIN_LESS;
          const overErr = ERROR_MSG.SCHEDULE_STARTTIME_HOURS_MAX_OVER;
          const minHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MIN;
          const maxHours = CONST_SET_CRONS.STARTTIME_HOURS_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValHours = { startTime: { hours: minHours } };
            assert.strictEqual(isTargetError(minValHours, lessErr), false);
            assert.strictEqual(isTargetError(minValHours, overErr), false);

            const maxValHours = { startTime: { hours: maxHours } };
            assert.strictEqual(isTargetError(maxValHours, lessErr), false);
            assert.strictEqual(isTargetError(maxValHours, overErr), false);

            const strMinValHours = { startTime: { hours: `${minHours}` } };
            assert.strictEqual(isTargetError(strMinValHours, lessErr), false);
            assert.strictEqual(isTargetError(strMinValHours, overErr), false);

            const strMaxValHours = { startTime: { hours: `${maxHours}` } };
            assert.strictEqual(isTargetError(strMaxValHours, lessErr), false);
            assert.strictEqual(isTargetError(strMaxValHours, overErr), false);
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessHours = minHours - 1;

            const minLessValHours = { startTime: { hours: lessHours } };
            assert.strictEqual(isTargetError(minLessValHours, lessErr), true);

            const strMinLessValHours = { startTime: { hours: `${lessHours}` } };
            assert.strictEqual(isTargetError(strMinLessValHours, lessErr), true);
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overHours = maxHours + 1;

            const maxOverValHours = { startTime: { hours: overHours } };
            assert.strictEqual(isTargetError(maxOverValHours, overErr), true);

            const strMaxOverValHours = { startTime: { hours: `${overHours}` } };
            assert.strictEqual(isTargetError(strMaxOverValHours, overErr), true);
          });
        });
      });

      describe('minutes のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_MINUTES_NOT_EXIST;

          it('存在する場合、該当のエラーメッセージは返さない。', () => {
            const existMinutes = { startTime: { minutes: 1 } };
            assert.strictEqual(isTargetError(existMinutes, err), false);
          });

          it('存在しない場合、該当のエラーメッセージを返す。', () => {
            const notExistMinutes = { startTime: {} };
            assert.strictEqual(isTargetError(notExistMinutes, err), true);
          });
        });

        describe('値の形式チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_MINUTES_INVALID_VAL;

          it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValMinutes = { startTime: { minutes: 1 } };
            assert.strictEqual(isTargetError(plusIntValMinutes, err), false);

            const zeroValMinutes = { startTime: { minutes: 0 } };
            assert.strictEqual(isTargetError(zeroValMinutes, err), false);

            const minusIntValMinutes = { startTime: { minutes: -1 } };
            assert.strictEqual(isTargetError(minusIntValMinutes, err), false);

            const strPlusIntValMinutes = { startTime: { minutes: '01' } };
            assert.strictEqual(isTargetError(strPlusIntValMinutes, err), false);

            const strZeroValMinutes = { startTime: { minutes: '00' } };
            assert.strictEqual(isTargetError(strZeroValMinutes, err), false);

            const strMinusIntValMinutes = { startTime: { minutes: '-1' } };
            assert.strictEqual(isTargetError(strMinusIntValMinutes, err), false);
          });

          it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValMinutes = { startTime: { minutes: 1.1 } };
            assert.strictEqual(isTargetError(floatValMinutes, err), true);

            const strFloatValMinutes = { startTime: { minutes: '1.1' } };
            assert.strictEqual(isTargetError(strFloatValMinutes, err), true);

            const NaNValMinutes = { startTime: { minutes: NaN } };
            assert.strictEqual(isTargetError(NaNValMinutes, err), true);

            const strValMinutes = { startTime: { minutes: 'hoge' } };
            assert.strictEqual(isTargetError(strValMinutes, err), true);

            const boolValMinutes = { startTime: { minutes: true } };
            assert.strictEqual(isTargetError(boolValMinutes, err), true);

            const objValMinutes = { startTime: { minutes: {} } };
            assert.strictEqual(isTargetError(objValMinutes, err), true);

            const undefinedValMinutes = { startTime: { minutes: undefined } };
            assert.strictEqual(isTargetError(undefinedValMinutes, err), true);

            const nullValMinutes = { startTime: { minutes: null } };
            assert.strictEqual(isTargetError(nullValMinutes, err), true);
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR_MSG.SCHEDULE_STARTTIME_MINUTES_MIN_LESS;
          const overErr = ERROR_MSG.SCHEDULE_STARTTIME_MINUTES_MAX_OVER;
          const minMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MIN;
          const maxMinutes = CONST_SET_CRONS.STARTTIME_MINUTES_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValMinutes = { startTime: { minutes: minMinutes } };
            assert.strictEqual(isTargetError(minValMinutes, lessErr), false);
            assert.strictEqual(isTargetError(minValMinutes, overErr), false);

            const maxValMinutes = { startTime: { minutes: maxMinutes } };
            assert.strictEqual(isTargetError(maxValMinutes, lessErr), false);
            assert.strictEqual(isTargetError(maxValMinutes, overErr), false);

            const strMinValMinutes = { startTime: { minutes: `${minMinutes}` } };
            assert.strictEqual(isTargetError(strMinValMinutes, lessErr), false);
            assert.strictEqual(isTargetError(strMinValMinutes, overErr), false);

            const strMaxValMinutes = { startTime: { minutes: `${maxMinutes}` } };
            assert.strictEqual(isTargetError(strMaxValMinutes, lessErr), false);
            assert.strictEqual(isTargetError(strMaxValMinutes, overErr), false);
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessMinutes = minMinutes - 1;

            const minLessValMinutes = { startTime: { minutes: lessMinutes } };
            assert.strictEqual(isTargetError(minLessValMinutes, lessErr), true);

            const strMinLessValMinutes = { startTime: { minutes: `${lessMinutes}` } };
            assert.strictEqual(isTargetError(strMinLessValMinutes, lessErr), true);
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overMinutes = maxMinutes + 1;

            const maxOverValMinutes = { startTime: { minutes: overMinutes } };
            assert.strictEqual(isTargetError(maxOverValMinutes, overErr), true);

            const strMaxOverValMinutes = { startTime: { minutes: `${overMinutes}` } };
            assert.strictEqual(isTargetError(strMaxOverValMinutes, overErr), true);
          });
        });
      });

      describe('seconds のチェック', () => {
        describe('項目の存在チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_SECONDS_NOT_EXIST;

          it('存在する場合、該当のエラーメッセージは返さない。', () => {
            const existSeconds = { startTime: { seconds: 1 } };
            assert.strictEqual(isTargetError(existSeconds, err), false);
          });

          it('存在しない場合、該当のエラーメッセージを返す。', () => {
            const notExistSeconds = { startTime: {} };
            assert.strictEqual(isTargetError(notExistSeconds, err), true);
          });
        });


        describe('値の形式チェック', () => {
          const err = ERROR_MSG.SCHEDULE_STARTTIME_SECONDS_INVALID_VAL;

          it('整数値か整数文字列の場合、該当のエラーメッセージは返さない。', () => {
            const plusIntValSeconds = { startTime: { seconds: 1 } };
            assert.strictEqual(isTargetError(plusIntValSeconds, err), false);

            const zeroValSeconds = { startTime: { seconds: 0 } };
            assert.strictEqual(isTargetError(zeroValSeconds, err), false);

            const minusIntValSeconds = { startTime: { seconds: -1 } };
            assert.strictEqual(isTargetError(minusIntValSeconds, err), false);

            const strPlusIntValSeconds = { startTime: { seconds: '01' } };
            assert.strictEqual(isTargetError(strPlusIntValSeconds, err), false);

            const strZeroValSeconds = { startTime: { seconds: '00' } };
            assert.strictEqual(isTargetError(strZeroValSeconds, err), false);

            const strMinusIntValSeconds = { startTime: { seconds: '-1' } };
            assert.strictEqual(isTargetError(strMinusIntValSeconds, err), false);
          });

          it('整数値か整数文字列でない場合、該当のエラーメッセージを返す。', () => {
            const floatValSeconds = { startTime: { seconds: 1.1 } };
            assert.strictEqual(isTargetError(floatValSeconds, err), true);

            const strFloatValSeconds = { startTime: { seconds: '1.1' } };
            assert.strictEqual(isTargetError(strFloatValSeconds, err), true);

            const NaNValSeconds = { startTime: { seconds: NaN } };
            assert.strictEqual(isTargetError(NaNValSeconds, err), true);

            const strValSeconds = { startTime: { seconds: 'hoge' } };
            assert.strictEqual(isTargetError(strValSeconds, err), true);

            const boolValSeconds = { startTime: { seconds: true } };
            assert.strictEqual(isTargetError(boolValSeconds, err), true);

            const objValSeconds = { startTime: { seconds: {} } };
            assert.strictEqual(isTargetError(objValSeconds, err), true);

            const undefinedValSeconds = { startTime: { seconds: undefined } };
            assert.strictEqual(isTargetError(undefinedValSeconds, err), true);

            const nullValSeconds = { startTime: { seconds: null } };
            assert.strictEqual(isTargetError(nullValSeconds, err), true);
          });
        });

        describe('値の範囲チェック', () => {
          const lessErr = ERROR_MSG.SCHEDULE_STARTTIME_SECONDS_MIN_LESS;
          const overErr = ERROR_MSG.SCHEDULE_STARTTIME_SECONDS_MAX_OVER;
          const minSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MIN;
          const maxSeconds = CONST_SET_CRONS.STARTTIME_SECONDS_RANGE_MAX;

          it('既定範囲内の場合、該当のエラーメッセージは返さない。', () => {
            const minValSeconds = { startTime: { seconds: minSeconds } };
            assert.strictEqual(isTargetError(minValSeconds, lessErr), false);
            assert.strictEqual(isTargetError(minValSeconds, overErr), false);

            const maxValSeconds = { startTime: { seconds: maxSeconds } };
            assert.strictEqual(isTargetError(maxValSeconds, lessErr), false);
            assert.strictEqual(isTargetError(maxValSeconds, overErr), false);

            const strMinValSeconds = { startTime: { seconds: `${minSeconds}` } };
            assert.strictEqual(isTargetError(strMinValSeconds, lessErr), false);
            assert.strictEqual(isTargetError(strMinValSeconds, overErr), false);

            const strMaxValSeconds = { startTime: { seconds: `${maxSeconds}` } };
            assert.strictEqual(isTargetError(strMaxValSeconds, lessErr), false);
            assert.strictEqual(isTargetError(strMaxValSeconds, overErr), false);
          });

          it('既定範囲未満の場合、該当のエラーメッセージを返す。', () => {
            const lessSeconds = minSeconds - 1;

            const minLessValSeconds = { startTime: { seconds: lessSeconds } };
            assert.strictEqual(isTargetError(minLessValSeconds, lessErr), true);

            const strMinLessValSeconds = { startTime: { seconds: `${lessSeconds}` } };
            assert.strictEqual(isTargetError(strMinLessValSeconds, lessErr), true);
          });

          it('既定範囲超過の場合、該当のエラーメッセージを返す。', () => {
            const overSeconds = maxSeconds + 1;

            const maxOverValSeconds = { startTime: { seconds: overSeconds } };
            assert.strictEqual(isTargetError(maxOverValSeconds, overErr), true);

            const strMaxOverValSeconds = { startTime: { seconds: `${overSeconds}` } };
            assert.strictEqual(isTargetError(strMaxOverValSeconds, overErr), true);
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

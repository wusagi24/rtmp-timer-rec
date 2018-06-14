import assert from 'power-assert';
import { xmlStrToJs, fetchStreamUrl } from '../src/AgqrStreamUrl';

describe('xmlStrToJs()', () => {
  const xml = '<?xml version="1.0" encoding="UTF-8"?><data><var1>param1</var1><var2>param2</var2></data>';
  const jsObj = { data: { var1: [ 'param1' ], var2: [ 'param2' ] } };

  it('XML文字列が正しくJSオブジェクトに変換されている', () => {
    return xmlStrToJs(xml).then(result => {
      assert.deepEqual(result, jsObj);
    });
  });
});

describe('fetchStreamUrl()', () => {
  it('RTMPのURL文字列で返ってくる', () => {
    const rtmpPattern = /^rtmp:\/\/.*$/;

    return fetchStreamUrl().then(result => {
      assert(typeof result, 'string');
      assert(rtmpPattern.test(result));
    });
  });
});

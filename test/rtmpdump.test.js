import assert from 'power-assert';

import rtmpdump from '../src/rtmpdump';

describe('rtmpdump', () => {
  it('バージョンを表示できる', () => {
    rtmpdump({'-v': null});
  });
});

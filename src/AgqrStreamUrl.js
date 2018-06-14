import fetch from 'node-fetch';
import { parseString } from 'xml2js';

const SERVER_INFO_URL = 'http://www.uniqueradio.jp/agplayerf/getfmsListHD.php';

/**
 * @param {Object} data
 * @return {string}
 */
function takeStreamUrl(data) {
  const serverinfo = data.ag.serverlist[0].serverinfo[0];
  const server = serverinfo.server[0].match(/^.*(rtmp.*)$/)[1];
  const app = serverinfo.app[0];
  const stream = serverinfo.stream[0];
  const streamUrl = `${server}/${app}/${stream}`;

  return streamUrl;
}

/**
 * @param {string} text
 * @return {Promise<Object, Error>}
 */
function xmlStrToJs(text) {
  return new Promise((resolve, reject) => {
    parseString(text, (err, result) => {
      if (err) { reject(err); }
      resolve(result);
    });
  });
}

/**
 * @return {string}
 */
async function fetchStreamUrl() {
  const res = await fetch(SERVER_INFO_URL);
  const resStr = await res.text();
  const data = await xmlStrToJs(resStr);
  const url = takeStreamUrl(data);

  return url;
}

/**
 * @return {{get: Function, clear: Function}}
 */
function AgqrStreamUrl() {
  let urlCache = null;

  return {
    get: async (force = false) => {
      if (force || !urlCache) {
        urlCache = await fetchStreamUrl();
      }
      return urlCache;
    },
    clear: () => {
      urlCache = null;
    }
  };
}

export default AgqrStreamUrl;

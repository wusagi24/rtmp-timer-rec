import fetch from 'node-fetch';
import { parseString } from 'xml2js';

export const SERVER_INFO_URL = 'http://www.uniqueradio.jp/agplayerf/getfmsListHD.php';

/**
 * @param {string} url
 * @return {string}
 */
export async function fetchXmlStr(url) {
  const res = await fetch(url);
  const resStr = await res.text();

  return resStr;
}

/**
 * @param {string} xml
 * @return {Promise<Object, Error>}
 */
export function xmlStrToJs(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) { reject(err); }
      resolve(result);
    });
  });
}

/**
 * @param {Object} data
 * @return {string}
 */
export function takeStreamUrl(data) {
  const serverinfo = data.ag.serverlist[0].serverinfo[0];
  const server = serverinfo.server[0].match(/^.*(rtmp.*)$/)[1];
  const app = serverinfo.app[0];
  const stream = serverinfo.stream[0];
  const streamUrl = `${server}/${app}/${stream}`;

  return streamUrl;
}

/**
 * @param {string} xmlUrl
 * @return {string}
 */
export async function fetchStreamUrl(xmlUrl) {
  const xmlStr = await fetchXmlStr(xmlUrl);
  const data = await xmlStrToJs(xmlStr);
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
        urlCache = await fetchStreamUrl(SERVER_INFO_URL);
      }
      return urlCache;
    },
    clear: () => {
      urlCache = null;
    }
  };
}

export default AgqrStreamUrl;

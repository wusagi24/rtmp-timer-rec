import fetch from 'node-fetch';
import { parseString } from 'xml2js';

const SERVER_INFO_URL = 'http://www.uniqueradio.jp/agplayerf/getfmsListHD.php';

function takeStreamUrl(data) {
  const serverinfo = data.ag.serverlist[0].serverinfo[0];
  const server = serverinfo.server[0].match(/^.*(rtmp.*)$/)[1];
  const app = serverinfo.app[0];
  const stream = serverinfo.stream[0];
  const streamUrl = `${server}/${app}/${stream}`;

  return streamUrl;
}

function xmlText2Js(text) {
  return new Promise((resolve, reject) => {
    parseString(text, (err, result) => {
      if (err) { reject(err); }
      resolve(result);
    });
  });
}

async function fetchStreamUrl() {
  const res = await fetch(SERVER_INFO_URL);
  const resText = await res.text();
  const data = await xmlText2Js(resText);
  const url = takeStreamUrl(data);

  return url;
}

function genGetAgqrStreamUrl() {
  let urlCache = null;

  return {
    get: async (force = false) => {
      if (force || !urlCache) {
        urlCache = await fetchStreamUrl();
        return urlCache;
      }

      return urlCache;
    },
    clear: () => {
      urlCache = null;
    }
  };
}

export default genGetAgqrStreamUrl;

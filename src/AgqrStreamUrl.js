import * as CONFIG from '../config/config.json';
import { fetchXmlStr, parseXml } from './util';

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
  const data = await parseXml(xmlStr);
  const url = takeStreamUrl(data);

  return url;
}

/**
 * @return {{get: function(?boolean): string, clear: function(): void}}
 */
function AgqrStreamUrl() {
  let urlCache = null;

  return {
    get: async (force = false) => {
      if (force || !urlCache) {
        urlCache = await fetchStreamUrl(CONFIG.AGQR_SERVER_INFO_URL);
      }
      return urlCache;
    },
    clear: () => {
      urlCache = null;
    }
  };
}

export default AgqrStreamUrl;

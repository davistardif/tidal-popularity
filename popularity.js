let popularityStats = [];


function findObjectsWithKey(obj, key, result = []) {
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) {
      findObjectsWithKey(obj[i], key, result);
    }
  }
  else if (obj instanceof Object) {
    for (let prop in obj) {
      if (prop == key) {
        result.push(obj);
      }
      else if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
        findObjectsWithKey(obj[prop], key, result);
      }
    }
  }
  return result;
}

function listener(details) {
  // avoid scraping recommendations: only want the tracks in the album/playlist
  if (details.url.includes("/recommendations/"))
    return {};
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    try {
      const responseJSON = JSON.parse(str);
      const scraped = findObjectsWithKey(responseJSON, 'popularity');
      popularityStats = scraped;
    } catch (e) {
      console.log('unparseable json', str);
      console.log(e);
      console.log(e.stack);
    }
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://listen.tidal.com/v1/pages/*", "https://listen.tidal.com/v1/playlists/*/items*"]},
  ["blocking"]
);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getPopularityStats") {
    sendResponse({ popularityStats });
  }
});

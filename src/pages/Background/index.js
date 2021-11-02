console.log('This is the background page.');
console.log('Put the background scripts here.');

let alreadyVisitedOsmosis = false;

const saveDataToDb = (data) => {
  console.log('saveDataToDb', data);
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      console.log('saved data to db');
      chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
    });
  });
};

const getDataFromDb = (key) => {
  console.log('getDataFromDb', key);
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (data) => {
      console.log('got data from db', data);
      chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(data);
    });
  });
};

const sendMsg = (type, data) => {
  console.log('sendMsg', type, data);
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, data }, (response) => {
      console.log('got response', response);
      chrome.runtime.lastError
        ? reject(chrome.runtime.lastError)
        : resolve(data);
    });
  });
};

const sendMsgToContentScript = (type, data) => {
  console.log('sendMsg', type, data);
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('tabs', tabs);
      chrome.tabs.sendMessage(tabs[0].id, { type, data }, (response) => {
        console.log('got response', response);
        chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve(response);
      });
    });
  });
};

const msgHandler = (msg, sender, sendResponse) => {
  console.log('msgHandler', msg, sender);
  const { type, data } = msg;
  switch (type) {
    case 'saveDataToDb':
      saveDataToDb(data)
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err }));
      break;
    case 'getDataFromDb':
      getDataFromDb(data)
        .then((data) => sendResponse({ success: true, data }))
        .catch((err) => sendResponse({ success: false, error: err }));
      break;
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
};

/**
 * Handler for the 'onHistoryStateUpdated' event.
 *
 * @param {!Object} data The event data generated for this request.
 * @private
 */
const onHistoryStateUpdatedListener = (data) => {
  console.log('onHistoryStateUpdatedListener', data);
  const url = data.url;
  if (url.includes('https://app.osmosis.zone/pools')) {
    if (alreadyVisitedOsmosis) {
      return;
    }
    alreadyVisitedOsmosis = true;
    sendMsgToContentScript('onHistoryStateUpdated', {})
      .then(() => console.log('onHistoryStateUpdated sent'))
      .catch((err) => console.error('onHistoryStateUpdated error', err));
  } else {
    alreadyVisitedOsmosis = false;
  }
};

chrome.runtime.onMessage.addListener(msgHandler);

chrome.webNavigation.onHistoryStateUpdated.addListener(
  onHistoryStateUpdatedListener
);

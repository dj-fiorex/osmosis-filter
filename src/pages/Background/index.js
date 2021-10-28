console.log('This is the background page.');
console.log('Put the background scripts here.');

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

chrome.runtime.onMessage.addListener(msgHandler);

export const sendMsg = (type, data) => {
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

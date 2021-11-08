import { startPools } from './modules/osmosis-pools';
import { startAssets } from './modules/osmosis-assets';

const msgHandler = (msg, sender, sendResponse) => {
  console.log('msgHandler', msg, sender);
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  const { type, data } = msg;
  switch (type) {
    case 'startPools':
      console.log('onHistoryStateUpdatedListener startPools');
      startPools();
      sendResponse({ success: true });
      break;
    case 'startAssets':
      console.log('onHistoryStateUpdatedListener startAssets');
      startAssets();
      sendResponse({ success: true });
      break;
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
};

chrome.runtime.onMessage.addListener(msgHandler);

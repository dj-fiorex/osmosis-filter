import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {
  const openPage = (url) => {
    chrome.tabs.create({ active: true, url: url.target.href });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Go to{' '}
          <a
            style={{ color: '#fff' }}
            href="https://app.osmosis.zone/pools"
            onClick={openPage}
            alt="Osmosis Zone"
          >
            Osmosis
          </a>{' '}
          to use this extension.
        </p>
      </header>
    </div>
  );
};

export default Popup;

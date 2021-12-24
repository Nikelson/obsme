import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import is from "is_js";
import RestricedBrowsers from './shared/components/RestricedBrowsers';
import Maintenance from './steps/Maintenance';

const globalConfig = window.globalConfig;

if (is.ie()) {
  require('./assets/styles/main.css');
  require('./assets/styles/not-supported.css');
  ReactDOM.render(
    <React.StrictMode>
      <RestricedBrowsers />
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  require('./assets/fonts/fonts.css');
  require('./assets/styles/main.css');
  require('./assets/styles/branding.css');
  require('./assets/styles/layout.css');
  require('./assets/styles/grid.css');
  require('./assets/styles/forms.css');
  require('./assets/styles/responsive.css');
  require('react-notifications-component/dist/theme.css');
  require('animate.css/animate.css');

  ReactDOM.render(
    <React.StrictMode>
      {globalConfig.maintenance?.isActive ? <Maintenance /> : <App />}
    </React.StrictMode>,
    document.getElementById('root')
  );
}

reportWebVitals();
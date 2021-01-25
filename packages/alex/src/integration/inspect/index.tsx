import React from 'react';
import ReactDOM from 'react-dom';
import { AppRenderer } from '../..';
import '../startup/languages';

ReactDOM.render(
  <AppRenderer
    appConfig={{
      workspaceDir: '..',
    }}
  />,
  document.getElementById('main')
);

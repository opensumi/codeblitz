import React from 'react';
import { createRoot } from 'react-dom/client';
import '@codeblitzjs/ide-core/languages';

import '../index.css';
import { ModelWrapper } from './code';

const root = createRoot(document.getElementById('main') as HTMLElement);
root.render(<ModelWrapper />);

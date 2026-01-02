import type { Preview } from '@storybook/nextjs'
import { ProvidersDecorator } from './decorators/ProvidersDecorator'
import '../src/app/globals.css';
import './storybook.css';

if (typeof global === 'undefined') {
  (window as any).global = window;
}

const preview: Preview = {
  decorators: [
    ProvidersDecorator,
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Guideline',
          ['Introdução', 'Documentacao', 'Dependencias', '*'],
          'Tokens',
          'Components',
          ['Info', 'Atoms', 'Molecules', 'Organisms', '*'],
          'Pages',
          '*',
        ],
        method: 'alphabetical', 
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        query: {},
      },
    },
  },
};

export default preview;
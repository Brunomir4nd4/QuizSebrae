import { addons } from 'storybook/internal/manager-api';
import { create } from 'storybook/internal/theming';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Dhedalos',
    brandUrl: '/',
    brandImage: '/logo_dhedalos.png',
    brandTarget: '_self',
  }),
});
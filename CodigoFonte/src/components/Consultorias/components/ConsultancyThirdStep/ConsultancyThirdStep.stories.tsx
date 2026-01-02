import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ConsultancyThirdStep } from './ConsultancyThirdStep.component';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';

export default {
  title: 'components/Molecules/Consultorias/ConsultancyThirdStep',
  component: ConsultancyThirdStep,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ConsultancyThirdStep>;

const Template: StoryFn<React.ComponentProps<typeof ConsultancyThirdStep>> = (args) => (
  <div style={{ padding: '40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <ConsultancyThirdStep {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  questions: {
    social_network: '',
    main_topic: '',
    specific_questions: '',
  },
  setQuestions: (value) => {
    if (typeof value === 'function') {
      const prevState = {
        social_network: '',
        main_topic: '',
        specific_questions: '',
      };
      console.log('setQuestions', value(prevState));
    } else {
      console.log('setQuestions', value);
    }
  },
  courseSlug: 'generic',
  formSubjects: ['Tema 1', 'Tema 2'],
};

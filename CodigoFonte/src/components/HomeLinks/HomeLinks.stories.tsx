import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { HomeLinks } from './HomeLinks.component';
import { Props as HomeLinksProps } from './HomeLinks.interface';
import { classDataWithProgressiveCertification } from '../../../.storybook/mocks/classData';

export default {
  title: 'components/Molecules/Home/HomeLinks',
  component: HomeLinks,
  tags: ['autodocs'],
  argTypes: {
    userType: {
      control: 'radio',
      options: ['subscriber', 'facilitator', 'supervisor'],
    },
  },
} as Meta<HomeLinksProps>;

const Template: StoryFn<HomeLinksProps> = (args) => {
  return (
    <div style={{ width: '60vw' }}>
      <HomeLinks {...args} />
    </div>
  );
}

export const Facilitador = Template.bind({});
Facilitador.args = {
  userType: 'facilitator',
  classData: {
    ...classDataWithProgressiveCertification,
    enable_strategic_activities: true,
    strategic_activities_number: 1,
    courses: {
      ...classDataWithProgressiveCertification.courses,
      links_and_materials: [
        {
          link: '/http://google.com/salve',
          title: 'Ferramenta do Facilitador',
          icon: '/icon-test.svg',
        },
      ],
    },
  },
};

export const SemMateriais = Template.bind({});
SemMateriais.args = {
  userType: 'subscriber',
  classData: {
    ...classDataWithProgressiveCertification,
    courses: { ...classDataWithProgressiveCertification.courses, links_and_materials: [] },
    links_and_materials: { facilitator: [], subscriber: [] },
    enable_strategic_activities: false,
    strategic_activities_number: 0,
    group_link: '',
  },
};

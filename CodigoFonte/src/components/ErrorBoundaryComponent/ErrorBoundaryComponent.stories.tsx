import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ErrorBoundaryComponent } from './ErrorBoundaryComponent.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { UserContext } from '@/app/providers/UserProvider';

export default {
  title: 'components/Molecules/Modal/ErrorBoundaryComponent',
  component: ErrorBoundaryComponent,
  tags: ['autodocs'],
  decorators: [ProvidersDecorator],
  parameters: {
    layout: 'centered',
    docs: {
			story: {
				inline: false,
				iframeHeight: '600px',
			},
		},
  },
} as Meta<typeof ErrorBoundaryComponent>;

const Template: StoryFn<React.ComponentProps<typeof ErrorBoundaryComponent>> = (args) => {
  const mockUserContextValue = {
    classId: '1',
    error: {
      title: 'Erro de teste',
      message: 'Ocorreu um erro inesperado teste ;) <strong>Tente novamente</strong>.',
      logout: false,
    },
    classesData: {},
    scheduleData: 0,
    themeSettings: null,
    userAppointments: null,
    coursesShowed: false,
    courseLoading: false,
    setClassId: () => {},
    setScheduleData: () => {},
    setError: () => {},
    setUserAppointments: () => {},
    setClassesData: () => {},
    setThemeSettings: () => {},
    setCoursesShowed: () => {},
    setCourseLoading: () => {},
  } as React.ContextType<typeof UserContext>;

  return (
    <div style={{ padding: 20 }}>
      <UserContext.Provider value={mockUserContextValue}>
        <ErrorBoundaryComponent />
      </UserContext.Provider>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

import '@/styles/globals.css';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      defaultTheme: 'Light',
      themes: {
        Light: '',
        Dark: 'dark',
      },
    }),
    Story => (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto w-full max-w-3xl">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      disable: true,
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Foundations', 'Components', 'Check-In'],
      },
    },
    a11y: {
      test: 'todo',
    },
    docs: {
      codePanel: true,
    },
  },
  tags: ['autodocs'],
};

export default preview;

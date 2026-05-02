import { Camera, Check, RotateCcw } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Continue',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button tone="default">Primary</Button>
      <Button tone="secondary">Secondary</Button>
      <Button tone="success">
        <Check />
        Success
      </Button>
      <Button tone="warning">Warning</Button>
      <Button tone="danger">Danger</Button>
      <Button tone="info">Info</Button>
    </div>
  ),
};

export const Contrasts: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-3">
      <Button contrast="solid" tone="default">
        Solid
      </Button>
      <Button contrast="outline" tone="default">
        Outline
      </Button>
      <Button contrast="ghost" tone="default">
        Ghost
      </Button>
    </div>
  ),
};

export const IconActions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>
        <Camera />
        Start camera
      </Button>
      <Button contrast="outline" tone="secondary">
        <RotateCcw />
        Start over
      </Button>
      <Button aria-label="Confirm" size="icon" tone="success">
        <Check />
      </Button>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FacilityCode: Story = {
  render: () => (
    <label className="grid gap-2 text-sm font-semibold">
      Facility code
      <Input aria-label="Facility code" defaultValue="facility-001" size="lg" />
    </label>
  ),
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="grid gap-3">
      <Alert tone="info">Camera scanning needs browser permission. Manual entry is available.</Alert>
      <Alert tone="success">Check-in confirmed and ready for staff inspection.</Alert>
      <Alert tone="warning">You are offline. Manual check-in can still use saved facility IDs.</Alert>
      <Alert tone="danger">Facility ID was not found.</Alert>
    </div>
  ),
};

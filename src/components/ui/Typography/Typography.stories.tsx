import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Typography } from './Typography';

const meta = {
  title: 'Foundations/Typography',
  component: Typography,
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scales: Story = {
  render: () => (
    <div className="grid gap-4">
      <Typography scale="title">Facility Check-In</Typography>
      <Typography scale="section">Check-in confirmed</Typography>
      <Typography scale="body">Use the camera scanner or enter a facility ID manually.</Typography>
      <Typography scale="bodySm" tone="muted">
        Example: facility-001
      </Typography>
      <Typography scale="value">facility-001</Typography>
      <Typography scale="label">Membership status</Typography>
    </div>
  ),
};

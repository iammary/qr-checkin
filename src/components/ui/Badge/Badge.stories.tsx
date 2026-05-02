import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: 'Active',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="default">Member</Badge>
      <Badge status="neutral">Fallback</Badge>
      <Badge status="info">Camera</Badge>
      <Badge status="success">Checked in</Badge>
      <Badge status="warning">Offline</Badge>
      <Badge status="danger">Invalid</Badge>
    </div>
  ),
};

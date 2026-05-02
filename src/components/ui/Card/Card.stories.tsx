import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from '../Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {(['panel', 'muted', 'info', 'success', 'warning', 'danger'] as const).map(tone => (
        <Card key={tone} tone={tone}>
          <CardHeader>
            <CardTitle>{tone}</CardTitle>
            <CardDescription>Reusable surface tone.</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};

export const CheckInSurface: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <Badge status="success">Ready</Badge>
        <CardTitle>City Fitness Central</CardTitle>
        <CardDescription>123 Market St, Sydney, NSW 2000</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 text-sm text-muted-foreground">Surface content uses rows and dividers instead of nested cards.</CardContent>
    </Card>
  ),
};

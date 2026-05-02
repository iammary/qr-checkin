import { CheckCircle2, RotateCcw } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import type { CheckInResult } from '@/lib/checkIn/checkIn.type';

type CheckInConfirmationProps = {
  onReset: () => void;
  result: CheckInResult;
};

const formatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid gap-1 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export const CheckInConfirmation = ({ onReset, result }: CheckInConfirmationProps) => (
  <Card as="section" className="grid gap-5" padding="lg" tone="success">
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <Badge status="success" size="lg">
          Confirmed
        </Badge>
        <CheckCircle2 aria-hidden="true" className="size-9 text-success" />
      </div>
      <div className="grid gap-2">
        <Typography scale="title">Check-in confirmed</Typography>
        <Typography tone="muted">Show this screen to facility staff if requested.</Typography>
      </div>
    </div>

    <div className="rounded-lg border border-success/25 bg-card p-4">
      <DetailRow label="Member" value={result.member.name} />
      <DetailRow label="Membership" value={result.member.membershipType ?? 'Member'} />
      <DetailRow label="Status" value={result.member.membershipStatus ?? 'Confirmed'} />
      <DetailRow label="Facility" value={result.facility.name} />
      <DetailRow label="Address" value={result.facility.address} />
      <DetailRow label="Checked in" value={formatter.format(new Date(result.checkedInAt))} />
    </div>

    <Button onClick={onReset} tone="success" type="button">
      <RotateCcw />
      Start another check-in
    </Button>
  </Card>
);

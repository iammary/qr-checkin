import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import type { CurrentMember } from '@/lib/checkIn/checkIn.type';

type MemberSummaryProps = {
  user: CurrentMember;
};

const formatMembership = (value?: string) => (value ? `${value.slice(0, 1).toUpperCase()}${value.slice(1)}` : 'Member');

export const MemberSummary = ({ user }: MemberSummaryProps) => (
  <Card as="section" className="grid gap-4" padding="md">
    <div className="flex items-start justify-between gap-4">
      <div className="grid gap-1">
        <Typography as="p" scale="label" tone="muted">
          Current member
        </Typography>
        <Typography as="h2" scale="section">
          {user.name}
        </Typography>
        <Typography scale="bodySm" tone="muted">
          {user.email}
        </Typography>
      </div>
      <Badge status={user.membershipStatus === 'active' ? 'success' : 'warning'}>{formatMembership(user.membershipStatus)}</Badge>
    </div>
    <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
      <div className="grid gap-1">
        <span className="text-muted-foreground">Membership</span>
        <span className="font-semibold">{formatMembership(user.membershipDetails?.tier ?? user.membershipType)}</span>
      </div>
      <div className="grid gap-1">
        <span className="text-muted-foreground">Access</span>
        <span className="font-semibold">{user.membershipDetails?.accessLevel ?? 'Standard'}</span>
      </div>
    </div>
  </Card>
);

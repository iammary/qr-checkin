import type { FormEvent } from 'react';
import { Keyboard } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ManualEntryFormProps = {
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  value: string;
};

export const ManualEntryForm = ({ onChange, onSubmit, value }: ManualEntryFormProps) => (
  <form className="grid gap-3" onSubmit={onSubmit}>
    <div className="grid gap-2">
      <label className="text-sm font-semibold" htmlFor="facility-code">
        Facility ID
      </label>
      <Input
        aria-describedby="facility-code-hint"
        autoCapitalize="none"
        autoComplete="off"
        id="facility-code"
        inputMode="text"
        onChange={event => onChange(event.target.value)}
        placeholder="facility-001"
        size="lg"
        spellCheck={false}
        value={value}
      />
      <p className="text-sm leading-6 text-muted-foreground" id="facility-code-hint">
        QR content can be plain facility ID text. Try facility-001.
      </p>
    </div>
    <Button className="w-full" size="lg" type="submit">
      <Keyboard />
      Check in manually
    </Button>
  </form>
);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { fixtureOptions, type FixtureName } from "@/features/fixtures/fixtures";

type FixtureSelectorProps = {
  value: FixtureName;
  onValueChange: (value: FixtureName) => void;
};

export function FixtureSelector({
  value,
  onValueChange,
}: FixtureSelectorProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor="fixture">
        Fixture session
      </label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full" id="fixture">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fixtureOptions.map((fixture) => (
            <SelectItem key={fixture.value} value={fixture.value}>
              {fixture.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

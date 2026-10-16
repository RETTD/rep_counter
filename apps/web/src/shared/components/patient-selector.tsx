import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  patients,
  type PatientId,
} from "@/features/session-results/session-results-api";

type PatientSelectorProps = {
  disabled: boolean;
  onValueChange: (value: PatientId) => void;
  value: PatientId;
};

export function PatientSelector({
  disabled,
  onValueChange,
  value,
}: PatientSelectorProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor="patient">
        Patient
      </label>
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full" id="patient">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import { type FixtureName } from "@/features/fixtures/fixtures";
import { type PatientId } from "@/features/session-results/session-results-api";
import { FixtureSelector } from "@/shared/components/fixture-selector";
import { PatientSelector } from "@/shared/components/patient-selector";

type SessionConfigurationProps = {
  fixtureName: FixtureName;
  isPatientSelectionDisabled: boolean;
  onFixtureNameChange: (fixtureName: FixtureName) => void;
  onPatientIdChange: (patientId: PatientId) => void;
  patientId: PatientId;
};

export function SessionConfiguration({
  fixtureName,
  isPatientSelectionDisabled,
  onFixtureNameChange,
  onPatientIdChange,
  patientId,
}: SessionConfigurationProps) {
  return (
    <div className="grid gap-6">
      <PatientSelector
        disabled={isPatientSelectionDisabled}
        onValueChange={onPatientIdChange}
        value={patientId}
      />
      <FixtureSelector
        onValueChange={onFixtureNameChange}
        value={fixtureName}
      />
    </div>
  );
}

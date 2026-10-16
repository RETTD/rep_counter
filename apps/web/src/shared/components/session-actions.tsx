import { Button } from "@/shared/ui/button";

type SessionActionsProps = {
  disabled: boolean;
  isSaving: boolean;
  onSave: () => void;
};

export function SessionActions({
  disabled,
  isSaving,
  onSave,
}: SessionActionsProps) {
  return (
    <Button disabled={disabled || isSaving} onClick={onSave} type="button">
      {isSaving ? "Saving…" : "Save session result"}
    </Button>
  );
}

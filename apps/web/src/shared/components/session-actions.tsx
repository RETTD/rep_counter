import { Button } from "@/shared/ui/button";

type SessionActionsProps = {
  disabled: boolean;
  isSaving: boolean;
  isRetry: boolean;
  onSave: () => void;
};

export function SessionActions({
  disabled,
  isSaving,
  isRetry,
  onSave,
}: SessionActionsProps) {
  return (
    <Button disabled={disabled || isSaving} onClick={onSave} type="button">
      {isSaving
        ? "Saving…"
        : isRetry
          ? "Retry saving session"
          : "Save session result"}
    </Button>
  );
}

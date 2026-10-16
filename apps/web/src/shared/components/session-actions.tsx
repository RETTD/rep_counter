import { Button } from "@/shared/ui/button";

type SessionActionsProps = {
  isSaving: boolean;
  isRetry: boolean;
  onSave: () => void;
};

export function SessionActions({
  isSaving,
  isRetry,
  onSave,
}: SessionActionsProps) {
  return (
    <Button disabled={isSaving} onClick={onSave} type="button">
      {isSaving
        ? "Saving…"
        : isRetry
          ? "Retry saving session"
          : "Save session result"}
    </Button>
  );
}

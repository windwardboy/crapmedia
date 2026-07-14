type PlaybackErrorBannerProps = {
  message: string;
  onDismiss?: () => void;
  onSkip?: () => void;
  hasNext?: boolean;
};

export function PlaybackErrorBanner({
  message,
  onDismiss,
  onSkip,
  hasNext,
}: PlaybackErrorBannerProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      <p>{message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {hasNext && onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="cm-btn cm-btn-primary px-4 py-1.5 text-xs"
          >
            Skip to next
          </button>
        ) : null}
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="cm-btn cm-btn-outline px-4 py-1.5 text-xs"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}

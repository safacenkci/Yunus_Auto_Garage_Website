let lockCount = 0;

/** Locks body scroll while any admin overlay is open. Returns unlock fn. */
export function lockAdminOverlay(): () => void {
  if (typeof document === 'undefined') {
    return () => undefined;
  }
  lockCount += 1;
  document.body.style.overflow = 'hidden';
  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = '';
    }
  };
}

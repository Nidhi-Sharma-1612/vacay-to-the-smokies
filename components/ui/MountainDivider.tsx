// Layered ridge silhouette used to blend one section into the next.
export function MountainDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-14 w-full sm:h-20 ${className}`}
    >
      <path
        fill="currentColor"
        fillOpacity="0.45"
        d="M0 80 L120 52 L230 74 L360 30 L480 66 L600 40 L720 70 L860 24 L990 62 L1110 38 L1250 70 L1360 46 L1440 60 V120 H0 Z"
      />
      <path
        fill="currentColor"
        d="M0 98 L150 76 L270 92 L420 62 L560 90 L700 70 L840 94 L980 66 L1120 90 L1270 72 L1440 88 V120 H0 Z"
      />
    </svg>
  );
}

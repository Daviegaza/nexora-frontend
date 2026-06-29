import React from 'react';

/** Accessibility: Skip-to-content link for keyboard users */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-nexora-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:text-sm focus:font-medium"
    >
      Skip to main content
    </a>
  );
}

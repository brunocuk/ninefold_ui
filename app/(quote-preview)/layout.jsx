// app/(quote-preview)/layout.jsx
// Layout for quote preview and questionnaire pages - hides website chrome

'use client';

import { useEffect } from 'react';

export default function QuotePreviewLayout({ children }) {
  useEffect(() => {
    // Hide website header, footer, and blur effects
    const style = document.createElement('style');
    style.id = 'quote-preview-hide-chrome';
    style.innerHTML = `
      /* Hide header and footer */
      body > header,
      body > footer,
      body > nav,
      #__next > header,
      #__next > footer,
      [data-testid="header"],
      [data-testid="footer"] {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      /* Hide GradualBlur component */
      .gradual-blur,
      .gradual-blur-page,
      .gradual-blur-parent,
      .gradual-blur-inner {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById('quote-preview-hide-chrome');
      if (styleEl) styleEl.remove();
    };
  }, []);

  return children;
}

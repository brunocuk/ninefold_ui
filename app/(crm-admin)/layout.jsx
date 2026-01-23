// app/(crm-admin)/layout.jsx
'use client';

import { useEffect } from 'react';

export default function CRMGroupLayout({ children }) {
  useEffect(() => {
    // Hide the gradual blur effect in CRM
    const style = document.createElement('style');
    style.id = 'hide-crm-blur';
    style.innerHTML = `
      .gradual-blur-page {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById('hide-crm-blur');
      if (styleEl) styleEl.remove();
    };
  }, []);

  return <>{children}</>;
}
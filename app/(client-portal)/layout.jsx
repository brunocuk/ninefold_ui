// app/(client-portal)/layout.jsx
// Root layout for client portal route group

import { Nohemi } from '@/app/layout';

export const metadata = {
  title: 'Ninefold Portal',
  description: 'Klijentski portal - pregledajte projekte, odobrite sadržaj, pratite napredak',
};

export default function ClientPortalLayout({ children }) {
  return children;
}

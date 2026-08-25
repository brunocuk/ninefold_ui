// app/(sales)/layout.jsx
// Root layout for sales route group

export const metadata = {
  title: 'Ninefold Sales',
  description: 'Prodajni panel - leadovi, ponude i zarada',
  robots: { index: false, follow: false },
};

export default function SalesGroupLayout({ children }) {
  return children;
}

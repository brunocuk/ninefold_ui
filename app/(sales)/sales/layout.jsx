'use client';

// Sales module layout: sidebar + auth guard, Mono design language.
// Structural clone of the client portal layout, scoped to sales_users.

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSalesUser, salesSignOut } from '@/lib/salesAuth';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  Presentation,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const BG = '#080808';
const FG = '#F2F2F2';
const MUTED = '#8E8E8E';
const LINE = 'rgba(255, 255, 255, 0.07)';
const SIGNAL = '#00FF94';

export default function SalesLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  async function checkUser() {
    const currentUser = await getSalesUser();
    if (!currentUser && pathname !== '/sales/login') {
      router.push('/sales/login');
      setLoading(false);
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }

  useEffect(() => {
    checkUser();
  }, [pathname]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    await salesSignOut();
    router.push('/sales/login');
  };

  if (loading && pathname !== '/sales/login') {
    return (
      <div style={{
        minHeight: '100vh',
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: `2px solid ${LINE}`,
          borderTopColor: SIGNAL,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (pathname === '/sales/login') {
    return children;
  }

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/sales', icon: LayoutDashboard, label: 'Pregled', exact: true },
    { href: '/sales/leads', icon: Users, label: 'Leadovi' },
    { href: '/sales/quotes', icon: FileText, label: 'Ponude' },
    { href: '/sales/earnings', icon: Wallet, label: 'Zarada' },
    { href: '/sales/pitch', icon: Presentation, label: 'Prezentacija' },
    { href: '/sales/settings', icon: Settings, label: 'Postavke' },
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        body {
          background: ${BG} !important;
          color: ${FG} !important;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }

        body > header, body > footer, body > nav,
        #__next > header, #__next > footer, #__next > nav,
        [role="banner"], [role="navigation"]:not(.sales-nav), [role="contentinfo"],
        footer, .footer, #footer, .site-footer {
          display: none !important;
        }

        .gradual-blur,
        .gradual-blur-page,
        .gradual-blur-parent {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .sales-container {
          position: relative;
          z-index: 9999;
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: rgba(8, 8, 8, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid ${LINE};
          z-index: 1001;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-logo {
          font-size: 1.1rem;
          font-weight: 600;
          color: ${FG};
        }

        .mobile-menu-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: ${FG};
          cursor: pointer;
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1002;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .mobile-overlay.active { opacity: 1; }

        /* Sidebar */
        .sidebar {
          width: 240px;
          background: #0F0F0F;
          border-right: 1px solid rgba(255, 255, 255, 0.07);
          position: fixed;
          height: 100vh;
          overflow: hidden;
          z-index: 1003;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 24px 20px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 8px 12px;
          overflow-y: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          margin: 2px 0;
          color: #8E8E8E;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          border-radius: 10px;
          transition: all 0.15s ease;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #F2F2F2;
        }
        .nav-link.active {
          background: rgba(255, 255, 255, 0.08);
          color: #F2F2F2;
        }
        .nav-link.active .nav-icon { color: #00FF94; }

        .nav-icon { width: 20px; height: 20px; flex-shrink: 0; }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 0.85rem;
          color: #F2F2F2;
        }

        .user-info { display: flex; flex-direction: column; }
        .user-name { font-size: 0.85rem; font-weight: 500; color: #F2F2F2; }
        .user-role { font-size: 0.7rem; color: #8E8E8E; }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #8E8E8E;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .logout-btn:hover { background: rgba(255, 255, 255, 0.05); color: #F2F2F2; }

        /* Main Content */
        .main-content {
          margin-left: 240px;
          flex: 1;
          min-height: 100vh;
          background: ${BG};
        }

        .content-body {
          padding: 24px 48px 48px;
          max-width: 1400px;
        }

        @media (max-width: 1024px) {
          .mobile-header { display: flex; }
          .mobile-overlay {
            display: block;
            pointer-events: ${isMobileOpen ? 'auto' : 'none'};
          }
          .sidebar {
            width: 280px;
            transform: translateX(${isMobileOpen ? '0' : '-100%'});
            transition: transform 0.3s ease;
          }
          .main-content { margin-left: 0; padding-top: 56px; }
          .content-body { padding: 24px 20px; }
        }

        @media (max-width: 640px) {
          .sidebar { width: 100%; max-width: 300px; }
          .content-body { padding: 20px 16px; }
        }

        @media print {
          .sidebar, .mobile-header, .mobile-overlay { display: none !important; }
          .main-content { margin-left: 0 !important; }
          .content-body { padding: 0 !important; max-width: none !important; }
        }
      `}</style>

      <div className="sales-container">
        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="mobile-logo">Ninefold</div>
          <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Mobile Overlay */}
        <div
          className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <img src="/ninefold-logo.svg" alt="Ninefold" style={{ height: 15, width: 'auto' }} />
          </div>

          <nav className="sidebar-nav sales-nav">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : isActive(item.href);
              return (
                <Link key={item.href} href={item.href} className={`nav-link ${active ? 'active' : ''}`}>
                  <item.icon size={20} className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'P'}</div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Prodaja'}</div>
                <div className="user-role">Prodaja · Ninefold</div>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Odjava</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-body" style={{ paddingTop: 40 }}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

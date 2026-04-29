'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getPortalUser, portalSignOut } from '@/lib/portalAuth';
import { PortalThemeProvider, usePortalTheme, themes } from '@/lib/portalTheme';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  FileEdit,
  FileBarChart,
  Receipt,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

function PortalLayoutInner({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = usePortalTheme();
  const t = themes[theme];

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  async function checkUser() {
    const currentUser = await getPortalUser();
    if (!currentUser && pathname !== '/portal/login') {
      router.push('/portal/login');
      setLoading(false);
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }

  const handleLogout = async () => {
    await portalSignOut();
    router.push('/portal/login');
  };

  if (loading && pathname !== '/portal/login') {
    return (
      <div style={{
        minHeight: '100vh',
        background: t.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: `2px solid ${t.border}`,
          borderTopColor: t.accent,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (pathname === '/portal/login') {
    return children;
  }

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/portal', icon: LayoutDashboard, label: 'Pregled', exact: true },
    { href: '/portal/content', icon: Calendar, label: 'Sadržaj' },
    { href: '/portal/projects', icon: FolderKanban, label: 'Projekti' },
    { href: '/portal/requests', icon: FileEdit, label: 'Zahtjevi' },
    { href: '/portal/reports', icon: FileBarChart, label: 'Izvještaji' },
    { href: '/portal/invoices', icon: Receipt, label: 'Ponude' },
    { href: '/portal/messages', icon: MessageSquare, label: 'Poruke' },
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        body {
          background: ${t.bg} !important;
          color: ${t.text} !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }

        body > header, body > footer, body > nav,
        #__next > header, #__next > footer, #__next > nav,
        [role="banner"], [role="navigation"]:not(.portal-nav), [role="contentinfo"],
        footer, .footer, #footer, .site-footer {
          display: none !important;
        }

        /* Hide the GradualBlur component */
        .gradual-blur,
        .gradual-blur-page,
        .gradual-blur-parent {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* Force portal to cover full viewport */
        .portal-container {
          position: relative;
          z-index: 9999;
        }

        .portal-container {
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
          background: ${theme === 'light' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid ${t.border};
          z-index: 1001;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-logo {
          font-size: 1.1rem;
          font-weight: 600;
          color: ${t.text};
        }

        .mobile-menu-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: ${t.text};
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
          background: #1c1c1e;
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

        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          overflow: hidden;
        }
        .logo-icon img { width: 100%; height: 100%; object-fit: contain; }

        .logo-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f5f5f7;
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
          color: #86868b;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          border-radius: 10px;
          transition: all 0.15s ease;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #f5f5f7;
        }
        .nav-link.active {
          background: rgba(255, 255, 255, 0.08);
          color: #f5f5f7;
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
          background: #2c2c2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 0.85rem;
          color: #f5f5f7;
        }

        .user-info { display: flex; flex-direction: column; }
        .user-name { font-size: 0.85rem; font-weight: 500; color: #f5f5f7; }
        .user-company { font-size: 0.7rem; color: #48484a; }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #86868b;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .logout-btn:hover { background: rgba(255, 255, 255, 0.05); color: #f5f5f7; }

        /* Main Content */
        .main-content {
          margin-left: 240px;
          flex: 1;
          min-height: 100vh;
          background: ${t.bg};
        }

        .content-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 48px;
          position: sticky;
          top: 0;
          z-index: 100;
          background: ${theme === 'light' ? 'rgba(245, 245, 247, 0.8)' : 'rgba(0, 0, 0, 0.8)'};
          backdrop-filter: blur(20px);
        }

        .theme-toggle {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${t.bgCard};
          border: 1px solid ${t.border};
          border-radius: 50%;
          color: ${t.textSecondary};
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-toggle:hover {
          border-color: ${t.accent};
          color: ${t.accent};
        }

        .content-body {
          padding: 24px 48px 48px;
          max-width: 1400px;
        }

        /* Mobile responsive */
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
          .content-topbar { padding: 12px 20px; }
          .content-body { padding: 24px 20px; }
        }

        @media (max-width: 640px) {
          .sidebar { width: 100%; max-width: 300px; }
          .content-body { padding: 20px 16px; }
        }
      `}</style>

      <div className="portal-container">
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
            <div className="logo-icon">
              <img src="/favicon.ico" alt="Ninefold" />
            </div>
            <div className="logo-text">Ninefold</div>
          </div>

          <nav className="sidebar-nav portal-nav">
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
              <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'K'}</div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Klijent'}</div>
                <div className="user-company">{user?.client?.company || user?.client?.name || ''}</div>
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
          <header className="content-topbar">
            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Tamni način' : 'Svijetli način'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </header>
          <div className="content-body">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default function PortalLayout({ children }) {
  return (
    <PortalThemeProvider>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </PortalThemeProvider>
  );
}

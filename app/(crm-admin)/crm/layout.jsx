"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, onAuthStateChange, signOut } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FolderKanban,
  FileText,
  TrendingUp,
  BarChart3,
  Calendar,
  Edit,
  ArrowLeft,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  Menu,
  X,
  Settings,
  FileBarChart,
  Sparkles,
  Share2,
  Image,
  CalendarCheck,
  FileEdit,
  CheckSquare,
  Receipt,
  Handshake,
} from 'lucide-react';
import { ToastProvider } from '@/components/Toast';

export default function CRMLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    checkUser();

    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState === 'true') {
      setIsCollapsed(true);
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        setLoading(false);

        // If on login page, redirect to dashboard
        if (pathname === "/crm/login") {
          router.push("/crm");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
        router.push("/crm/login");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  async function checkUser() {
    const currentUser = await getUser();

    if (!currentUser && pathname !== "/crm/login") {
      router.push("/crm/login");
      setLoading(false);
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const [avatar, setAvatar] = useState(null);
  const [profileName, setProfileName] = useState('Admin');

  // Load settings via API route
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      try {
        const tokenData = localStorage.getItem('supabase.auth.token');
        const parsed = tokenData ? JSON.parse(tokenData) : null;
        const accessToken = parsed?.access_token;

        if (accessToken) {
          const response = await fetch('/api/settings', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const { data: settings } = await response.json();
            if (settings) {
              if (settings.avatar) setAvatar(settings.avatar);
              if (settings.profile?.name) setProfileName(settings.profile.name);
            }
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    if (user) {
      loadSettings();
    }

    // Listen for custom events (same tab updates)
    const handleAvatarChanged = (e) => {
      setAvatar(e.detail);
    };

    const handleSettingsChanged = (e) => {
      if (e.detail.avatar) setAvatar(e.detail.avatar);
      if (e.detail.profile?.name) setProfileName(e.detail.profile.name);
    };

    window.addEventListener('avatar-changed', handleAvatarChanged);
    window.addEventListener('settings-changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('avatar-changed', handleAvatarChanged);
      window.removeEventListener('settings-changed', handleSettingsChanged);
    };
  }, [user]);

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  // Avatar presets using Robohash (same as settings page)
  const PRESET_AVATAR_URLS = {
    'robot': 'https://robohash.org/ninefold?set=set1&size=200x200&bgset=bg2',
    'monster': 'https://robohash.org/coder?set=set2&size=200x200&bgset=bg2',
    'head': 'https://robohash.org/hacker?set=set3&size=200x200&bgset=bg2',
    'kitten': 'https://robohash.org/dev?set=set4&size=200x200&bgset=bg2',
    'alien': 'https://robohash.org/ninja?set=set1&size=200x200&bgset=bg1',
  };

  const getAvatarStyle = () => {
    if (!avatar) {
      return { backgroundImage: `url(${PRESET_AVATAR_URLS['robot']})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }

    if (avatar.type === 'custom' && avatar.customUrl) {
      return {
        backgroundImage: `url(${avatar.customUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }

    const url = PRESET_AVATAR_URLS[avatar.presetId] || PRESET_AVATAR_URLS['robot'];
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  };

  // Show loading while checking auth
  if (loading && pathname !== "/crm/login") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8E8E8E",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: "0.8rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Provjera prijave...
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/crm/login");
  };

  // If on login page, show it without sidebar
  if (pathname === "/crm/login") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <ToastProvider>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
      />
      <style jsx global>{`
        /* Hide website header/footer */
        body > header,
        body > footer,
        body > nav,
        #__next > header,
        #__next > footer,
        #__next > nav,
        [role="banner"],
        [role="navigation"]:not(.crm-nav),
        [role="contentinfo"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        body {
          background: #080808 !important;
          color: #F2F2F2 !important;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        .crm-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(8, 8, 8, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          z-index: 1001;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-logo {
          font-size: 1.05rem;
          font-weight: 500;
          color: #F2F2F2;
          letter-spacing: 0.01em;
        }

        .mobile-menu-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          color: #C9C9C9;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-menu-btn:hover {
          border-color: rgba(255, 255, 255, 0.16);
          color: #F2F2F2;
        }

        /* Mobile Overlay */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1002;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mobile-overlay.active {
          opacity: 1;
        }

        /* Sidebar */
        .sidebar {
          width: ${isCollapsed ? '72px' : '240px'};
          background: #080808;
          border-right: 1px solid rgba(255, 255, 255, 0.07);
          position: fixed;
          height: 100vh;
          overflow: hidden;
          z-index: 1003;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${isCollapsed ? '16px 12px' : '16px'};
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          flex-shrink: 0;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-text {
          font-size: 1.05rem;
          font-weight: 500;
          color: #F2F2F2;
          letter-spacing: 0.01em;
          white-space: nowrap;
          opacity: ${isCollapsed ? '0' : '1'};
          width: ${isCollapsed ? '0' : 'auto'};
          transition: all 0.2s ease;
        }

        .collapse-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: #8E8E8E;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .collapse-btn:hover {
          border-color: rgba(255, 255, 255, 0.16);
          color: #F2F2F2;
        }

        .sidebar-nav {
          flex: 1;
          min-height: 0;
          padding: 8px 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        .nav-section {
          margin-bottom: 4px;
        }

        .nav-label {
          padding: ${isCollapsed ? '8px 0' : '10px 16px 6px'};
          font-family: ui-monospace, Menlo, monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #5C5C5C;
          font-weight: 400;
          opacity: ${isCollapsed ? '0' : '1'};
          height: ${isCollapsed ? '0' : 'auto'};
          overflow: hidden;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${isCollapsed ? '10px 0' : '10px 14px'};
          margin: ${isCollapsed ? '2px 8px' : '2px 8px'};
          color: #8E8E8E;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          border-radius: 10px;
          position: relative;
          justify-content: ${isCollapsed ? 'center' : 'flex-start'};
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #F2F2F2;
        }

        .nav-link.active {
          background: rgba(255, 255, 255, 0.05);
          color: #F2F2F2;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          right: ${isCollapsed ? '6px' : '12px'};
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #F2F2F2;
        }

        .nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: transparent;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .nav-text {
          opacity: ${isCollapsed ? '0' : '1'};
          width: ${isCollapsed ? '0' : 'auto'};
          overflow: hidden;
          transition: all 0.2s ease;
        }

        /* Top Bar with User Profile */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          padding: 16px 0;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px 8px 8px;
          background: #0F0F0F;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-menu:hover {
          border-color: rgba(255, 255, 255, 0.16);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: #000;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #F2F2F2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .user-email {
          font-size: 0.7rem;
          color: #8E8E8E;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .top-bar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          color: #8E8E8E;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .top-bar-btn:hover {
          color: #F2F2F2;
          border-color: rgba(255, 255, 255, 0.16);
        }

        .top-bar-btn.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 640px) {
          .user-info {
            display: none;
          }

          .user-menu {
            padding: 6px;
            border-radius: 50%;
          }

          .top-bar {
            padding: 12px 0;
            margin-bottom: 16px;
          }
        }

        .main-content {
          margin-left: ${isCollapsed ? '72px' : '240px'};
          flex: 1;
          padding: 40px;
          max-width: 1600px;
          min-height: 100vh;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 1024px) {
          .mobile-header {
            display: flex;
          }

          .mobile-overlay {
            display: block;
            pointer-events: ${isMobileOpen ? 'auto' : 'none'};
          }

          .sidebar {
            width: 300px;
            transform: translateX(${isMobileOpen ? '0' : '-100%'});
            box-shadow: ${isMobileOpen ? '0 0 60px rgba(0, 0, 0, 0.5)' : 'none'};
          }

          .collapse-btn {
            display: none;
          }

          .mobile-close-btn {
            display: flex;
          }

          .main-content {
            margin-left: 0;
            padding: 80px 20px 20px 20px;
          }

          .logo-text,
          .nav-text,
          .user-info,
          .action-text {
            opacity: 1 !important;
            width: auto !important;
          }

          .nav-label {
            opacity: 1 !important;
            height: auto !important;
            padding: 12px 20px !important;
          }

          .nav-link {
            justify-content: flex-start !important;
            padding: 14px 20px !important;
          }

          .user-card {
            justify-content: flex-start !important;
          }

          .user-actions {
            flex-direction: row !important;
          }

          .user-action-btn {
            padding: 10px 12px !important;
          }
        }

        @media (max-width: 640px) {
          .sidebar {
            width: 100%;
            max-width: 320px;
          }

          .main-content {
            padding: 76px 16px 16px 16px;
          }
        }

        /* Hide scrollbar but keep functionality */
        .sidebar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .sidebar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>

      <div className="crm-container">
        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="mobile-logo">Ninefold</div>
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
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
            <div className="logo-container">
              <div className="logo-icon">
                <img src="/ninefold-icon.svg" alt="Ninefold" />
              </div>
              <div className="logo-text">Ninefold</div>
            </div>
            <button
              className="collapse-btn"
              onClick={toggleSidebar}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="sidebar-nav crm-nav" data-lenis-prevent>
            <div className="nav-section">
              <div className="nav-label">Overview</div>
              <Link
                href="/crm"
                className={`nav-link ${pathname === "/crm" ? "active" : ""}`}
                title={isCollapsed ? "Dashboard" : ""}
              >
                <span className="nav-icon-wrapper"><LayoutDashboard size={18} /></span>
                <span className="nav-text">Dashboard</span>
              </Link>
              <Link
                href="/crm/analytics"
                className={`nav-link ${isActive("/crm/analytics") ? "active" : ""}`}
                title={isCollapsed ? "Analytics" : ""}
              >
                <span className="nav-icon-wrapper"><BarChart3 size={18} /></span>
                <span className="nav-text">Analytics</span>
              </Link>
              <Link
                href="/crm/calendar"
                className={`nav-link ${isActive("/crm/calendar") ? "active" : ""}`}
                title={isCollapsed ? "Calendar" : ""}
              >
                <span className="nav-icon-wrapper"><Calendar size={18} /></span>
                <span className="nav-text">Calendar</span>
              </Link>
              <Link
                href="/crm/todos"
                className={`nav-link ${isActive("/crm/todos") ? "active" : ""}`}
                title={isCollapsed ? "Todos" : ""}
              >
                <span className="nav-icon-wrapper"><CheckSquare size={18} /></span>
                <span className="nav-text">Todos</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Sales</div>
              <Link
                href="/crm/prospects"
                className={`nav-link ${isActive("/crm/prospects") ? "active" : ""}`}
                title={isCollapsed ? "Prospects" : ""}
              >
                <span className="nav-icon-wrapper"><Target size={18} /></span>
                <span className="nav-text">Prospects</span>
              </Link>
              <Link
                href="/crm/leads"
                className={`nav-link ${isActive("/crm/leads") ? "active" : ""}`}
                title={isCollapsed ? "Leads" : ""}
              >
                <span className="nav-icon-wrapper"><UserPlus size={18} /></span>
                <span className="nav-text">Leads</span>
              </Link>
              <Link
                href="/crm/clients"
                className={`nav-link ${isActive("/crm/clients") ? "active" : ""}`}
                title={isCollapsed ? "Clients" : ""}
              >
                <span className="nav-icon-wrapper"><Users size={18} /></span>
                <span className="nav-text">Clients</span>
              </Link>
              <Link
                href="/crm/quotes"
                className={`nav-link ${isActive("/crm/quotes") ? "active" : ""}`}
                title={isCollapsed ? "Quotes" : ""}
              >
                <span className="nav-icon-wrapper"><FileText size={18} /></span>
                <span className="nav-text">Quotes</span>
              </Link>
              <Link
                href="/crm/sales"
                className={`nav-link ${isActive("/crm/sales") ? "active" : ""}`}
                title={isCollapsed ? "Sales Team" : ""}
              >
                <span className="nav-icon-wrapper"><Handshake size={18} /></span>
                <span className="nav-text">Sales Team</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Projects</div>
              <Link
                href="/crm/projects"
                className={`nav-link ${isActive("/crm/projects") ? "active" : ""}`}
                title={isCollapsed ? "Projects" : ""}
              >
                <span className="nav-icon-wrapper"><FolderKanban size={18} /></span>
                <span className="nav-text">Projects</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Recurring</div>
              <Link
                href="/crm/recurring"
                className={`nav-link ${isActive("/crm/recurring") ? "active" : ""}`}
                title={isCollapsed ? "Revenue" : ""}
              >
                <span className="nav-icon-wrapper"><TrendingUp size={18} /></span>
                <span className="nav-text">Revenue</span>
              </Link>
              <Link
                href="/crm/reports"
                className={`nav-link ${isActive("/crm/reports") ? "active" : ""}`}
                title={isCollapsed ? "Reports" : ""}
              >
                <span className="nav-icon-wrapper"><FileBarChart size={18} /></span>
                <span className="nav-text">Reports</span>
              </Link>
              <Link
                href="/crm/social-reports"
                className={`nav-link ${isActive("/crm/social-reports") ? "active" : ""}`}
                title={isCollapsed ? "Social Reports" : ""}
              >
                <span className="nav-icon-wrapper"><Share2 size={18} /></span>
                <span className="nav-text">Social Reports</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Portal</div>
              <Link
                href="/crm/content"
                className={`nav-link ${isActive("/crm/content") ? "active" : ""}`}
                title={isCollapsed ? "Content" : ""}
              >
                <span className="nav-icon-wrapper"><CalendarCheck size={18} /></span>
                <span className="nav-text">Content</span>
              </Link>
              <Link
                href="/crm/invoices"
                className={`nav-link ${isActive("/crm/invoices") ? "active" : ""}`}
                title={isCollapsed ? "Invoices" : ""}
              >
                <span className="nav-icon-wrapper"><Receipt size={18} /></span>
                <span className="nav-text">Invoices</span>
              </Link>
              <Link
                href="/crm/change-requests"
                className={`nav-link ${isActive("/crm/change-requests") ? "active" : ""}`}
                title={isCollapsed ? "Requests" : ""}
              >
                <span className="nav-icon-wrapper"><FileEdit size={18} /></span>
                <span className="nav-text">Requests</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Tools</div>
              <Link
                href="/crm/portfolio"
                className={`nav-link ${isActive("/crm/portfolio") ? "active" : ""}`}
                title={isCollapsed ? "Portfolio" : ""}
              >
                <span className="nav-icon-wrapper"><Image size={18} /></span>
                <span className="nav-text">Portfolio</span>
              </Link>
              <Link
                href="/crm/quotes/builder"
                className={`nav-link ${pathname === "/crm/quotes/builder" ? "active" : ""}`}
                title={isCollapsed ? "Quote Builder" : ""}
              >
                <span className="nav-icon-wrapper"><Sparkles size={18} /></span>
                <span className="nav-text">Quote Builder</span>
              </Link>
              <Link
                href="/crm/quotes/new"
                className={`nav-link ${pathname === "/crm/quotes/new" ? "active" : ""}`}
                title={isCollapsed ? "Create Quote" : ""}
              >
                <span className="nav-icon-wrapper"><Edit size={18} /></span>
                <span className="nav-text">Create Quote</span>
              </Link>
              <Link
                href="/"
                className="nav-link"
                title={isCollapsed ? "Back to Site" : ""}
              >
                <span className="nav-icon-wrapper"><ArrowLeft size={18} /></span>
                <span className="nav-text">Back to Site</span>
              </Link>
            </div>
          </nav>

        </aside>

        <main className="main-content">
          {/* Top Bar with User Profile */}
          <div className="top-bar">
            <div className="top-bar-actions">
              <Link href="/crm/settings" className="top-bar-btn" title="Settings">
                <Settings size={18} />
              </Link>
              <button onClick={handleLogout} className="top-bar-btn logout" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
            <div className="user-menu">
              <div className="user-avatar" style={getAvatarStyle()} />
              <div className="user-info">
                <div className="user-name">{profileName}</div>
                <div className="user-email">{user?.email || 'user@email.com'}</div>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
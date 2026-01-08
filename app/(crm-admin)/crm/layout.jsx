"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, onAuthStateChange } from "@/lib/auth";
import { signOut } from "@/lib/auth";
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
  Target
} from 'lucide-react';

export default function CRMLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        setLoading(false); // ADD THIS - Set loading to false when signed in
        
        // If on login page, redirect to dashboard
        if (pathname === "/crm/login") {
          router.push("/crm");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false); // ADD THIS - Set loading to false when signed out
        router.push("/crm/login");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, router]); // ADD pathname and router to dependencies

  async function checkUser() {
    const currentUser = await getUser();

    if (!currentUser && pathname !== "/crm/login") {
      router.push("/crm/login");
      setLoading(false); // ADD THIS - Set loading to false even when redirecting
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

  // Show loading while checking auth
  if (loading && pathname !== "/crm/login") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00FF94",
          fontSize: "1.2rem",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/crm/login");
  };

  // If on login page, show it without sidebar
  if (pathname === "/crm/login") {
    return <>{children}</>;
  }

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
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
          background: #0a0a0a !important;
          color: white !important;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        .crm-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .sidebar {
          width: ${isCollapsed ? '80px' : '260px'};
          background: #000000;
          border-right: 1px solid #1a1a1a;
          padding: 30px 0;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 1000;
          transition: width 0.3s ease;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 ${isCollapsed ? '20px' : '25px'};
          margin-bottom: 40px;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00ff94 0%, #00cc76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          opacity: ${isCollapsed ? '0' : '1'};
          transition: opacity 0.2s;
        }

        .collapse-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .collapse-btn:hover {
          background: #1a1a1a;
          color: #00ff94;
        }

        .nav-section {
          margin-bottom: 30px;
        }

        .nav-label {
          padding: 0 25px;
          margin-bottom: 10px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
          font-weight: 600;
          opacity: ${isCollapsed ? '0' : '1'};
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 25px;
          color: #888;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 0.95rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: #1a1a1a;
          color: #00ff94;
        }

        .nav-link.active {
          background: rgba(0, 255, 148, 0.1);
          color: #00ff94;
          border-right: 3px solid #00ff94;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .nav-text {
          opacity: ${isCollapsed ? '0' : '1'};
          transition: opacity 0.2s;
        }

        .main-content {
          margin-left: ${isCollapsed ? '80px' : '260px'};
          flex: 1;
          padding: 40px;
          max-width: 1400px;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: ${isCollapsed ? '0' : '260px'};
            transform: translateX(${isCollapsed ? '-100%' : '0'});
          }

          .main-content {
            margin-left: 0;
            padding: 20px;
          }
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #00ff94;
        }
      `}</style>

      <div className="crm-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            {!isCollapsed && <div className="logo-text">NineFold</div>}
            <button 
              className="collapse-btn" 
              onClick={toggleSidebar}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <nav className="crm-nav">
            <div className="nav-section">
              {!isCollapsed && <div className="nav-label">Overview</div>}
              <Link
                href="/crm"
                className={`nav-link ${
                  isActive("/crm") && pathname === "/crm" ? "active" : ""
                }`}
                title={isCollapsed ? "Dashboard" : ""}
              >
                <span className="nav-icon"><LayoutDashboard size={20} /></span>
                <span className="nav-text">Dashboard</span>
              </Link>
              <Link
                href="/crm/analytics"
                className={`nav-link ${isActive("/crm/analytics") ? "active" : ""}`}
                title={isCollapsed ? "Analytics" : ""}
              >
                <span className="nav-icon"><BarChart3 size={20} /></span>
                <span className="nav-text">Analytics</span>
              </Link>
              <Link
                href="/crm/calendar"
                className={`nav-link ${isActive("/crm/calendar") ? "active" : ""}`}
                title={isCollapsed ? "Calendar" : ""}
              >
                <span className="nav-icon"><Calendar size={20} /></span>
                <span className="nav-text">Calendar</span>
              </Link>
            </div>

            <div className="nav-section">
              {!isCollapsed && <div className="nav-label">Sales</div>}
              <Link
                href="/crm/prospects"
                className={`nav-link ${isActive("/crm/prospects") ? "active" : ""}`}
                title={isCollapsed ? "Prospects" : ""}
              >
                <span className="nav-icon"><Target size={20} /></span>
                <span className="nav-text">Prospects</span>
              </Link>
              <Link
                href="/crm/leads"
                className={`nav-link ${isActive("/crm/leads") ? "active" : ""}`}
                title={isCollapsed ? "Leads" : ""}
              >
                <span className="nav-icon"><UserPlus size={20} /></span>
                <span className="nav-text">Leads</span>
              </Link>
              <Link
                href="/crm/clients"
                className={`nav-link ${isActive("/crm/clients") ? "active" : ""}`}
                title={isCollapsed ? "Clients" : ""}
              >
                <span className="nav-icon"><Users size={20} /></span>
                <span className="nav-text">Clients</span>
              </Link>
              <Link
                href="/crm/quotes"
                className={`nav-link ${isActive("/crm/quotes") ? "active" : ""}`}
                title={isCollapsed ? "Quotes" : ""}
              >
                <span className="nav-icon"><FileText size={20} /></span>
                <span className="nav-text">Quotes</span>
              </Link>
            </div>

            <div className="nav-section">
              {!isCollapsed && <div className="nav-label">Projects</div>}
              <Link
                href="/crm/projects"
                className={`nav-link ${isActive("/crm/projects") ? "active" : ""}`}
                title={isCollapsed ? "Projects" : ""}
              >
                <span className="nav-icon"><FolderKanban size={20} /></span>
                <span className="nav-text">Projects</span>
              </Link>
            </div>

            <div className="nav-section">
              {!isCollapsed && <div className="nav-label">Recurring</div>}
              <Link
                href="/crm/recurring"
                className={`nav-link ${isActive("/crm/recurring") ? "active" : ""}`}
                title={isCollapsed ? "Revenue" : ""}
              >
                <span className="nav-icon"><TrendingUp size={20} /></span>
                <span className="nav-text">Revenue</span>
              </Link>
            </div>

            <div className="nav-section">
              {!isCollapsed && <div className="nav-label">Tools</div>}
              <Link
                href="/crm/quotes/new"
                className={`nav-link ${isActive("/crm/new-quote") ? "active" : ""}`}
                title={isCollapsed ? "Create Quote" : ""}
              >
                <span className="nav-icon"><Edit size={20} /></span>
                <span className="nav-text">Create Quote</span>
              </Link>
            </div>

            <div className="nav-section" style={{ marginTop: "40px" }}>
              <Link 
                href="/" 
                className="nav-link" 
                style={{ color: "#666" }}
                title={isCollapsed ? "Back to Site" : ""}
              >
                <span className="nav-icon"><ArrowLeft size={20} /></span>
                <span className="nav-text">Back to Site</span>
              </Link>
            </div>

            <div className="nav-section">
              <button
                onClick={handleLogout}
                className="nav-link"
                style={{
                  color: "#ef4444",
                  background: "none",
                  border: "none",
                  width: "100%",
                  cursor: "pointer",
                }}
                title={isCollapsed ? "Logout" : ""}
              >
                <span className="nav-icon"><LogOut size={20} /></span>
                <span className="nav-text">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </>
  );
}
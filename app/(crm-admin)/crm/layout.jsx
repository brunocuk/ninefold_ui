"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, onAuthStateChange } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import Link from "next/link";

export default function CRMLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/crm/login");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const currentUser = await getUser();

    if (!currentUser && pathname !== "/crm/login") {
      // Not logged in, redirect to login
      router.push("/crm/login");
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }

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
      {/* FORCE HIDE EVERYTHING */}
      <style jsx global>{`
        /* Nuclear option - hide ALL headers/footers/navs */
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
          width: 260px;
          background: #000000;
          border-right: 1px solid #1a1a1a;
          padding: 30px 0;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
        }

        .logo {
          padding: 0 25px;
          margin-bottom: 40px;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00ff94 0%, #00cc76 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
          font-size: 1.2rem;
        }

        .main-content {
          margin-left: 260px;
          flex: 1;
          padding: 40px;
          max-width: 1400px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }

          .logo-text,
          .nav-label,
          .nav-link span {
            display: none;
          }

          .main-content {
            margin-left: 70px;
            padding: 20px;
          }

          .nav-link {
            justify-content: center;
            padding: 12px;
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
          <div className="logo">
            <div className="logo-text">NineFold</div>
          </div>

          <nav className="crm-nav">
            <div className="nav-section">
              <div className="nav-label">Overview</div>
              <Link
                href="/crm"
                className={`nav-link ${
                  isActive("/crm") && pathname === "/crm" ? "active" : ""
                }`}
              >
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Sales</div>
              <Link
                href="/crm/leads"
                className={`nav-link ${isActive("/crm/leads") ? "active" : ""}`}
              >
                <span className="nav-icon">👥</span>
                <span>Leads</span>
              </Link>
              <Link
                href="/crm/clients"
                className={`nav-link ${
                  isActive("/crm/clients") ? "active" : ""
                }`}
              >
                <span className="nav-icon">🏢</span>
                <span>Clients</span>
              </Link>
              <Link
                href="/crm/quotes"
                className={`nav-link ${
                  isActive("/crm/quotes") ? "active" : ""
                }`}
              >
                <span className="nav-icon">📄</span>
                <span>Quotes</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Projects</div>
              <Link
                href="/crm/projects"
                className={`nav-link ${
                  isActive("/crm/projects") ? "active" : ""
                }`}
              >
                <span className="nav-icon">🚀</span>
                <span>Projects</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Recurring revenue</div>
              <Link
                href="/crm/recurring"
                className={`nav-link ${
                  isActive("/crm/recurring") ? "active" : ""
                }`}
              >
                <span className="nav-icon">🚀</span>
                <span>Maintenence</span>
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-label">Tools</div>
              <Link
                href="/crm/quotes/new" // NEW
                className={`nav-link ${
                  isActive("/crm/new-quote") ? "active" : ""
                }`}
              >
                <span className="nav-icon">✏️</span>
                <span>Create Quote</span>
              </Link>
            </div>

            <div className="nav-section" style={{ marginTop: "40px" }}>
              <Link href="/" className="nav-link" style={{ color: "#666" }}>
                <span className="nav-icon">←</span>
                <span>Back to Site</span>
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
              >
                <span className="nav-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </>
  );
}

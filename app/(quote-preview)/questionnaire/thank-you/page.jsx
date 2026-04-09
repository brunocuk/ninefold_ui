// app/(quote-preview)/questionnaire/thank-you/page.jsx
// Thank you page after questionnaire submission

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail, Phone, Instagram } from 'lucide-react';

export default function ThankYouPage() {
  // Force hide header/footer
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'hide-header-footer-thankyou';
    style.innerHTML = `
      body > header,
      body > footer,
      body > nav,
      #__next > header,
      #__next > footer,
      #__next > nav,
      [data-testid="header"],
      [data-testid="footer"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById('hide-header-footer-thankyou');
      if (styleEl) styleEl.remove();
    };
  }, []);

  return (
    <div className="thank-you-page">
      <style jsx>{`
        @import url('https://api.fontshare.com/v2/css?f[]=nohemi@400,500,600,700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0F0F0F;
        }

        .thank-you-page {
          font-family: 'Nohemi', -apple-system, sans-serif;
          background: #0F0F0F;
          color: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 60px;
        }

        .success-icon {
          width: 100px;
          height: 100px;
          background: rgba(0, 255, 148, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 255, 148, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 30px 10px rgba(0, 255, 148, 0.1);
          }
        }

        .success-icon svg {
          color: #00FF94;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #fff 0%, #00FF94 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #8F8F8F;
          max-width: 500px;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .info-card {
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          margin-bottom: 40px;
        }

        .info-card-title {
          font-size: 1rem;
          font-weight: 600;
          color: #00FF94;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #2A2A2A;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-item svg {
          color: #00FF94;
          flex-shrink: 0;
        }

        .info-text {
          color: #C4C4C4;
          font-size: 0.95rem;
        }

        .actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn {
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-family: 'Nohemi', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .btn-primary {
          background: #00FF94;
          color: #0F0F0F;
        }

        .btn-primary:hover {
          background: #00DD7F;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 255, 148, 0.3);
        }

        .btn-secondary {
          background: #2A2A2A;
          color: #fff;
        }

        .btn-secondary:hover {
          background: #3A3A3A;
        }

        .social-links {
          display: flex;
          gap: 16px;
          margin-top: 60px;
        }

        .social-link {
          width: 48px;
          height: 48px;
          background: #1a1a1a;
          border: 1px solid #2A2A2A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8F8F8F;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: #00FF94;
          color: #0F0F0F;
          border-color: #00FF94;
        }

        @media (max-width: 640px) {
          .title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .info-card {
            padding: 24px;
          }

          .actions {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="logo">NineFold</div>

      <div className="success-icon">
        <CheckCircle size={48} />
      </div>

      <h1 className="title">Hvala na upitu!</h1>

      <p className="subtitle">
        Zaprimili smo vaš upit i javit ćemo vam se u najkraćem mogućem roku s personaliziranom ponudom.
      </p>

      <div className="info-card">
        <div className="info-card-title">Što dalje?</div>

        <div className="info-item">
          <Mail size={20} />
          <span className="info-text">
            Provjerite svoj inbox - poslat ćemo vam potvrdu na email
          </span>
        </div>

        <div className="info-item">
          <Phone size={20} />
          <span className="info-text">
            Naš tim će vas kontaktirati unutar 24 sata
          </span>
        </div>

        <div className="info-item">
          <CheckCircle size={20} />
          <span className="info-text">
            Pripremit ćemo detaljnu ponudu prema vašim potrebama
          </span>
        </div>
      </div>

      <div className="actions">
        <Link href="/" className="btn btn-primary">
          Natrag na početnu
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="social-links">
        <a href="https://instagram.com/ninefold.hr" target="_blank" rel="noopener noreferrer" className="social-link">
          <Instagram size={20} />
        </a>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { mockTransactions } from './data/mockData';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import RoleSwitcher from './components/RoleSwitcher';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'transactions', label: 'Transactions', icon: '≡' },
  { id: 'insights', label: 'Insights', icon: '◎' },
];

export default function App() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [activePage, setActivePage] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('Viewer');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('finDark') === 'true';
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('finDark', darkMode);
  }, [darkMode]);

  const handleAdd = (data) => {
    setTransactions(prev => [
      ...prev,
      { ...data, id: Date.now() },
    ]);
  };

  const handleEdit = (updated) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const pageTitle = NAV_ITEMS.find(n => n.id === activePage)?.label;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full z-40 flex flex-col"
        style={{
          width: 220,
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <div style={{
            width: 30, height: 30, backgroundColor: '#0F4184', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.9rem',
          }}>F</div>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>FinanceIQ</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                marginBottom: '0.2rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activePage === item.id ? 600 : 400,
                backgroundColor: activePage === item.id ? 'rgba(15,65,132,0.1)' : 'transparent',
                color: activePage === item.id ? '#0F4184' : 'var(--color-text)',
                textAlign: 'left',
                transition: 'background-color 0.15s',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Role indicator at bottom */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}>
          Logged in as <strong style={{ color: 'var(--color-text)' }}>{currentRole}</strong>
        </div>
      </aside>

      {/* Desktop sidebar (always visible on lg+) */}
      <aside
        className="hidden lg:flex flex-col"
        style={{
          width: 220,
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <div style={{
            width: 30, height: 30, backgroundColor: '#0F4184', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.9rem',
          }}>F</div>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>FinanceIQ</span>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0.75rem' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                marginBottom: '0.2rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activePage === item.id ? 600 : 400,
                backgroundColor: activePage === item.id ? 'rgba(15,65,132,0.1)' : 'transparent',
                color: activePage === item.id ? '#0F4184' : 'var(--color-text)',
                textAlign: 'left',
                transition: 'background-color 0.15s',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}>
          Logged in as <strong style={{ color: 'var(--color-text)' }}>{currentRole}</strong>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 56,
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.25rem',
          gap: '0.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}>
          {/* Hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--color-text)', padding: '0.25rem' }}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <h1 style={{ fontWeight: 600, fontSize: '1rem', flex: 1 }}>{pageTitle}</h1>

          <div className="flex items-center gap-3">
            <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              aria-label="Toggle dark mode"
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                padding: '0.35rem 0.6rem',
                fontSize: '0.85rem',
                color: 'var(--color-text)',
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '1.5rem', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {activePage === 'dashboard' && <Dashboard transactions={transactions} />}
          {activePage === 'transactions' && (
            <Transactions
              transactions={transactions}
              currentRole={currentRole}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {activePage === 'insights' && <Insights transactions={transactions} />}
        </main>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { CATEGORIES } from '../data/mockData';

const EMPTY_FORM = {
  date: '',
  description: '',
  category: CATEGORIES[0],
  type: 'expense',
  amount: '',
};

function TransactionModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Date is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, amount: Number(form.amount) });
  };

  const field = (key, label, type = 'text', extra = {}) => (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>{label}</label>
      <input
        type={type}
        className="input-field"
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
        {...extra}
      />
      {errors[key] && <span style={{ fontSize: '0.72rem', color: 'var(--color-expense)' }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md mx-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>
            {initial ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {field('date', 'Date', 'date')}
          {field('description', 'Description')}

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Category</label>
            <select
              className="input-field"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Type</label>
            <select
              className="input-field"
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {field('amount', 'Amount (₹)', 'number', { min: 1, step: 1 })}

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{initial ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Transactions({ transactions, currentRole, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterType('');
    setSortKey('date');
    setSortDir('desc');
  };

  const filtered = transactions
    .filter(t => t.description.toLowerCase().includes(search.toLowerCase()))
    .filter(t => filterCategory ? t.category === filterCategory : true)
    .filter(t => filterType ? t.type === filterType : true)
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'amount') { av = Number(av); bv = Number(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ col }) =>
    sortKey === col
      ? <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
      : <span style={{ marginLeft: 4, opacity: 0.3 }}>↕</span>;

  const thStyle = {
    padding: '0.65rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: '1px solid var(--color-border)',
    whiteSpace: 'nowrap',
  };

  const tdStyle = { padding: '0.7rem 1rem', fontSize: '0.85rem', verticalAlign: 'middle' };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="card flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex flex-col gap-1" style={{ minWidth: 200, flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Search</label>
            <input
              className="input-field"
              placeholder="Search by description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Category</label>
            <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ minWidth: 130 }}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Type</label>
            <select className="input-field" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ minWidth: 110 }}>
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <button className="btn-ghost" onClick={resetFilters} style={{ alignSelf: 'flex-end' }}>
            Reset
          </button>

          {currentRole === 'Admin' && (
            <button className="btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }} style={{ alignSelf: 'flex-end' }}>
              + Add
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {filtered.length === 0 ? (
          <div className="text-center py-14" style={{ color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>No transactions found</p>
            <p style={{ fontSize: '0.8rem' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--color-bg)' }}>
              <tr>
                <th style={thStyle} onClick={() => handleSort('date')}>Date <SortIcon col="date" /></th>
                <th style={{ ...thStyle, cursor: 'default' }}>Description</th>
                <th style={{ ...thStyle, cursor: 'default' }}>Category</th>
                <th style={{ ...thStyle, cursor: 'default' }}>Type</th>
                <th style={thStyle} onClick={() => handleSort('amount')}>Amount <SortIcon col="amount" /></th>
                {currentRole === 'Admin' && <th style={{ ...thStyle, cursor: 'default' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="table-row">
                  <td style={{ ...tdStyle, color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={tdStyle}>{t.description}</td>
                  <td style={tdStyle}>
                    <span style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                    }}>
                      {t.category}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span className={t.type === 'income' ? 'badge-income' : 'badge-expense'}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td style={{
                    ...tdStyle,
                    fontWeight: 600,
                    color: t.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)',
                  }}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  {currentRole === 'Admin' && (
                    <td style={tdStyle}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditItem(t); setShowModal(true); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F4184', fontSize: '0.82rem', fontWeight: 500 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { if (window.confirm('Delete this transaction?')) onDelete(t.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-expense)', fontSize: '0.82rem', fontWeight: 500 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <TransactionModal
          initial={editItem}
          onSave={(data) => {
            if (editItem) onEdit({ ...data, id: editItem.id });
            else onAdd(data);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

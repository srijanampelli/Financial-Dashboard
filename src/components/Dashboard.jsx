import { MonthlyTrendChart, CategoryPieChart } from './Charts';

function SummaryCard({ title, value, subtitle, color }) {
  return (
    <div className="card flex flex-col gap-1">
      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{title}</span>
      <span style={{ fontSize: '1.6rem', fontWeight: 700, color: color || 'var(--color-text)' }}>
        ₹{value.toLocaleString('en-IN')}
      </span>
      {subtitle && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{subtitle}</span>}
    </div>
  );
}

export default function Dashboard({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Balance"
          value={totalBalance}
          subtitle="Income minus expenses"
          color={totalBalance >= 0 ? 'var(--color-income)' : 'var(--color-expense)'}
        />
        <SummaryCard
          title="Total Income"
          value={totalIncome}
          subtitle="All time income"
          color="var(--color-income)"
        />
        <SummaryCard
          title="Total Expenses"
          value={totalExpenses}
          subtitle="All time expenses"
          color="var(--color-expense)"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Monthly Trend
          </h2>
          <MonthlyTrendChart transactions={transactions} />
        </div>
        <div className="card">
          <h2 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Spending by Category
          </h2>
          <CategoryPieChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

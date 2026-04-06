export default function Insights({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="card text-center py-10" style={{ color: 'var(--color-text-muted)' }}>
        No data available to generate insights.
      </div>
    );
  }

  const expenses = transactions.filter(t => t.type === 'expense');

  // Highest spending category
  const categoryTotals = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  // Current month expenses
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);

  const thisMonthExpenses = expenses
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((s, t) => s + t.amount, 0);

  const lastMonthExpenses = expenses
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
    })
    .reduce((s, t) => s + t.amount, 0);

  const pctChange = lastMonthExpenses === 0
    ? null
    : (((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1);

  // Average daily spend (across all dates)
  const dates = expenses.map(t => t.date);
  const uniqueDays = new Set(dates).size || 1;
  const totalSpend = expenses.reduce((s, t) => s + t.amount, 0);
  const avgDaily = (totalSpend / uniqueDays).toFixed(0);

  // Largest transaction this month
  const thisMonthAll = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const largest = thisMonthAll.sort((a, b) => b.amount - a.amount)[0];

  const insights = [
    {
      label: 'Highest Spending Category',
      value: topCategory ? topCategory[0] : '—',
      sub: topCategory ? `₹${topCategory[1].toLocaleString('en-IN')} total` : '',
      icon: '📊',
    },
    {
      label: 'Monthly Expense Change',
      value: pctChange !== null ? `${pctChange > 0 ? '+' : ''}${pctChange}%` : 'N/A',
      sub: pctChange !== null
        ? `vs last month (₹${lastMonthExpenses.toLocaleString('en-IN')})`
        : 'No previous month data',
      icon: pctChange > 0 ? '📈' : '📉',
      valueColor: pctChange > 0 ? 'var(--color-expense)' : 'var(--color-income)',
    },
    {
      label: 'Average Daily Spend',
      value: `₹${Number(avgDaily).toLocaleString('en-IN')}`,
      sub: `Across ${uniqueDays} active day${uniqueDays > 1 ? 's' : ''}`,
      icon: '📅',
    },
    {
      label: 'Largest Transaction This Month',
      value: largest ? `₹${largest.amount.toLocaleString('en-IN')}` : '—',
      sub: largest ? `${largest.description}` : 'No transactions this month',
      icon: '💸',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {insights.map((insight) => (
          <div key={insight.label} className="card flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '1.25rem' }}>{insight.icon}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {insight.label}
              </span>
            </div>
            <span
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: insight.valueColor || 'var(--color-text)',
              }}
            >
              {insight.value}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{insight.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

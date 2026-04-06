import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

const COLORS = ['#0F4184', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#f97316'];

export function MonthlyTrendChart({ transactions }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyData = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthlyData[key]) {
      monthlyData[key] = { label: months[d.getMonth()], income: 0, expense: 0 };
    }
    if (t.type === 'income') monthlyData[key].income += t.amount;
    else monthlyData[key].expense += t.amount;
  });

  const data = Object.values(monthlyData).map(m => ({
    name: m.label,
    Income: m.income,
    Expense: m.expense,
    Balance: m.income - m.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
        <Legend />
        <Line type="monotone" dataKey="Income" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Expense" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Balance" stroke="#0F4184" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ transactions }) {
  const categoryMap = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const data = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
        <Legend iconType="circle" iconSize={10} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart({ transactions }) {
  const categoryMap = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const data = Object.entries(categoryMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
        <Bar dataKey="amount" fill="#0F4184" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

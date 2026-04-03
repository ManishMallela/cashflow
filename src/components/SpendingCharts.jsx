import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const EXPENSE_COLORS = ['#e74c3c', '#e67e22', '#f39c12', '#e84393', '#fd79a8', '#d63031', '#b71540', '#e55039']
const INCOME_COLORS = ['#2ecc71', '#00b894', '#00cec9', '#55efc4', '#1abc9c']

const SAVINGS_TIERS = [
  { min: 50, label: '🏆 Financial Champion', message: "Incredible! You're saving over half your income. You're in elite territory!", color: '#f1c40f' },
  { min: 30, label: '🚀 Wealth Builder', message: "Amazing discipline! You're building serious wealth for the future.", color: '#2ecc71' },
  { min: 20, label: '⭐ Smart Saver', message: "Great job! You're well above average and on a strong financial path.", color: '#00b894' },
  { min: 10, label: '💪 Healthy Saver', message: "You're financially healthy! Keep this up and you'll go far.", color: '#3498db' },
  { min: 5,  label: '🌱 Rising Saver', message: "Good start! You're building savings habits. Push for 10% to level up!", color: '#f39c12' },
  { min: 1,  label: '🔥 Starter', message: "You've taken the first step! Try to save a bit more each month.", color: '#e67e22' },
  { min: -Infinity, label: '⚠️ Overspender', message: "You're spending more than you earn. Time to review your expenses!", color: '#e74c3c' },
]

function getSavingsTier(savingsPercent) {
  return SAVINGS_TIERS.find((tier) => savingsPercent >= tier.min)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function getCategoryData(transactions, type) {
  const map = {}
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })

  const total = Object.values(map).reduce((s, v) => s + v, 0)
  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
  }))
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{data.name}</p>
        <p>{formatCurrency(data.value)} ({data.percentage}%)</p>
      </div>
    )
  }
  return null
}

function renderCustomLabel({ name, percentage }) {
  return `${name} ${percentage}%`
}

function SpendingCharts({ transactions }) {
  const expenseData = getCategoryData(transactions, 'expense')
  const incomeData = getCategoryData(transactions, 'income')

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const savings = totalIncome - totalExpense

  const overviewData = [
    { name: 'Expenses', value: totalExpense, percentage: totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0 },
    { name: 'Savings', value: Math.max(savings, 0), percentage: totalIncome > 0 ? ((Math.max(savings, 0) / totalIncome) * 100).toFixed(1) : 0 },
  ]
  const overviewColors = ['#e74c3c', '#2ecc71']

  const savingsPercent = totalIncome > 0 ? (savings / totalIncome) * 100 : 0
  const tier = getSavingsTier(savingsPercent)

  if (transactions.length === 0) {
    return null
  }

  return (
    <div className="charts-section">
      <h2>Spending Overview</h2>

      {/* Financial Health Badge */}
      <div className="health-badge" style={{ borderColor: tier.color }}>
        <div className="health-badge-header">
          <span className="health-badge-label" style={{ color: tier.color }}>{tier.label}</span>
          <span className="health-badge-pct" style={{ color: tier.color }}>
            {savingsPercent.toFixed(1)}% savings rate
          </span>
        </div>
        <p className="health-badge-msg">{tier.message}</p>
        <div className="health-progress-bar">
          <div className="health-progress-track">
            {SAVINGS_TIERS.slice().reverse().map((t, i) => (
              <div
                key={i}
                className={`health-progress-segment ${savingsPercent >= t.min ? 'filled' : ''}`}
                style={{ background: savingsPercent >= t.min ? t.color : 'var(--surface-2)' }}
              />
            ))}
          </div>
          <div className="health-progress-labels">
            <span>Overspending</span>
            <span>Starter</span>
            <span>Healthy</span>
            <span>Champion</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Savings vs Expenses */}
        <div className="chart-card">
          <h3>Savings vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={overviewData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={true}
              >
                {overviewData.map((_, i) => (
                  <Cell key={i} fill={overviewColors[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-stats">
            <span className="stat-item savings">Savings: {formatCurrency(Math.max(savings, 0))}</span>
            <span className="stat-item expenses">Expenses: {formatCurrency(totalExpense)}</span>
          </div>
        </div>

        {/* Expense Breakdown */}
        {expenseData.length > 0 && (
          <div className="chart-card">
            <h3>Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={true}
                >
                  {expenseData.map((_, i) => (
                    <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend-list">
              {expenseData.map((d, i) => (
                <div key={d.name} className="legend-row">
                  <span className="legend-dot" style={{ background: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }} />
                  <span className="legend-name">{d.name}</span>
                  <span className="legend-pct">{d.percentage}%</span>
                  <span className="legend-amt">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Income Breakdown */}
        {incomeData.length > 0 && (
          <div className="chart-card">
            <h3>Income Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={true}
                >
                  {incomeData.map((_, i) => (
                    <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend-list">
              {incomeData.map((d, i) => (
                <div key={d.name} className="legend-row">
                  <span className="legend-dot" style={{ background: INCOME_COLORS[i % INCOME_COLORS.length] }} />
                  <span className="legend-name">{d.name}</span>
                  <span className="legend-pct">{d.percentage}%</span>
                  <span className="legend-amt">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpendingCharts

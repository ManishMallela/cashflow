import { useState } from 'react'

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
]

const FREQUENCIES = [
  { value: 'once', label: 'One Time', icon: '⚡' },
  { value: 'daily', label: 'Daily', icon: '📅' },
  { value: 'weekly', label: 'Weekly', icon: '📆' },
  { value: 'monthly', label: 'Monthly', icon: '🗓️' },
  { value: 'yearly', label: 'Yearly', icon: '📊' },
]

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Rental',
  'Gift',
  'Bonus',
  'Other',
]

function IncomeSourceForm({ onAdd }) {
  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [frequency, setFrequency] = useState('monthly')
  const [category, setCategory] = useState(INCOME_CATEGORIES[0])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!source.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return

    onAdd({
      type: 'income',
      description: source.trim(),
      amount: parsedAmount,
      currency,
      frequency,
      category,
    })

    setSource('')
    setAmount('')
    setFrequency('monthly')
    setCategory(INCOME_CATEGORIES[0])
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const isValid = source.trim() && amount && parseFloat(amount) > 0
  const selectedCurrency = CURRENCIES.find((c) => c.code === currency)

  return (
    <div className="income-source-screen">
      <div className="income-source-header">
        <span className="income-source-icon">💵</span>
        <div>
          <h2>Add Income Source</h2>
          <p className="income-source-subtitle">Track your recurring &amp; one-time income</p>
        </div>
      </div>

      {submitted && (
        <div className="success-banner">
          ✅ Income source added successfully!
        </div>
      )}

      <form className="income-source-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label">Source Name</label>
          <input
            type="text"
            className="field-input"
            placeholder="e.g. Monthly Salary, Freelance Project…"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Currency</label>
          <select
            className="field-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol}) — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label className="field-label">Amount</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol-badge">{selectedCurrency?.symbol}</span>
            <input
              type="number"
              className="amount-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Frequency</label>
          <div className="frequency-grid">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`frequency-btn ${frequency === f.value ? 'active' : ''}`}
                onClick={() => setFrequency(f.value)}
              >
                <span className="frequency-icon">{f.icon}</span>
                <span className="frequency-label">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Category</label>
          <select
            className="field-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {INCOME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-add-income" disabled={!isValid}>
          ＋ Add Income Source
        </button>
      </form>
    </div>
  )
}

export default IncomeSourceForm

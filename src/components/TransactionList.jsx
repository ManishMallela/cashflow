const FREQUENCY_LABELS = {
  once: 'One Time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="transaction-list">
      {transactions.map((t) => (
        <div key={t.id} className="transaction-item">
          <div className={`tx-icon ${t.type}`}>
            {t.type === 'income' ? '↑' : '↓'}
          </div>
          <div className="tx-details">
            <div className="tx-description">{t.description}</div>
            <div className="tx-meta">
              <span className="tx-category">{t.category}</span>
              {t.currency && t.currency !== 'USD' && (
                <span className="tx-currency-badge">{t.currency}</span>
              )}
              {t.frequency && (
                <span className="tx-frequency-badge">
                  {FREQUENCY_LABELS[t.frequency] ?? t.frequency}
                </span>
              )}
            </div>
          </div>
          <div className={`tx-amount ${t.type}`}>
            {t.type === 'income' ? '+' : '-'}
            {formatCurrency(t.amount, t.currency)}
          </div>
          <div className="tx-date">{formatDate(t.date)}</div>
          <button
            className="btn-delete"
            onClick={() => onDelete(t.id)}
            aria-label={`Delete ${t.description}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default TransactionList

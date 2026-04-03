function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
            <div className="tx-category">
              {t.category}
              {t.frequency && t.frequency !== 'One-time' && (
                <span className="tx-frequency">{t.frequency}</span>
              )}
            </div>
          </div>
          <div className={`tx-amount ${t.type}`}>
            {t.type === 'income' ? '+' : '-'}
            {formatCurrency(t.amount)}
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

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function Summary({ balance, income, expenses }) {
  return (
    <div className="summary">
      <div className="summary-card balance">
        <div className="label">Balance</div>
        <div className="amount">{formatCurrency(balance)}</div>
      </div>
      <div className="summary-card income">
        <div className="label">Income</div>
        <div className="amount">{formatCurrency(income)}</div>
      </div>
      <div className="summary-card expense">
        <div className="label">Expenses</div>
        <div className="amount">{formatCurrency(expenses)}</div>
      </div>
    </div>
  )
}

export default Summary

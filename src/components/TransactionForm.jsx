import { useState } from 'react'

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'],
}

function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES.expense[0])

  const handleTypeChange = (newType) => {
    setType(newType)
    setCategory(CATEGORIES[newType][0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return

    onAdd({
      type,
      description: description.trim(),
      amount: parsedAmount,
      category,
    })

    setDescription('')
    setAmount('')
    setCategory(CATEGORIES[type][0])
  }

  const isValid = description.trim() && amount && parseFloat(amount) > 0

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      <div className="type-toggle">
        <button
          type="button"
          className={type === 'income' ? 'active-income' : ''}
          onClick={() => handleTypeChange('income')}
        >
          ↑ Income
        </button>
        <button
          type="button"
          className={type === 'expense' ? 'active-expense' : ''}
          onClick={() => handleTypeChange('expense')}
        >
          ↓ Expense
        </button>
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={100}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
        />
      </div>

      <div className="form-row">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES[type].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-add" disabled={!isValid}>
        Add {type === 'income' ? 'Income' : 'Expense'}
      </button>
    </form>
  )
}

export default TransactionForm

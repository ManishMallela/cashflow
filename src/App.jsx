import { useState, useEffect } from 'react'
import './App.css'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import Summary from './components/Summary'
import SpendingCharts from './components/SpendingCharts'

const STORAGE_KEY = 'cashflow_transactions'

function loadTransactions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function App() {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      { ...transaction, id: crypto.randomUUID(), date: new Date().toISOString() },
      ...prev,
    ])
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  const filtered =
    filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 CashFlow</h1>
        <p className="subtitle">Track your income &amp; expenses</p>
      </header>

      <Summary balance={balance} income={income} expenses={expenses} />

      <SpendingCharts transactions={transactions} />

      <TransactionForm onAdd={addTransaction} />

      <div className="filter-bar">
        <h2>Transactions</h2>
        <div className="filter-buttons">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <TransactionList transactions={filtered} onDelete={deleteTransaction} />
    </div>
  )
}

export default App

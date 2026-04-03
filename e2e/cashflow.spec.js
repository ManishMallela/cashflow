import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // Clear localStorage before each test to start with a clean state
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test.describe('Add Income', () => {
  test('should add an income transaction and update the summary', async ({ page }) => {
    // The form defaults to "Expense" type – switch to Income
    await page.getByRole('button', { name: '↑ Income' }).click()

    // Fill in the description and amount
    await page.getByPlaceholder('Description').fill('Monthly Salary')
    await page.getByPlaceholder('Amount').fill('3000')

    // Select a category
    await page.getByRole('combobox').selectOption('Salary')

    // Submit the form
    await page.getByRole('button', { name: 'Add Income' }).click()

    // The transaction should appear in the list
    await expect(page.getByText('Monthly Salary')).toBeVisible()
    await expect(page.locator('.tx-category').filter({ hasText: 'Salary' })).toBeVisible()

    // The income summary card should reflect the new amount
    const incomeCard = page.locator('.summary-card.income')
    await expect(incomeCard.getByText('$3,000.00')).toBeVisible()

    // Balance should also equal the income (no expenses yet)
    const balanceCard = page.locator('.summary-card.balance')
    await expect(balanceCard.getByText('$3,000.00')).toBeVisible()
  })

  test('should clear the form after adding an income transaction', async ({ page }) => {
    await page.getByRole('button', { name: '↑ Income' }).click()
    await page.getByPlaceholder('Description').fill('Freelance Project')
    await page.getByPlaceholder('Amount').fill('500')
    await page.getByRole('button', { name: 'Add Income' }).click()

    // Inputs should be cleared
    await expect(page.getByPlaceholder('Description')).toHaveValue('')
    await expect(page.getByPlaceholder('Amount')).toHaveValue('')
  })

  test('should not add income with missing description', async ({ page }) => {
    await page.getByRole('button', { name: '↑ Income' }).click()
    await page.getByPlaceholder('Amount').fill('100')

    // Submit button should be disabled
    await expect(page.getByRole('button', { name: 'Add Income' })).toBeDisabled()
  })

  test('should not add income with missing amount', async ({ page }) => {
    await page.getByRole('button', { name: '↑ Income' }).click()
    await page.getByPlaceholder('Description').fill('Bonus')

    // Submit button should be disabled
    await expect(page.getByRole('button', { name: 'Add Income' })).toBeDisabled()
  })
})

test.describe('Add Expense', () => {
  test('should add an expense transaction and update the summary', async ({ page }) => {
    // Form defaults to "Expense"
    await page.getByPlaceholder('Description').fill('Grocery Shopping')
    await page.getByPlaceholder('Amount').fill('150')

    // Select a category
    await page.getByRole('combobox').selectOption('Food')

    // Submit the form
    await page.getByRole('button', { name: 'Add Expense' }).click()

    // The transaction should appear in the list
    await expect(page.getByText('Grocery Shopping')).toBeVisible()
    await expect(page.locator('.tx-category').filter({ hasText: 'Food' })).toBeVisible()

    // The expenses summary card should reflect the new amount
    const expensesCard = page.locator('.summary-card.expense')
    await expect(expensesCard.getByText('$150.00')).toBeVisible()

    // Balance should be negative (no income)
    const balanceCard = page.locator('.summary-card.balance')
    await expect(balanceCard.getByText('-$150.00')).toBeVisible()
  })

  test('should clear the form after adding an expense transaction', async ({ page }) => {
    await page.getByPlaceholder('Description').fill('Taxi Ride')
    await page.getByPlaceholder('Amount').fill('25')
    await page.getByRole('button', { name: 'Add Expense' }).click()

    // Inputs should be cleared
    await expect(page.getByPlaceholder('Description')).toHaveValue('')
    await expect(page.getByPlaceholder('Amount')).toHaveValue('')
  })

  test('should not add expense with missing description', async ({ page }) => {
    await page.getByPlaceholder('Amount').fill('50')

    // Submit button should be disabled
    await expect(page.getByRole('button', { name: 'Add Expense' })).toBeDisabled()
  })

  test('should not add expense with missing amount', async ({ page }) => {
    await page.getByPlaceholder('Description').fill('Electric Bill')

    // Submit button should be disabled
    await expect(page.getByRole('button', { name: 'Add Expense' })).toBeDisabled()
  })
})

test.describe('Balance calculation', () => {
  test('should correctly compute balance with both income and expenses', async ({ page }) => {
    // Add income of $2000
    await page.getByRole('button', { name: '↑ Income' }).click()
    await page.getByPlaceholder('Description').fill('Salary')
    await page.getByPlaceholder('Amount').fill('2000')
    await page.getByRole('button', { name: 'Add Income' }).click()

    // Add expense of $500
    await page.getByRole('button', { name: '↓ Expense' }).click()
    await page.getByPlaceholder('Description').fill('Rent')
    await page.getByPlaceholder('Amount').fill('500')
    await page.getByRole('button', { name: 'Add Expense' }).click()

    // Balance should be $1500
    const balanceCard = page.locator('.summary-card.balance')
    await expect(balanceCard.getByText('$1,500.00')).toBeVisible()

    // Income summary
    const incomeCard = page.locator('.summary-card.income')
    await expect(incomeCard.getByText('$2,000.00')).toBeVisible()

    // Expenses summary
    const expensesCard = page.locator('.summary-card.expense')
    await expect(expensesCard.getByText('$500.00')).toBeVisible()
  })
})

test.describe('Transaction list filtering', () => {
  test('should filter to show only income transactions', async ({ page }) => {
    // Add one income and one expense
    await page.getByRole('button', { name: '↑ Income' }).click()
    await page.getByPlaceholder('Description').fill('Paycheck')
    await page.getByPlaceholder('Amount').fill('1000')
    await page.getByRole('button', { name: 'Add Income' }).click()

    await page.getByRole('button', { name: '↓ Expense' }).click()
    await page.getByPlaceholder('Description').fill('Lunch')
    await page.getByPlaceholder('Amount').fill('20')
    await page.getByRole('button', { name: 'Add Expense' }).click()

    // Click the Income filter
    await page.locator('.filter-btn').filter({ hasText: 'Income' }).click()

    await expect(page.getByText('Paycheck')).toBeVisible()
    await expect(page.getByText('Lunch')).not.toBeVisible()
  })

  test('should filter to show only expense transactions', async ({ page }) => {
    // Add one income and one expense
    await page.getByRole('button', { name: '↑ Income' }).click()
    await page.getByPlaceholder('Description').fill('Consulting')
    await page.getByPlaceholder('Amount').fill('800')
    await page.getByRole('button', { name: 'Add Income' }).click()

    await page.getByRole('button', { name: '↓ Expense' }).click()
    await page.getByPlaceholder('Description').fill('Utilities')
    await page.getByPlaceholder('Amount').fill('120')
    await page.getByRole('button', { name: 'Add Expense' }).click()

    // Click the Expense filter
    await page.locator('.filter-btn').filter({ hasText: 'Expense' }).click()

    await expect(page.getByText('Utilities')).toBeVisible()
    await expect(page.getByText('Consulting')).not.toBeVisible()
  })
})

test.describe('Delete transaction', () => {
  test('should delete a transaction and update the summary', async ({ page }) => {
    // Add an income transaction
    await page.getByRole('button', { name: '↑ Income' }).click()
    await page.getByPlaceholder('Description').fill('Bonus Payment')
    await page.getByPlaceholder('Amount').fill('250')
    await page.getByRole('button', { name: 'Add Income' }).click()

    // Verify it appears
    await expect(page.getByText('Bonus Payment')).toBeVisible()

    // Delete it
    await page.getByRole('button', { name: 'Delete Bonus Payment' }).click()

    // The item should no longer be in the list
    await expect(page.getByText('Bonus Payment')).not.toBeVisible()

    // Income summary should reset to $0.00
    const incomeCard = page.locator('.summary-card.income')
    await expect(incomeCard.getByText('$0.00')).toBeVisible()
  })
})

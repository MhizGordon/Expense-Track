const express = require('express');
const router = express.Router();
const Income = require('../models/incomeModel');

// Route to get expense
router.post('/add-incomes', async (req, res) => {
  try {
    const { month, date, source, amount } = req.body;

    const newIncome = new Income({
      month,
      date,
      source,
      amount,
    });

    await newIncome.save();
    res.status(201).json({ message: 'Income added successfully', data: newIncome });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ message: 'Error adding income', error });
  }
});

// Route to get income
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({});
    res.status(200).json({ data: incomes });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Error fetching incomes', error });
  }
}


router.get('/get-incomes', getIncomes);
    

module.exports = router;
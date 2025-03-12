const Income = require("../models/incomeModel");
const IncomeSchema = require("../models/incomeModel");


exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body

    const income = new Income({
        title,
        amount,
        category,
        description,
        date
    })

    try{
        //validate the income
        if(!title || !category || !description || !date){
            return res.status(400).json({message: "Please fill in all fields"})
        }
        if(amount <= 0 || !amount === 'number'){ 
            return res.status(400).json({message: "Amount must be a positive number"})
        }
        await income.save()
        res.status(200).json({message: "Income added successfully"})
    } catch (error){
        res.status(500).json({message: "Something went wrong, please try again"})
        
    }

    console.log(income);
}

module.exports = { addIncome };




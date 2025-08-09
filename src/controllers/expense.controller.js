import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {Expense} from '../models/expense.model.js';
import { Group } from '../models/group.model.js';
import { SettleUp } from '../models/settleup.model.js';
import { SplitDetail } from '../models/splitdetail.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const addExpense = asyncHandler(async (req, res) => {
    const { group, amount, description, paidBy, splitAmong } = req.body;
    //test
    if(!group || !amount || !description || !paidBy || !splitAmong){
        throw new ApiError(400, "Please provide group, amount, description, paidBy and splitAmong");
    }

    const perUserAmount = parseFloat((amount / splitAmong.length).toFixed(2));
    //console.log("perUserAmount", perUserAmount);
    const splitDetails = splitAmong.map(user => ({
        user,
        amountOwed: perUserAmount,
        status: 'pending'
    }));

    const expense = await Expense.create({
        group, 
        amount, 
        description, 
        paidBy, 
        splitDetails:[]
    });

    const splitDetail = await SplitDetail.insertMany(splitDetails.map(detail => ({
        ...detail,
        expense: expense._id
    })));

    expense.splitDetails = splitDetail.map(detail => detail._id);
    await expense.save();

    return res.status(200).json(new ApiResponse(200, expense, "Expense created successfully"));
})

const getAllExpenses = asyncHandler(async (req, res) => {
    
    try {
        const { groupId } = req.params;
        
        const group = await Group.findById(groupId).populate('members', 'fullname email');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
    
        const expenses = await Expense.find({ group: groupId })
            .populate({
            path: 'paidBy',
            select: 'fullname email'
            })
            .populate({
            path: 'splitDetails',
            populate: {
                path: 'user',
                select: 'fullname email'
            }
            });
    
        const paidMap = {};
        const owedMap = {};
    
        for (const member of group.members) {
            paidMap[member._id] = 0;
            owedMap[member._id] = 0;
        }
        
        expenses.forEach((expense) => {
          
            const userId = expense.paidBy?._id?.toString() || expense.paidBy?.toString();
            if (userId) {
            paidMap[userId] += expense.amount;
            }
    
            expense.splitDetails.forEach((split) => {
                const userId = split.user._id.toString();
                owedMap[userId] += split.amountOwed;
            });
        }); 
        
        //console.log("groupId", groupId);
        const summary = group.members.map((member) => {
            const id = member._id.toString();
            const paid = paidMap[id] || 0;
            const owed = owedMap[id] || 0;
            return {
            user: {
                _id: id,
                fullname: member.fullname,
                email: member.email
            },
            totalPaid: paid,
            totalOwed: owed,
            balance: parseFloat((paid - owed).toFixed(2))
            };
        });
        

        const balances = summary.map(({ user, totalPaid, totalOwed }) => ({
            userId: user._id.toString(),
            name: user.fullname,
            balance: parseFloat((totalPaid - totalOwed).toFixed(2))
        }));
        
      // Separate creditors and debtors
      const creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
      const debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
      
      const simplifiedTransactions = [];
      
      let i = 0, j = 0;
      
      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
      
        const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
      
        if (amount > 0) {
          simplifiedTransactions.push({
            from: debtor.name,
            to: creditor.name,
            amount: parseFloat(amount.toFixed(2))
          });
      
          debtor.balance += amount;
          creditor.balance -= amount;
        }
      
        if (Math.abs(debtor.balance) < 0.01) i++;
        if (creditor.balance < 0.01) j++;
      }
    
        res.status(200).json({
            group: {
            _id: group._id,
            name: group.name
            },
            expenses,
            summary,
            simplifiedTransactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch expenses' });
        
    }
});

const settleUp = async (req, res) => {
    try {
      const { groupId, from, to, amount } = req.body;
  
      if (!groupId || !from || !to || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input' });
      }
  
      const settlement = new SettleUp({
        group: groupId,
        from,
        to,
        amount,
      });
  
      await settlement.save();
  
      res.status(201).json({ message: 'Settlement recorded', settlement });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };


export {addExpense, getAllExpenses, settleUp}
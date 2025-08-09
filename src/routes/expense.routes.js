import { Router } from "express";
import { addExpense, getAllExpenses, settleUp } from '../controllers/expense.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'
const router = Router();

router.route("/add-expense").post(verifyJWT, addExpense);
router.route("/summary/:groupId").get(verifyJWT, getAllExpenses);
router.route("/settle-up").post(verifyJWT, settleUp);


export default router;
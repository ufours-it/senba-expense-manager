import AsyncStorage from '@react-native-async-storage/async-storage';

//Local Imports
import { ExpenseModel } from '@/models/expense';

const STORAGE_KEY = 'pocket_ledger_expenses';

export const saveExpense = async (expense :ExpenseModel[])=>{
    try{
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expense));
    }
    catch(error){
        console.error('Error saving expense:', error);
    }
}

export const getExpenseList = async() :Promise<ExpenseModel[] | null>=>{
    try{
        const data = await AsyncStorage.getItem(STORAGE_KEY);   
        if(data){
            return JSON.parse(data) as ExpenseModel[];
        }
        return null;
    }
    catch(error){
        console.error('Error retrieving expenses:', error);
        return null;
    }
}

export const updateExpense = async (updatedExpense: ExpenseModel) => {
    try {
        const expenses = await getExpenseList();
        if (!expenses) return;
        const updatedExpenses = expenses.map(expense =>
            expense.id === updatedExpense.id ? updatedExpense : expense
        );
        await saveExpense(updatedExpenses);
    } catch (error) {
        console.error('Error updating expense:', error);
    }
}
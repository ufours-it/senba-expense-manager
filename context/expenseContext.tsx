import { createContext, useContext, useEffect, useState } from "react";

//Local Imports
import { ExpenseModel } from "@/models/expense";
import { getExpenseList, saveExpense } from "@/storage/expenseStorage";

interface ExpenseContextType {
  expenses: ExpenseModel[];
  addExpense: (expense: ExpenseModel) => void;
  updateExpense: (expense: ExpenseModel) => void;
  deleteExpense: (expenseId: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);

  useEffect(() => {
    (async () => {
      const storedExpenses = await getExpenseList();
      setExpenses(storedExpenses ?? []);
    })();
  }, []);

  const addExpense = async (expense: ExpenseModel) => {
    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    await saveExpense(updatedExpenses);
  };

  const deleteExpense = async (id: string) => {
    const updatedExpenses = expenses.filter((e) => e.id !== id);
    setExpenses(updatedExpenses);
    await saveExpense(updatedExpenses);
  };

  const updateExpense = async (expense: ExpenseModel) => {
    const updatedExpenses = expenses.map((e) =>
      e.id === expense.id ? expense : e
    );
    setExpenses(updatedExpenses);
    await saveExpense(updatedExpenses);
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, updateExpense, deleteExpense}}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within ExpenseProvider");
  }
  return context;
};

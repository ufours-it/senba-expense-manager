import * as yup from 'yup';

export const expenseSchema = yup.object({
  id: yup.string().required(),
  category: yup.string().required('Category is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than zero')
    .required('Amount is required'),
  date: yup.date().required('Date is required'),
  notes: yup.string().required('Notes field is required'),
});

export type ExpenseFormData = yup.InferType<typeof expenseSchema>;
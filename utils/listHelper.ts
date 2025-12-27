import { ExpenseModel } from "@/models/expense";

export const groupExpensesByDate = (expenses: ExpenseModel[]) => {
  if (!expenses.length) return [];

  const groups: Record<
    string,
    { date: Date; items: ExpenseModel[] }
  > = {};

  const stripTime = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

  expenses.forEach((item) => {
    const date = stripTime(new Date(item.date));
    const key = date.toISOString(); // sortable key

    if (!groups[key]) {
      groups[key] = { date, items: [] };
    }
    groups[key].items.push(item);
  });
  const formatTitle = (date: Date): string => {
    const today = stripTime(new Date());
    const diff =
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };
  return Object.values(groups)
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // newest first
    .map((group) => ({
      title: formatTitle(group.date),
      data: group.items,
    }));
};


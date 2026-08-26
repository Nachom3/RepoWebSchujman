import type { Budget, BudgetItem } from "@prisma/client";

export type BudgetItemRecord = BudgetItem;
export type BudgetRecord = Budget & { items: BudgetItem[] };
export type BudgetResponse = BudgetRecord;
export type BudgetListResponse = BudgetResponse[];

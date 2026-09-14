"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { ExpenseDialog } from "@/components/trips/expenses/expense-dialog";
import { deleteExpense } from "@/app/actions/expenses";
import { formatDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import type { Expense, User } from "@/generated/prisma/client";

export function ExpenseRow({
  tripId,
  expense,
  paidBy,
  travelers,
}: {
  tripId: string;
  expense: Expense;
  paidBy: User | null;
  travelers: User[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const categoryMeta = EXPENSE_CATEGORIES.find((c) => c.value === expense.category);

  return (
    <Card className="flex items-center gap-4 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
        {categoryMeta?.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{expense.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(expense.date)} · {categoryMeta?.label ?? expense.category}
        </p>
      </div>
      {paidBy && (
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar name={paidBy.name} color={paidBy.avatarColor} size="sm" />
          <span className="text-sm text-muted-foreground">{paidBy.name}</span>
        </div>
      )}
      <p className="w-20 shrink-0 text-right font-medium">{formatCurrency(expense.amount)}</p>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditOpen(true); }}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => { e.preventDefault(); setDeleteOpen(true); }}
            className="text-danger data-[highlighted]:bg-danger-light"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExpenseDialog
        tripId={tripId}
        expense={expense}
        travelers={travelers}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this expense?"
        description={`"${expense.name}" (${formatCurrency(expense.amount)}) will be removed.`}
        successMessage="Expense deleted"
        onConfirm={() => deleteExpense(tripId, expense.id)}
      />
    </Card>
  );
}

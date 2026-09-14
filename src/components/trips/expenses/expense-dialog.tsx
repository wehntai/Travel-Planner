"use client";

import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createExpense, updateExpense, type ExpenseFormState } from "@/app/actions/expenses";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import type { Expense, User } from "@prisma/client";

const initialState: ExpenseFormState = {};

export function ExpenseDialog({
  tripId,
  expense,
  travelers,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  tripId: string;
  expense?: Expense;
  travelers: User[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen } = useControllableOpen(openProp, onOpenChangeProp);
  const action = expense ? updateExpense.bind(null, tripId, expense.id) : createExpense.bind(null, tripId);

  const { state, isPending, handleSubmit } = useSubmitAction(action, initialState, () => {
    toast.success(expense ? "Expense updated" : "Expense added");
    setOpen(false);
  });

  const dateDefault = expense ? format(new Date(expense.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit expense" : "Add expense"}</DialogTitle>
          <DialogDescription>Log a shared cost for this trip.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Dinner at Ichiran"
              defaultValue={expense?.name}
              required
              autoFocus
            />
            {state.fieldErrors?.name && <p className="text-xs text-danger">{state.fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={expense?.amount}
                required
              />
              {state.fieldErrors?.amount && <p className="text-xs text-danger">{state.fieldErrors.amount}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={dateDefault} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={expense?.category ?? "other"}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="paidById">Paid by</Label>
              <Select name="paidById" defaultValue={expense?.paidById ?? "none"}>
                <SelectTrigger id="paidById">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unspecified</SelectItem>
                  {travelers.map((traveler) => (
                    <SelectItem key={traveler.id} value={traveler.id}>
                      {traveler.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={2} defaultValue={expense?.notes ?? ""} />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : expense ? "Save changes" : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

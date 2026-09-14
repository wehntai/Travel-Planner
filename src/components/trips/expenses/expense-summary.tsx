import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import type { Expense, User } from "@/generated/prisma/client";

export function ExpenseSummary({
  expenses,
  travelers,
}: {
  expenses: Expense[];
  travelers: User[];
}) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = EXPENSE_CATEGORIES.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.category === c.value).reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.total > 0);

  const byPayer = travelers
    .map((t) => ({
      traveler: t,
      total: expenses.filter((e) => e.paidById === t.id).reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((p) => p.total > 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-1 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Spent</p>
        <p className="font-display text-3xl font-medium">{formatCurrency(total)}</p>
        <p className="text-xs text-muted-foreground">
          {expenses.length} expense{expenses.length === 1 ? "" : "s"} logged
        </p>
      </Card>

      <Card className="flex flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">By Category</p>
        {byCategory.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses yet.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {byCategory.map((c) => (
              <div key={c.value} className="flex items-center justify-between text-sm">
                <span>
                  {c.emoji} {c.label}
                </span>
                <span className="font-medium">{formatCurrency(c.total)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Who Paid</p>
        {byPayer.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses yet.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {byPayer.map(({ traveler, total: payerTotal }) => (
              <div key={traveler.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Avatar name={traveler.name} color={traveler.avatarColor} size="sm" />
                  {traveler.name}
                </span>
                <span className="font-medium">{formatCurrency(payerTotal)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

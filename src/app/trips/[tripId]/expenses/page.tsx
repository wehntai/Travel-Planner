import { notFound } from "next/navigation";
import { Receipt, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTrip } from "@/lib/data/trips";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { ExpenseDialog } from "@/components/trips/expenses/expense-dialog";
import { ExpenseRow } from "@/components/trips/expenses/expense-row";
import { ExpenseSummary } from "@/components/trips/expenses/expense-summary";

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const expenses = await prisma.expense.findMany({
    where: { tripId },
    include: { paidBy: true },
    orderBy: { date: "desc" },
  });

  const travelers = trip.members.map((m) => m.user);

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses logged yet"
        description="Track shared costs as you go so it's easy to see who paid for what."
        action={
          <ExpenseDialog
            tripId={tripId}
            travelers={travelers}
            trigger={
              <Button>
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ExpenseSummary expenses={expenses} travelers={travelers} />

      <div className="flex justify-end">
        <ExpenseDialog
          tripId={tripId}
          travelers={travelers}
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        {expenses.map((expense) => (
          <ExpenseRow
            key={expense.id}
            tripId={tripId}
            expense={expense}
            paidBy={expense.paidBy}
            travelers={travelers}
          />
        ))}
      </div>
    </div>
  );
}

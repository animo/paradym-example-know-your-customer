import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Home,
  PieChart,
  Settings,
  Bell,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Success Banner */}
      <div className="border-b border-border bg-accent/10">
        <div className="mx-auto flex max-w-2xl items-center justify gap-3 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Identity verified successfully
            </p>
            <p className="text-sm text-muted-foreground">
              Your account is now ready to use
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-2xl font-semibold text-foreground">
              Erika Mustermann
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </header>

        {/* Balance Card */}
        <Card className="mt-6 border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-foreground">
                $0.00
              </span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 gap-2 rounded-full" size="lg">
                <ArrowDownLeft className="h-4 w-4" />
                Add Money
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 rounded-full"
                size="lg"
              >
                <ArrowUpRight className="h-4 w-4" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-medium text-foreground">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <QuickAction
              icon={<CreditCard className="h-5 w-5" />}
              label="Cards"
            />
            <QuickAction
              icon={<ArrowUpRight className="h-5 w-5" />}
              label="Transfer"
            />
            <QuickAction
              icon={<PieChart className="h-5 w-5" />}
              label="Invest"
            />
            <QuickAction
              icon={<MoreHorizontal className="h-5 w-5" />}
              label="More"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-medium text-foreground">
            Recent Transactions
          </h2>
          <Card className="border-border shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No transactions yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add money to start using your account
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Navigation */}
        <nav className="mt-8 flex items-center justify-around rounded-2xl border border-border bg-card py-4">
          <NavItem icon={<Home className="h-5 w-5" />} label="Home" active />
          <NavItem icon={<CreditCard className="h-5 w-5" />} label="Cards" />
          <NavItem icon={<PieChart className="h-5 w-5" />} label="Invest" />
          <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
        </nav>
      </div>
    </main>
  );
}

function QuickAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-secondary">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground">
        {icon}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

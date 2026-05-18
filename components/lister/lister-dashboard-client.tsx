"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Home,
  Eye,
  Users,
  Plus,
  Trash2,
  ArrowRight,
  Clock,
  PoundSterling,
  Bell,
  GraduationCap,
  MessageSquare,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { removeTenant } from "@/app/actions/tenant-actions";
import type { ListerProfile } from "@/hooks/use-lister-profile";
import type {
  DashboardListing,
  DashboardTenant,
  MonthlyDataPoint,
  PendingRequest,
  RevenueDataPoint,
} from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

interface Props {
  profile: ListerProfile;
  listings: DashboardListing[];
  tenants: DashboardTenant[];
  pendingRequests: PendingRequest[];
  monthlyData: MonthlyDataPoint[];
  revenueData: RevenueDataPoint[];
}

// ─── Chart Tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  valuePrefix = "",
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  valuePrefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-1.5 max-w-[160px] truncate">
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium text-foreground">
            {valuePrefix}
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  href?: string;
  highlight?: boolean;
}) {
  const card = (
    <Card
      className={cn(
        "py-0 transition-all duration-200",
        href && "hover:shadow-md hover:-translate-y-0.5",
        highlight ? "border-primary/30 bg-primary/5 dark:bg-primary/10" : "",
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              highlight ? "bg-primary/20" : "bg-primary/10",
            )}
          >
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        <p className="text-sm font-medium text-foreground/80 mt-0.5">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

// ─── Tenant Row ────────────────────────────────────────────────────────────────

function TenantRow({
  tenant,
  onRemove,
}: {
  tenant: DashboardTenant;
  onRemove: (tenant: DashboardTenant) => void;
}) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const name = tenant.student_profiles?.full_name ?? "Unknown";
  const university = tenant.student_profiles?.university_name ?? "—";
  const major = tenant.student_profiles?.major ?? "—";
  const avatar = tenant.student_profiles?.avatar_url;
  const listingTitle = tenant.listing?.title ?? "Unknown Listing";
  const city = tenant.listing?.city ?? "—";
  const addedDate = new Date(tenant.added_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleConfirmRemove = () => {
    startTransition(async () => {
      const result = await removeTenant(tenant.listing_id, tenant.user_id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${name} removed from listing`);
        onRemove(tenant);
      }
    });
  };

  return (
    <>
      <tr className="hover:bg-muted/30 transition-colors duration-150 group">
        {/* Tenant */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={avatar ?? undefined} className="object-cover" />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">
                {name}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                {major}
              </p>
            </div>
          </div>
        </td>

        {/* Listing */}
        <td className="px-4 py-3.5 hidden sm:table-cell">
          <p className="text-sm text-foreground truncate max-w-[200px]">
            {listingTitle}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{city}</p>
        </td>

        {/* University */}
        <td className="px-4 py-3.5 hidden lg:table-cell">
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {university}
          </p>
        </td>

        {/* Added */}
        <td className="px-4 py-3.5 hidden xl:table-cell">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            {addedDate}
          </div>
        </td>

        {/* Actions — 3-dot dropdown */}
        <td className="px-5 py-3.5 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Tenant actions"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => setAlertOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Remove from listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {name} from <strong>{listingTitle}</strong>. They
              will be notified and can re-request if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remove Tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function ListerDashboardClient({
  profile,
  listings,
  tenants,
  pendingRequests,
  monthlyData,
  revenueData,
}: Props) {
  const [tenantList, setTenantList] = useState<DashboardTenant[]>(tenants);

  // Sync state if props change (e.g. after Next.js revalidation)
  useEffect(() => {
    setTenantList(tenants);
  }, [tenants]);

  const firstName = profile.full_name.split(" ")[0];
  const activeCount = listings.filter((l) => l.status === "active").length;
  const pausedCount = listings.filter((l) => l.status === "paused").length;
  const draftCount = listings.filter((l) => l.status === "draft").length;
  const totalRevenue = listings
    .filter((l) => l.status === "active")
    .reduce((sum, l) => sum + l.price_per_month, 0);

  const handleRemove = (removed: DashboardTenant) => {
    setTenantList((prev) => prev.filter((t) => t.id !== removed.id));
  };

  const axisStyle = {
    fontSize: 11,
    fill: "var(--muted-foreground)",
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* ── Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-foreground">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your listings and tenants from here.
          </p>
        </div>
        <Button asChild className="gap-2 self-start sm:self-auto">
          <Link href="/lister/listings/new">
            <Plus className="h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Home}
          label="Total Listings"
          value={String(listings.length)}
          sub={`${draftCount} draft · ${pausedCount} paused`}
          href="/lister/listings"
        />
        <StatCard
          icon={Eye}
          label="Active"
          value={String(activeCount)}
          sub="visible to students"
          href="/lister/listings"
        />
        <StatCard
          icon={Users}
          label="Tenants"
          value={String(tenantList.length)}
          sub="across all listings"
        />
        <StatCard
          icon={Bell}
          label="Pending"
          value={String(pendingRequests.length)}
          sub="requests to review"
          href="/lister/notifications"
          highlight={pendingRequests.length > 0}
        />
      </div>

      {/* ── Revenue Banner ── */}
      {totalRevenue > 0 && (
        <Card className="py-0 border-primary/20 bg-primary/5 dark:bg-primary/10">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 dark:bg-primary/20 flex items-center justify-center shrink-0">
                <PoundSterling className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Est. Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-foreground">
                  £{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground sm:text-right">
              Based on {activeCount} active listing
              {activeCount !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Area Chart — Growth Overview */}
        <Card className="lg:col-span-3 py-0">
          <CardHeader className="px-5 pt-5 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">
                  Growth Overview
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Listings added and tenants joined per month
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                Last 6 months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="listingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="tenantsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#f97316"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f97316"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(v) => (
                    <span
                      style={{ color: "var(--muted-foreground)" }}
                      className="capitalize"
                    >
                      {v}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="listings"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#listingsGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="tenants"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#tenantsGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart — Revenue by Active Listing */}
        <Card className="lg:col-span-2 py-0">
          <CardHeader className="px-5 pt-5 pb-2">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Revenue by Listing
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly price per active listing
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-5">
            {revenueData.length === 0 ? (
              <div className="h-[220px] flex flex-col items-center justify-center gap-2 text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <PoundSterling className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  No active listings yet
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  barSize={20}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `£${v}`}
                  />
                  <Tooltip 
                    content={<ChartTooltip valuePrefix="£" />} 
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }} 
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    opacity={0.85}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Pending Requests ── */}
      {pendingRequests.length > 0 && (
        <Card className="py-0">
          <CardHeader className="px-5 pt-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    Pending Requests
                    <Badge className="text-xs h-5 px-1.5">
                      {pendingRequests.length}
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Students waiting for your response
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs shrink-0"
              >
                <Link href="/lister/notifications">
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {pendingRequests.map((req, i) => {
              const name = req.student_profiles?.full_name ?? "Unknown Student";
              const university = req.student_profiles?.university_name ?? "";
              const major = req.student_profiles?.major ?? "";
              const avatar = req.student_profiles?.avatar_url;
              const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              const postedAgo = formatDistanceToNow(new Date(req.created_at), {
                addSuffix: true,
              });

              return (
                <div
                  key={req.id}
                  className={cn(
                    "flex items-start gap-3 px-5 py-4",
                    i < pendingRequests.length - 1 &&
                      "border-b border-border/50",
                  )}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage
                      src={avatar ?? undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-none mb-0.5">
                      {name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <GraduationCap className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {major}
                        {university ? ` · ${university}` : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Wants to join{" "}
                      <span className="text-primary font-medium">
                        {req.listing_title}
                      </span>{" "}
                      · {postedAgo}
                    </p>
                    {req.message && (
                      <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
                        &ldquo;{req.message}&rdquo;
                      </p>
                    )}
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1 shrink-0"
                  >
                    <Link href="/lister/notifications">
                      Review
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ── Tenants Table ── */}
      <Card className="py-0">
        <CardHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  All Tenants
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tenantList.length} tenant
                  {tenantList.length !== 1 ? "s" : ""} across your properties
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {tenantList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No tenants yet
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Tenants appear here once students are accepted on your listings.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 whitespace-nowrap">
                      Tenant
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      Listing
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      University
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap hidden xl:table-cell">
                      Added
                    </th>
                    <th className="w-12 px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tenantList.map((tenant) => (
                    <TenantRow
                      key={tenant.id}
                      tenant={tenant}
                      onRemove={handleRemove}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

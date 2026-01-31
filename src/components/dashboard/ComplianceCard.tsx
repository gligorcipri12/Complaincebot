import { Button } from "@/components/ui/button";
import {
  Shield,
  FileText,
  Users,
  Receipt,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import type { ComplianceCategory } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

// ===============================
// Types
// ===============================
interface ComplianceCardProps {
  category: ComplianceCategory & {
    items: {
      id: string;
      name: string;
      status: "done" | "warning" | "pending";
    }[];
  };
  onUpdateStatus: (
    itemId: string,
    status: "done" | "warning" | "pending"
  ) => void;
}

// ===============================
// Icons
// ===============================
const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  file: FileText,
  users: Users,
  receipt: Receipt,
};

// ===============================
// Helpers
// ===============================
function StatusIcon({ status }: { status: "done" | "warning" | "pending" }) {
  switch (status) {
    case "done":
      return <CheckCircle className="w-5 h-5 text-success" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case "pending":
      return <XCircle className="w-5 h-5 text-danger" />;
  }
}

function getCategoryStatus(
  items: ComplianceCardProps["category"]["items"]
): "success" | "warning" | "danger" {
  if (items.length === 0) return "danger";

  const done = items.filter((i) => i.status === "done").length;
  const warning = items.filter((i) => i.status === "warning").length;

  if (done === items.length) return "success";
  if (done > 0 || warning > 0) return "warning";
  return "danger";
}

function getProgress(items: ComplianceCardProps["category"]["items"]) {
  if (items.length === 0) return 0;
  const done = items.filter((i) => i.status === "done").length;
  return Math.round((done / items.length) * 100);
}

function statusColor(status: "success" | "warning" | "danger") {
  switch (status) {
    case "success":
      return "bg-success";
    case "warning":
      return "bg-warning";
    case "danger":
      return "bg-danger";
  }
}

// ===============================
// Component
// ===============================
const ComplianceCard = ({
  category,
  onUpdateStatus,
}: ComplianceCardProps) => {
  const Icon =
    iconMap[category.icon?.toLowerCase?.()] ?? Shield;

  const categoryStatus = getCategoryStatus(category.items);
  const progress = getProgress(category.items);

  return (
    <div className="glass-card-strong rounded-xl p-5 transition-all hover:shadow-medium">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              categoryStatus === "success"
                ? "bg-success/10"
                : categoryStatus === "warning"
                ? "bg-warning/10"
                : "bg-danger/10"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                categoryStatus === "success"
                  ? "text-success"
                  : categoryStatus === "warning"
                  ? "text-warning"
                  : "text-danger"
              }`}
            />
          </div>

          <div>
            <h3 className="font-semibold text-foreground">
              {category.category}
            </h3>
            <p className="text-sm text-muted-foreground">
              {progress}% complet
            </p>
          </div>
        </div>

        <StatusIcon
          status={
            categoryStatus === "success"
              ? "done"
              : categoryStatus === "warning"
              ? "warning"
              : "pending"
          }
        />
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all ${statusColor(
            categoryStatus
          )}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <ul className="space-y-2 mb-4">
        {category.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 text-sm"
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <StatusIcon status={item.status} />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    onUpdateStatus(item.id, "done")
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-success" />
                  Finalizat
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    onUpdateStatus(item.id, "warning")
                  }
                >
                  <AlertTriangle className="w-4 h-4 mr-2 text-warning" />
                  În lucru
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    onUpdateStatus(item.id, "pending")
                  }
                >
                  <XCircle className="w-4 h-4 mr-2 text-danger" />
                  Neînceput
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span
              className={
                item.status === "done"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>

      <Button variant="outline" size="sm" className="w-full gap-2">
        Acțiune
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ComplianceCard;

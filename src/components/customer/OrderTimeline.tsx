import { Check, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types/customer";
import { statusLabels, statusOrder } from "@/lib/orderUtils";

const OrderTimeline = ({ status }: { status: OrderStatus }) => {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-destructive">
        <XCircle className="w-4 h-4" />
        <span className="text-sm font-semibold">Pedido cancelado</span>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      {statusOrder.map((step, index) => {
        const done = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={step} className="flex flex-1 gap-3 sm:flex-col sm:items-center sm:gap-2">
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <div className="hidden sm:block sm:flex-1">
                {index > 0 && (
                  <div className={`h-0.5 w-full ${index <= currentIndex ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <div className="hidden sm:block sm:flex-1">
                {index < statusOrder.length - 1 && (
                  <div className={`h-0.5 w-full ${index < currentIndex ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
              <div className="sm:hidden">
                {index < statusOrder.length - 1 && (
                  <div className={`ml-0 h-8 w-0.5 ${index < currentIndex ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            </div>
            <span
              className={`pb-6 text-xs sm:pb-0 sm:text-center ${
                isCurrent ? "font-bold text-primary" : done ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {statusLabels[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderTimeline;

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-smooth",
  {
    variants: {
      variant: {
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        error: "bg-destructive/10 text-destructive border border-destructive/20",
        info: "bg-primary/10 text-primary border border-primary/20",
        neutral: "bg-muted text-muted-foreground border border-border",
        agendado: "bg-primary/10 text-primary border border-primary/20",
        realizado: "bg-success/10 text-success border border-success/20",
        cancelado: "bg-destructive/10 text-destructive border border-destructive/20"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({ className, variant, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}
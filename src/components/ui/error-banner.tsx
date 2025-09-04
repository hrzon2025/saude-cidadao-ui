import { AlertTriangle, X, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Alert, AlertDescription } from "./alert";
import { cn } from "@/lib/utils";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorBanner({ 
  message, 
  onRetry, 
  onDismiss, 
  className 
}: ErrorBannerProps) {
  return (
    <Alert className={cn("border-destructive/50 text-destructive", className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1 mr-2">{message}</span>
        
        <div className="flex items-center gap-1">
          {onRetry && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRetry}
              className="h-8 px-2 text-destructive hover:text-destructive"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Tentar novamente
            </Button>
          )}
          
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
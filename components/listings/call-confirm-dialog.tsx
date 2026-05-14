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
  cloneElement,
  useState,
  type MouseEvent,
  type ReactElement,
} from "react";

interface CallConfirmDialogProps {
  formattedPhone: string;
  callHref: string;
  children: ReactElement<{
    onClick?: (e: MouseEvent<HTMLElement>) => void;
  }>;
}

export function CallConfirmDialog({
  formattedPhone,
  callHref,
  children,
}: CallConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {cloneElement(children, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          children.props.onClick?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        },
      })}
      <AlertDialogContent
        onInteractOutside={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to call this number?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to call <strong>{formattedPhone}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              if (typeof window !== "undefined") {
                window.location.href = callHref;
              }
            }}
            aria-label={`Confirm call to ${formattedPhone}`}
          >
            Yes, call now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sheetVariants> {
  open?: boolean;
  onClose?: () => void;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, open, onClose }, ref) => {
    const variants = {
      right: { x: '100%' },
      left: { x: '-100%' },
      top: { y: '-100%' },
      bottom: { y: '100%' },
    };

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              ref={ref}
              className={cn(sheetVariants({ side }), className)}
              initial={variants[side]}
              animate={{ x: 0, y: 0 }}
              exit={variants[side]}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);
SheetContent.displayName = "SheetContent";

const Sheet = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) => {
    return <SheetContent open={open} onClose={onClose}>{children}</SheetContent>
}

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
);
SheetTitle.displayName = "SheetTitle";

const SheetDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
SheetDescription.displayName = "SheetDescription";

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription };

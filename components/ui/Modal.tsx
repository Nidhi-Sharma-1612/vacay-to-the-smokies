"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useIsClient } from "@/lib/hooks";

type Props = { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "md" | "2xl" };

/** Bottom sheet on mobile, centered dialog on larger screens. */
export function Modal({ open, onClose, title, children, size = "2xl" }: Props) {
  const isClient = useIsClient();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-forest-950/50 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`max-h-[88svh] w-full ${size === "md" ? "max-w-lg" : "max-w-2xl"} overflow-y-auto rounded-t-3xl bg-cream-50 sm:rounded-3xl`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-linen-200 bg-cream-50 px-6 py-4 sm:px-8">
              <h2 className="font-serif text-2xl text-forest-900">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-linen-100">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portaled to <body> so it stacks above sheets and transformed parents.
  return isClient ? createPortal(content, document.body) : null;
}

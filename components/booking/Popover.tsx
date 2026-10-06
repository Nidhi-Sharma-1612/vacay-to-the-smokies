"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useIsClient, useIsDesktop } from "@/lib/hooks";

type PopoverProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  align?: "left" | "right" | "center";
  /** "modal" centers the panel over the page on desktop instead of anchoring it to the trigger. */
  mode?: "anchored" | "modal";
  className?: string;
};

/**
 * Dropdown panel on desktop, bottom sheet on mobile.
 * Place it inside a `relative` wrapper next to its trigger; triggers should carry `data-popover-trigger`.
 */
export function Popover({ open, onClose, title, children, footer, align = "left", mode = "anchored", className = "" }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const isClient = useIsClient();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onPointer = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target) || target.closest("[data-popover-trigger]")) return;
      onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open, onClose]);

  const position = align === "right" ? "md:right-0" : align === "center" ? "md:left-1/2 md:-translate-x-1/2" : "md:left-0";
  const modal = mode === "modal";
  const desktopPlacement = modal
    ? "md:fixed md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:max-h-[90svh] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:p-6"
    : `md:absolute md:inset-x-auto md:max-h-none md:top-[calc(100%+0.75rem)] md:bottom-auto md:rounded-3xl md:p-6 ${position}`;

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={`fixed inset-0 z-[60] bg-forest-950/40 ${modal ? "" : "md:hidden"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-label={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`fixed inset-x-0 bottom-0 z-[70] max-h-[88svh] overflow-y-auto rounded-t-3xl bg-cream-50 p-5 shadow-lift ${desktopPlacement} ${className}`}
          >
            <div className={`mb-4 flex items-center justify-between ${modal ? "" : "md:hidden"}`}>
              <p className="font-serif text-xl text-forest-900">{title}</p>
              <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 text-forest-900 hover:bg-linen-100">
                <X className="size-5" />
              </button>
            </div>
            {children}
            {footer && <div className="mt-5 flex items-center justify-between gap-3 border-t border-linen-200 pt-4">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Sheets and modals are portaled to <body> so transformed ancestors can't trap its fixed positioning.
  if (desktop && !modal) return content;
  return isClient ? createPortal(content, document.body) : null;
}

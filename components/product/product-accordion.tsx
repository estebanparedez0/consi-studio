"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface ProductAccordionItem {
  id: string;
  title: string;
  content: string;
}

interface ProductAccordionProps {
  items: ProductAccordionItem[];
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  const [openItemId, setOpenItemId] = useState(items[0]?.id);

  return (
    <section className="rounded-[1.6rem] border border-line bg-surface shadow-soft">
      {items.map((item, index) => {
        const isOpen = item.id === openItemId;

        return (
          <div
            key={item.id}
            className={cn(index !== items.length - 1 && "border-b border-line")}
          >
            <button
              type="button"
              className="flex min-h-14 w-full items-center justify-between gap-4 px-4 text-left"
              onClick={() => setOpenItemId(isOpen ? "" : item.id)}
            >
              <span className="text-sm font-medium text-foreground">{item.title}</span>
              <span className="text-lg text-muted">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? (
              <div className="px-4 pb-4 text-sm leading-6 text-muted">{item.content}</div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}

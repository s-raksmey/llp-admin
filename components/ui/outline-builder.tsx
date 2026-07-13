"use client";

import { useMemo } from "react";
import {
  parseOutline,
  serializeOutline,
  type OutlineItem,
} from "@/lib/outline";

type OutlineBuilderProps = {
  value: string;
  onChange: (value: string) => void;
};

export function OutlineBuilder({ value, onChange }: Readonly<OutlineBuilderProps>) {
  const items = useMemo(() => parseOutline(value), [value]);

  function commit(nextItems: OutlineItem[]) {
    onChange(serializeOutline(nextItems));
  }

  function updateItem(index: number, title: string) {
    commit(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title } : item,
      ),
    );
  }

  function updateChild(itemIndex: number, childIndex: number, title: string) {
    commit(
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              children: (item.children ?? []).map((child, index) =>
                index === childIndex ? title : child,
              ),
            }
          : item,
      ),
    );
  }

  function addItem() {
    commit([...items, { title: `New lesson ${items.length + 1}` }]);
  }

  function addChild(itemIndex: number) {
    commit(
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              children: [...(item.children ?? []), "New sub lesson"],
            }
          : item,
      ),
    );
  }

  function removeItem(itemIndex: number) {
    commit(items.filter((_, index) => index !== itemIndex));
  }

  function removeChild(itemIndex: number, childIndex: number) {
    commit(
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              children: (item.children ?? []).filter(
                (_, index) => index !== childIndex,
              ),
            }
          : item,
      ),
    );
  }

  function moveItem(itemIndex: number, direction: -1 | 1) {
    const targetIndex = itemIndex + direction;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(itemIndex, 1);
    nextItems.splice(targetIndex, 0, movedItem);
    commit(nextItems);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Lesson structure
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Add main lessons, then attach sub-lessons under the right item.
            </p>
          </div>
          <button
            className="admin-interactive rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
            onClick={addItem}
            type="button"
          >
            Add item
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {items.map((item, itemIndex) => (
            <article
              className="admin-row-enter rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3"
              key={`${item.title}-${itemIndex}`}
              style={{ animationDelay: `${itemIndex * 45}ms` }}
            >
              <div className="grid gap-2 sm:grid-cols-[28px_minmax(0,1fr)_auto] sm:items-center">
                <span className="font-mono text-xs font-bold text-[var(--muted)]">
                  {itemIndex + 1}
                </span>
                <input
                  className="h-10 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium text-foreground outline-none focus:border-blue-500"
                  onChange={(event) => updateItem(itemIndex, event.target.value)}
                  value={item.title}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    className="admin-interactive rounded-md border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
                    disabled={itemIndex === 0}
                    onClick={() => moveItem(itemIndex, -1)}
                    type="button"
                  >
                    Up
                  </button>
                  <button
                    className="admin-interactive rounded-md border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
                    disabled={itemIndex === items.length - 1}
                    onClick={() => moveItem(itemIndex, 1)}
                    type="button"
                  >
                    Down
                  </button>
                  <button
                    className="admin-interactive rounded-md border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
                    onClick={() => addChild(itemIndex)}
                    type="button"
                  >
                    Sub item
                  </button>
                  <button
                    className="admin-interactive rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    onClick={() => removeItem(itemIndex)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {item.children?.length ? (
                <div className="ml-7 mt-3 space-y-2 border-l border-[var(--border)] pl-4">
                  {item.children.map((child, childIndex) => (
                    <div
                      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
                      key={`${child}-${childIndex}`}
                    >
                      <input
                        className="h-9 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm text-foreground outline-none focus:border-blue-500"
                        onChange={(event) =>
                          updateChild(itemIndex, childIndex, event.target.value)
                        }
                        value={child}
                      />
                      <button
                        className="admin-interactive rounded-md px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-red-600"
                        onClick={() => removeChild(itemIndex, childIndex)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <TableOfContentsPreview items={items} />
    </div>
  );
}

function TableOfContentsPreview({ items }: Readonly<{ items: OutlineItem[] }>) {
  return (
    <aside className="admin-fade-right rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-5">
      <h3 className="text-sm font-bold text-foreground">Table of Contents</h3>
      <ol className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
        {items.map((item, index) => (
          <li className="admin-row-enter" key={`${item.title}-${index}`}>
            <div className="grid grid-cols-[22px_minmax(0,1fr)] gap-1">
              <span>{index + 1}</span>
              <span>{item.title}</span>
            </div>
            {item.children?.length ? (
              <ul className="ml-10 mt-3 space-y-3">
                {item.children.map((child) => (
                  <li key={child}>{child}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </aside>
  );
}

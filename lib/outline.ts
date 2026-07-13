export type OutlineItem = {
  title: string;
  children?: string[];
};

export const defaultLessonOutline = [
  "Data, Features, and Targets",
  "Preprocessing and Feature Engineering",
  "Linear vs. Logistic Regression",
  "Losses",
  "  Mean Squared Error",
  "  Binary Cross-Entropy",
  "Optimization",
  "Regularization",
  "Metrics",
  "  Regression",
  "  Classification",
  "Evaluation Protocol",
  "Final Checklist",
].join("\n");

export function parseOutline(value: string): OutlineItem[] {
  return value.split(/\r?\n/).reduce<OutlineItem[]>((items, line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return items;
    }

    const isChild = line.startsWith(" ") || line.startsWith("\t");
    const normalizedTitle = trimmedLine.replace(/^[-*]\s+/, "");

    if (isChild && items.length > 0) {
      const lastItem = items[items.length - 1];
      lastItem.children = [...(lastItem.children ?? []), normalizedTitle];
      return items;
    }

    return [...items, { title: normalizedTitle }];
  }, []);
}

export function serializeOutline(items: OutlineItem[]) {
  return items
    .flatMap((item) => [
      item.title,
      ...(item.children ?? []).map((child) => `  ${child}`),
    ])
    .join("\n");
}

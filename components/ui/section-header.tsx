type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: Readonly<SectionHeaderProps>) {
  return (
    <section className="admin-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-600">{eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-normal text-foreground">
        {title}
      </h1>
      <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-[var(--muted)]">
        {description}
      </p>
    </section>
  );
}

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
      <p className="text-sm font-semibold text-blue-600">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
    </section>
  );
}

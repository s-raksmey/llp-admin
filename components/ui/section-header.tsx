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
    <section>
      <p className="text-sm font-medium text-teal-700">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </section>
  );
}

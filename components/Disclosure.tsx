export default function Disclosure({ text }: { text: string }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-xl2 border border-dashed border-neutral-300 dark:border-neutral-700 p-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <strong className="block mb-1 text-neutral-700 dark:text-neutral-300">
          Affiliate Disclosure
        </strong>
        {text}
      </div>
    </section>
  );
}

import DarkModeToggle from "./DarkModeToggle";

export default function Header({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="text-base font-bold tracking-tight">
          {name}
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <a href="#featured" className="hover:text-accent transition-colors">Featured</a>
          <a href="#categories" className="hover:text-accent transition-colors">Categories</a>
          <a href="#all-products" className="hover:text-accent transition-colors">All Products</a>
          <a href="#deals" className="hover:text-accent transition-colors">Best Deals</a>
        </nav>
        <DarkModeToggle />
      </div>
    </header>
  );
}

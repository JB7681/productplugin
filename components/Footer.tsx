export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-neutral-100 dark:border-neutral-800 py-8 text-center text-xs text-neutral-400">
      <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
      <p className="mt-1">
        <a href="/admin/login" className="hover:text-accent transition-colors">
          Admin
        </a>
      </p>
    </footer>
  );
}

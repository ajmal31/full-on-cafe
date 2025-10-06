import Link from 'next/link';

type HeaderProps = {
  title: string;
  showAdminLink?: boolean;
};

export function Header({ title, showAdminLink = false }: HeaderProps) {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl md:text-2xl font-bold text-primary font-headline">{title}</h1>
        {showAdminLink && (
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}

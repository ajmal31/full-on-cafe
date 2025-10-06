import Link from 'next/link';
import { Logo } from './Logo';

type HeaderProps = {
  title: string;
  showAdminLink?: boolean;
};

export function Header({ title, showAdminLink = false }: HeaderProps) {
  return (
    <header className="bg-background/80 backdrop-blur-sm shadow-md sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Logo className="w-12 h-12" />
          <h1 className="text-xl md:text-2xl font-bold text-primary font-headline">{title}</h1>
        </div>
        {showAdminLink && (
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}

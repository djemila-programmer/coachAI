import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { MobileNav } from './MobileNav';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

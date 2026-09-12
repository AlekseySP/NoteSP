import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cream">
      {/* Sidebar */}
      {sidebar}

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-card">
        {children}
      </main>
    </div>
  );
}

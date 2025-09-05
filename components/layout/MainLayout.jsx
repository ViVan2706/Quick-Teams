"use client";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b bg-card shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Quick Teams</h1>
          <nav className="space-x-4 text-sm">
            <a href="/" className="hover:underline">Home</a>
            <a href="/profilePage" className="hover:underline">Profile</a>
            <a href="/teams" className="hover:underline">Teams</a>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-8 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Quick Teams. All rights reserved.
      </footer>
    </div>
  );
}

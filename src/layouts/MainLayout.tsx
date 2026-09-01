"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { Toaster } from "react-hot-toast";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fungsi untuk mengecek menu mana yang sedang aktif
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Header Mobile & Hamburger Menu */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shadow-sm z-20">
        <h1 className="text-lg font-bold text-indigo-600">Sistem Roster</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay Gelap saat Sidebar Terbuka di Mobile */}
      {isSidebarOpen ? <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)} /> : null}

      {/* Sidebar (Responsif) */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="hidden md:block p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-indigo-600">Sistem Roster</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className={`block px-4 py-2 rounded-md font-medium transition-colors ${isActive("/") ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
            Jadwal Kuliah
          </Link>
          <Link href="/courses" onClick={() => setIsSidebarOpen(false)} className={`block px-4 py-2 rounded-md font-medium transition-colors ${isActive("/courses") ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
            Matakuliah
          </Link>
          <Link
            href="/lecturers"
            onClick={() => setIsSidebarOpen(false)}
            className={`block px-4 py-2 rounded-md font-medium transition-colors ${isActive("/lecturers") ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Dosen
          </Link>
          <Link href="/rooms" onClick={() => setIsSidebarOpen(false)} className={`block px-4 py-2 rounded-md font-medium transition-colors ${isActive("/rooms") ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
            Ruangan
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center px-8 shadow-sm shrink-0">
          <span className="text-sm font-medium text-slate-500">S2 Teknik Informatika</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </main>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

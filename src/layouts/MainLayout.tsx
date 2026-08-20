import Link from "next/link";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-indigo-600">Sistem Roster</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/" className="block px-4 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium">
            Jadwal Kuliah
          </Link>
          <Link href="/courses" className="block px-4 py-2 rounded-md text-slate-600 hover:bg-slate-50">
            Matakuliah
          </Link>
          <Link href="/lecturers" className="block px-4 py-2 rounded-md text-slate-600 hover:bg-slate-50">
            Dosen
          </Link>
          <Link href="/rooms" className="block px-4 py-2 rounded-md text-slate-600 hover:bg-slate-50">
            Ruangan
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <span className="text-sm font-medium text-slate-500">S2 Teknik Informatika</span>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}

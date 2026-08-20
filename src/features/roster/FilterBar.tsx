"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDay = searchParams.get("day") || "";
  const currentSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(currentSearch);

  // Menerapkan penundaan 500ms pada state pencarian
  const debouncedSearch = useDebounce(search, 500);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push("/?" + params.toString());
    },
    [searchParams, router],
  );

  // Efek ini akan otomatis memperbarui URL setiap kali debouncedSearch berubah
  useEffect(() => {
    // Mencegah pembaruan URL yang tidak perlu jika nilainya sama persis dengan yang ada di URL
    if (debouncedSearch !== currentSearch) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, currentSearch, updateFilter]);

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilter("day", e.target.value);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div className="flex-1">
        <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Cari Matakuliah / Dosen</label>
        <input
          type="text"
          placeholder="Ketik nama matakuliah atau dosen lalu tunggu sejenak..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full sm:w-48">
        <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Filter Hari</label>
        <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={currentDay} onChange={handleDayChange}>
          <option value="">Semua Hari</option>
          <option value="SENIN">Senin</option>
          <option value="SELASA">Selasa</option>
          <option value="RABU">Rabu</option>
          <option value="KAMIS">Kamis</option>
          <option value="JUMAT">Jumat</option>
          <option value="SABTU">Sabtu</option>
        </select>
      </div>
    </div>
  );
}

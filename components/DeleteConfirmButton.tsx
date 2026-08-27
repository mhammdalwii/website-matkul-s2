"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteConfirmButtonProps = {
  id: string;
  endpoint: string;
};

export default function DeleteConfirmButton({ id, endpoint }: DeleteConfirmButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (res.ok === false) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus data");
      }

      router.refresh();
      setIsOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan sistem saat menghapus data.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Tombol Pemicu */}
      <button type="button" onClick={() => setIsOpen(true)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors">
        Hapus
      </button>

      {/* Pop-up Modal (Pure Tailwind) */}
      {isOpen === true ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Hapus Data Master?</h3>
              <p className="text-sm text-slate-500 mb-6">Data ini akan dihapus secara permanen. Jika data ini sedang digunakan pada Jadwal Kuliah, penghapusan akan ditolak oleh sistem.</p>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
                  Batal
                </button>
                <button type="button" onClick={executeDelete} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50">
                  {isDeleting === true ? "Menghapus..." : "Ya, Hapus Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Course = { id: string; name: string };
type Task = { id: string; title: string; deadline: Date; isCompleted: boolean; course: Course };

// ---  KOMPONEN FORM TAMBAH TUGAS ---
export function AddTaskForm({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          deadline: formData.get("deadline"),
          courseId: formData.get("courseId"),
        }),
      });

      if (res.ok === false) throw new Error("Gagal menambah tugas");

      toast.success("Tugas berhasil ditambahkan!");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err: unknown) {
      toast.error("Gagal menambahkan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Matakuliah</label>
          <select name="courseId" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
            <option value="">-- Pilih Matakuliah --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Tugas</label>
          <input type="text" name="title" required placeholder="Contoh: Makalah Bab 1" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
          <input type="datetime-local" name="deadline" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
        </div>
      </div>
      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
        {isSubmitting ? "Menyimpan..." : "Tambah Tugas"}
      </button>
    </form>
  );
}

// --- 2. KOMPONEN TABEL TUGAS ---
export function TaskTable({ tasks }: { tasks: Task[] }) {
  const router = useRouter();

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const loadingToast = toast.loading("Memperbarui...");
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
      toast.dismiss(loadingToast);
      toast.success(!currentStatus ? "Tugas selesai! 🎉" : "Status dibatalkan");
      router.refresh();
    } catch (e) {
      toast.dismiss(loadingToast);
      toast.error("Gagal memperbarui status");
    }
  };

  const deleteTask = async (id: string) => {
    if (!window.confirm("Hapus tugas ini?")) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      toast.success("Tugas dihapus!");
      router.refresh();
    } catch (e) {
      toast.error("Gagal menghapus tugas");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Tugas & Matakuliah</th>
            <th className="px-6 py-4">Deadline</th>
            <th className="px-6 py-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                Belum ada tugas. Waktunya bersantai!
              </td>
            </tr>
          ) : (
            tasks.map((t) => (
              <tr key={t.id} className={`hover:bg-slate-50 transition-colors ${t.isCompleted ? "bg-slate-50/50 opacity-60" : ""}`}>
                <td className="px-6 py-4">
                  <input type="checkbox" checked={t.isCompleted} onChange={() => toggleStatus(t.id, t.isCompleted)} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                </td>
                <td className="px-6 py-4">
                  <div className={`font-medium text-slate-900 ${t.isCompleted ? "line-through text-slate-500" : ""}`}>{t.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{t.course.name}</div>
                </td>
                <td className="px-6 py-4">
                  {/* Konversi tanggal ke format Indonesia */}
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${t.isCompleted ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-700 border border-red-100"}`}>
                    {new Date(t.deadline).toLocaleString("id-ID", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => deleteTask(t.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ScheduleWithDetails } from "@/src/types";
import type { Course, Lecturer, Room } from "../../../generated/prisma/client";
import EditScheduleModal from "./EditScheduleModal";

// Import shadcn/ui Alert Dialog
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type ScheduleTableProps = {
  schedules: ScheduleWithDetails[];
  courses: Course[];
  lecturers: Lecturer[];
  rooms: Room[];
};

export default function ScheduleTable({ schedules, courses, lecturers, rooms }: ScheduleTableProps) {
  const router = useRouter();

  const [editingSchedule, setEditingSchedule] = useState<ScheduleWithDetails | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fungsi hapus dipisah agar lebih rapi dan aman dari error JSX
  const executeDelete = async () => {
    if (deletingId === null) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/schedules/" + deletingId, {
        method: "DELETE",
      });

      if (res.ok === false) {
        throw new Error("Gagal menghapus");
      }

      router.refresh();
      setDeletingId(null);
    } catch (error: unknown) {
      alert("Terjadi kesalahan saat menghapus data.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Hari & Waktu</th>
              <th className="px-6 py-4">Matakuliah</th>
              <th className="px-6 py-4 whitespace-nowrap">Dosen Pengampu</th>
              <th className="px-6 py-4 whitespace-nowrap">Ruangan</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  Belum ada jadwal perkuliahan yang tersedia.
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    <div>{schedule.dayOfWeek}</div>
                    <div className="text-xs text-slate-500 font-normal mt-0.5">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{schedule.course.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {schedule.course.code} • {schedule.course.credits} SKS
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">{schedule.lecturer.name}</td>
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">{schedule.room.name}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex justify-center items-center gap-2">
                      <button type="button" onClick={() => setEditingSchedule(schedule)} className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors">
                        Edit
                      </button>

                      {/* Tombol pemicu Modal Hapus */}
                      <button type="button" onClick={() => setDeletingId(schedule.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      {editingSchedule !== null ? <EditScheduleModal schedule={editingSchedule} courses={courses} lecturers={lecturers} rooms={rooms} onClose={() => setEditingSchedule(null)} /> : null}

      {/* Modal Konfirmasi Hapus Shadcn */}
      <AlertDialog open={deletingId !== null} onOpenChange={(isOpen) => !isOpen && setDeletingId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>Jadwal ini akan dihapus secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-slate-100 border-0 hover:bg-slate-200 text-slate-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                executeDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting === true ? "Menghapus..." : "Ya, Hapus Jadwal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Course, Lecturer, Room } from "../../../generated/prisma/client";
import type { ScheduleWithDetails } from "@/src/types";

const scheduleSchema = z
  .object({
    dayOfWeek: z.enum(["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"]),
    startTime: z.string().min(4),
    endTime: z.string().min(4),
    courseId: z.string().min(1),
    lecturerId: z.string().min(1),
    roomId: z.string().min(1),
  })
  .refine(
    (data) => {
      return data.startTime < data.endTime;
    },
    {
      message: "Waktu selesai harus lebih besar",
      path: ["endTime"],
    },
  );

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

type EditScheduleModalProps = {
  schedule: ScheduleWithDetails;
  courses: Course[];
  lecturers: Lecturer[];
  rooms: Room[];
  onClose: () => void;
};

export default function EditScheduleModal({ schedule, courses, lecturers, rooms, onClose }: EditScheduleModalProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: schedule.dayOfWeek as "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT" | "SABTU",
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      courseId: schedule.courseId,
      lecturerId: schedule.lecturerId,
      roomId: schedule.roomId,
    },
  });

  const onSubmit = async (data: ScheduleFormValues) => {
    setApiError("");
    try {
      const res = await fetch("/api/schedules/" + schedule.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok === false) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengupdate jadwal");
      }

      router.refresh();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Terjadi kesalahan sistem");
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open === false) {
      onClose();
    }
  };

  // Pastikan bagian return ini tidak terputus oleh baris kosong yang salah
  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Jadwal Kuliah</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          {apiError !== "" ? <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{apiError}</div> : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Matakuliah</label>
                <select {...register("courseId")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white">
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.courseId ? <p className="text-red-500 text-xs mt-1">{errors.courseId.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dosen Pengampu</label>
                <select {...register("lecturerId")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white">
                  {lecturers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                {errors.lecturerId ? <p className="text-red-500 text-xs mt-1">{errors.lecturerId.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ruangan</label>
                <select {...register("roomId")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white">
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Kap: {r.capacity})
                    </option>
                  ))}
                </select>
                {errors.roomId ? <p className="text-red-500 text-xs mt-1">{errors.roomId.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hari</label>
                <select {...register("dayOfWeek")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white">
                  {["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.dayOfWeek ? <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
                <input type="time" {...register("startTime")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                {errors.startTime ? <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
                <input type="time" {...register("endTime")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                {errors.endTime ? <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p> : null}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200">
                Batal
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {isSubmitting === true ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

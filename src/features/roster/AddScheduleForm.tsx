"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import type { Course, Lecturer, Room } from "../../../generated/prisma/client";

// Skema Validasi Zod - Ditulis secara inline (Eksplisit) agar TS Parser tidak bingung
const scheduleSchema = z
  .object({
    dayOfWeek: z.enum(["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"], {
      errorMap: () => ({ message: "Pilih hari perkuliahan" }),
    }),
    startTime: z.string().min(4, "Pilih waktu mulai"),
    endTime: z.string().min(4, "Pilih waktu selesai"),
    courseId: z.string().min(1, "Pilih matakuliah"),
    lecturerId: z.string().min(1, "Pilih dosen"),
    roomId: z.string().min(1, "Pilih ruangan"),
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

interface AddScheduleFormProps {
  courses: Course[];
  lecturers: Lecturer[];
  rooms: Room[];
}

export default function AddScheduleForm({ courses, lecturers, rooms }: AddScheduleFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
  });

  const onSubmit = async (data: ScheduleFormValues) => {
    setApiError("");
    setIsSuccess(false);

    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok === false) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan jadwal");
      }

      setIsSuccess(true);
      reset();
      router.refresh();

      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Terjadi kesalahan sistem");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-sm font-semibold text-slate-800">{isOpen === true ? "Tutup Form Penjadwalan" : "+ Buat Jadwal Baru"}</h3>
      </div>

      {isOpen === true ? (
        <div className="p-6">
          {apiError !== "" ? <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{apiError}</div> : null}

          {isSuccess === true ? <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-md text-sm border border-emerald-100">Jadwal berhasil ditambahkan!</div> : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Matakuliah</label>
                <select {...register("courseId")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                  <option value="">-- Pilih Matakuliah --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
                {errors.courseId ? <p className="text-red-500 text-xs mt-1">{errors.courseId.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dosen Pengampu</label>
                <select {...register("lecturerId")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                  <option value="">-- Pilih Dosen --</option>
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
                <select {...register("roomId")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                  <option value="">-- Pilih Ruangan --</option>
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
                <select {...register("dayOfWeek")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                  <option value="">-- Pilih Hari --</option>
                  <option value="SENIN">SENIN</option>
                  <option value="SELASA">SELASA</option>
                  <option value="RABU">RABU</option>
                  <option value="KAMIS">KAMIS</option>
                  <option value="JUMAT">JUMAT</option>
                  <option value="SABTU">SABTU</option>
                </select>
                {errors.dayOfWeek ? <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
                <input type="time" {...register("startTime")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500" />
                {errors.startTime ? <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
                <input type="time" {...register("endTime")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500" />
                {errors.endTime ? <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p> : null}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
                {isSubmitting === true ? "Menyimpan..." : "Simpan Jadwal"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

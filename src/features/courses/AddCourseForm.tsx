"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Skema Validasi Zod
const courseSchema = z.object({
  code: z.string().min(2, "Kode MK minimal 2 karakter (misal: IF)"),
  name: z.string().min(3, "Nama MK minimal 3 karakter"),
  credits: z.coerce.number().min(1, "Minimal 1 SKS").max(6, "Maksimal 6 SKS"),
  semester: z.coerce.number().min(1, "Minimal semester 1").max(8, "Maksimal semester 8"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function AddCourseForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseFormValues) => {
    setApiError("");
    setIsSuccess(false);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan matakuliah");
      }

      setIsSuccess(true);
      reset();
      router.refresh();

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      // Pengecekan error yang aman untuk parser TypeScript (tanpa tipe 'any')
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Tambah Matakuliah Baru</h3>

      {/* Menggunakan Ternary (? : null) alih-alih && agar parser tidak bingung */}
      {apiError !== "" ? <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{apiError}</div> : null}

      {isSuccess === true ? <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-md text-sm border border-emerald-100">Matakuliah berhasil ditambahkan!</div> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kode MK</label>
            <input {...register("code")} placeholder="Contoh: IF101" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.code ? <p className="text-red-500 text-xs mt-1">{errors.code.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Matakuliah</label>
            <input {...register("name")} placeholder="Contoh: Algoritma & Pemrograman" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.name ? <p className="text-red-500 text-xs mt-1">{errors.name.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah SKS</label>
            <input type="number" {...register("credits")} placeholder="3" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.credits ? <p className="text-red-500 text-xs mt-1">{errors.credits.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
            <input type="number" {...register("semester")} placeholder="1" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.semester ? <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p> : null}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Matakuliah"}
          </button>
        </div>
      </form>
    </div>
  );
}

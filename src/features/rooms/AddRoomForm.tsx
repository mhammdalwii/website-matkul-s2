"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Skema Validasi Zod untuk Ruangan
const roomSchema = z.object({
  name: z.string().min(2, "Nama ruangan minimal 2 karakter"),
  capacity: z.coerce.number().min(1, "Kapasitas minimal 1 orang"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export default function AddRoomForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
  });

  const onSubmit = async (data: RoomFormValues) => {
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan data ruangan");
      }

      toast.success("Ruangan berhasil ditambahkan!");
      reset();
      router.refresh();

      setTimeout(() => {}, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Tambah Data Ruangan</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ruangan</label>
            <input {...register("name")} placeholder="Contoh: Lab Komputer 1" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.name ? <p className="text-red-500 text-xs mt-1">{errors.name.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kapasitas (Orang)</label>
            <input type="number" {...register("capacity")} placeholder="Contoh: 40" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.capacity ? <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p> : null}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Ruangan"}
          </button>
        </div>
      </form>
    </div>
  );
}

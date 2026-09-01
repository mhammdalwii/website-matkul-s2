"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type RoomData = {
  id: string;
  name: string;
  capacity: number;
};

const roomSchema = z.object({
  name: z.string().min(2, "Nama ruangan minimal 2 karakter"),
  capacity: z.coerce.number().min(5, "Kapasitas minimal 5 orang"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export default function EditRoomModal({ room }: { room: RoomData }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: { name: room.name, capacity: room.capacity },
  });

  const onSubmit = async (data: RoomFormValues) => {
    setApiError("");
    try {
      const res = await fetch("/api/rooms/" + room.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok === false) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengupdate data");
      }
      router.refresh();
      setIsOpen(false);
      toast.success("Ruangan berhasil diperbarui!");
    } catch (err: unknown) {
      if (err instanceof Error) setApiError(err.message);
      else setApiError("Terjadi kesalahan sistem");
    }
  };

  return (
    <div className="inline-block">
      <button type="button" onClick={() => setIsOpen(true)} className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors">
        Edit
      </button>

      {isOpen === true ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 text-left">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Edit Ruangan</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700">
                Tutup
              </button>
            </div>
            <div className="p-6">
              {apiError !== "" ? <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{apiError}</div> : null}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ruangan</label>
                  <input {...register("name")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.name ? <p className="text-red-500 text-xs mt-1">{errors.name.message}</p> : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kapasitas (Orang)</label>
                  <input type="number" {...register("capacity")} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500" />
                  {errors.capacity ? <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p> : null}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200">
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                    {isSubmitting === true ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

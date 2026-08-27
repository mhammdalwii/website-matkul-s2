"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  id: string;
  endpoint: string;
};

export default function DeleteButton({ id, endpoint }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (isConfirmed === false) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (res.ok === false) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus data");
      }

      // Refresh halaman agar data hilang dari tabel
      router.refresh();
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

  return <button type="button">{isDeleting ? "Hapus..." : "Hapus"}</button>;
}

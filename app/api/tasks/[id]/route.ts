import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// Fungsi Update Status (Selesai/Belum)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();

    const updatedTask = await prisma.task.update({
      where: { id: resolvedParams.id },
      data: { isCompleted: body.isCompleted },
    });

    return NextResponse.json(updatedTask, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal mengubah status tugas" }, { status: 500 });
  }
}

// Fungsi Hapus Tugas
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    await prisma.task.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ message: "Tugas dihapus" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghapus tugas" }, { status: 500 });
  }
}

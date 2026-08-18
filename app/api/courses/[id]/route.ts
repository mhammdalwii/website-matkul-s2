import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH: Memperbarui data matakuliah berdasarkan ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { code, name, credits, semester } = body;

    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(credits && { credits: Number(credits) }),
        ...(semester && { semester: Number(semester) }),
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Gagal memperbarui matakuliah" }, { status: 500 });
  }
}

// DELETE: Menghapus data matakuliah berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Matakuliah berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Gagal menghapus matakuliah" }, { status: 500 });
  }
}

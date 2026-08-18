import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nip, name } = await request.json();
    const updatedLecturer = await prisma.lecturer.update({
      where: { id: params.id },
      data: {
        ...(nip && { nip }),
        ...(name && { name }),
      },
    });
    return NextResponse.json(updatedLecturer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui dosen" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.lecturer.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Dosen berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus dosen" }, { status: 500 });
  }
}

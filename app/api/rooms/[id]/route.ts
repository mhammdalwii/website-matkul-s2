import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, capacity } = await request.json();
    const updatedRoom = await prisma.room.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(capacity && { capacity: Number(capacity) }),
      },
    });
    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui ruangan" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.room.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Ruangan berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus ruangan" }, { status: 500 });
  }
}

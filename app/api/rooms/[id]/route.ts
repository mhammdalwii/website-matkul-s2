import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;

    await prisma.room.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Ruangan berhasil dihapus" }, { status: 200 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Gagal menghapus: Ruangan ini sedang digunakan dalam Jadwal Roster." }, { status: 409 });
      }
    }
    return NextResponse.json({ error: "Gagal menghapus ruangan" }, { status: 500 });
  }
}

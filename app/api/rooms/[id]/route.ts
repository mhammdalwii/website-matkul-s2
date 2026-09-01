import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const text = await request.text();
    if (text === "") return NextResponse.json({ error: "Data kosong!" }, { status: 400 });

    const body = JSON.parse(text);
    const updatedRoom = await prisma.room.update({
      where: { id: resolvedParams.id },
      data: {
        name: body.name,
        capacity: Number(body.capacity),
      },
    });
    return NextResponse.json(updatedRoom, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Nama Ruangan ini sudah ada." }, { status: 409 });
    return NextResponse.json({ error: error.message || "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    await prisma.room.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ message: "Ruangan berhasil dihapus" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Gagal menghapus: Ruangan ini sedang digunakan dalam Jadwal Roster." }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal menghapus ruangan" }, { status: 500 });
  }
}

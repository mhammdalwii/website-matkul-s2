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
    const updatedLecturer = await prisma.lecturer.update({
      where: { id: resolvedParams.id },
      data: {
        nip: body.nip,
        name: body.name,
      },
    });
    return NextResponse.json(updatedLecturer, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "NIP/NIDN ini sudah dipakai." }, { status: 409 });
    return NextResponse.json({ error: error.message || "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    await prisma.lecturer.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ message: "Dosen berhasil dihapus" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Gagal menghapus: Dosen ini sedang digunakan dalam Jadwal Roster." }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal menghapus dosen" }, { status: 500 });
  }
}

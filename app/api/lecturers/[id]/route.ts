import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;

    await prisma.lecturer.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Dosen berhasil dihapus" }, { status: 200 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Gagal menghapus: Dosen ini sedang digunakan dalam Jadwal Roster." }, { status: 409 });
      }
    }
    return NextResponse.json({ error: "Gagal menghapus dosen" }, { status: 500 });
  }
}

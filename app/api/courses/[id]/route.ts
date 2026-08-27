import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PATCH: Memperbarui data matakuliah berdasarkan ID
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;

    const text = await request.text();
    if (text === "") {
      return NextResponse.json({ error: "Data kosong!" }, { status: 400 });
    }

    const body = JSON.parse(text);
    const { code, name, credits, semester } = body;

    const updatedCourse = await prisma.course.update({
      where: { id: resolvedParams.id },
      data: {
        code: code,
        name: name,
        credits: Number(credits),
        semester: Number(semester),
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("ERROR PRISMA:", error);

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Kode Matakuliah ini sudah dipakai. Silakan gunakan kode lain." }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || "Terjadi kesalahan server" }, { status: 500 });
  }
}

// DELETE: Menghapus data matakuliah berdasarkan ID
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;

    await prisma.course.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Matakuliah berhasil dihapus" }, { status: 200 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Gagal menghapus: Matakuliah ini sedang digunakan dalam Jadwal Roster." }, { status: 409 });
      }
    }
    return NextResponse.json({ error: "Gagal menghapus matakuliah" }, { status: 500 });
  }
}

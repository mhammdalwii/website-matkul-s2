import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const lecturers = await prisma.lecturer.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(lecturers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data dosen" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nip, name } = await request.json();

    if (!nip || !name) {
      return NextResponse.json({ error: "NIP dan Nama harus diisi" }, { status: 400 });
    }

    const newLecturer = await prisma.lecturer.create({
      data: { nip, name },
    });

    return NextResponse.json(newLecturer, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "NIP dosen sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal menambahkan dosen" }, { status: 500 });
  }
}

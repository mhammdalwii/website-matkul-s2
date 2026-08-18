import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data ruangan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, capacity } = await request.json();

    if (!name || !capacity) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const newRoom = await prisma.room.create({
      data: { name, capacity: Number(capacity) },
    });

    return NextResponse.json(newRoom, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Nama ruangan sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal membuat ruangan" }, { status: 500 });
  }
}

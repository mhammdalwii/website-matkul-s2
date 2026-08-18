import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Mengambil semua data matakuliah
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Gagal mengambil data matakuliah" }, { status: 500 });
  }
}

// POST: Menambahkan matakuliah baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, credits, semester } = body;

    // Validasi sederhana (nanti bisa di-upgrade pakai Zod di level API)
    if (!code || !name || !credits || !semester) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        code,
        name,
        credits: Number(credits),
        semester: Number(semester),
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating course:", error);
    // Menangani error dari Prisma, misal kode MK duplikat (karena @unique)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Kode matakuliah sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal membuat matakuliah baru" }, { status: 500 });
  }
}

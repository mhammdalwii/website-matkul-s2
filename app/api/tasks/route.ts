import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, deadline, courseId } = body;

    const task = await prisma.task.create({
      data: {
        title: title,
        deadline: new Date(deadline), // Konversi format string dari form menjadi format Date
        courseId: courseId,
      },
    });

    return NextResponse.json(task, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menambahkan tugas" }, { status: 500 });
  }
}

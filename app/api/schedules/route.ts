import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Mengambil semua jadwal beserta relasinya
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        course: true,
        lecturer: true,
        room: true,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ error: "Gagal mengambil data jadwal" }, { status: 500 });
  }
}

// POST: Menambahkan jadwal baru dengan validasi bentrok
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dayOfWeek, startTime, endTime, courseId, lecturerId, roomId } = body;

    //  Validasi Input Dasar
    if (!dayOfWeek || !startTime || !endTime || !courseId || !lecturerId || !roomId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    // Validasi Bentrok: Ruangan
    const roomConflict = await prisma.schedule.findFirst({
      where: {
        roomId: roomId,
        dayOfWeek: dayOfWeek,
        // Cek irisan waktu (overlap)
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });

    if (roomConflict) {
      return NextResponse.json({ error: "Ruangan sudah digunakan pada waktu tersebut" }, { status: 409 });
    }

    //  Validasi Bentrok: Dosen
    const lecturerConflict = await prisma.schedule.findFirst({
      where: {
        lecturerId: lecturerId,
        dayOfWeek: dayOfWeek,
        // Cek irisan waktu (overlap)
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });

    if (lecturerConflict) {
      return NextResponse.json({ error: "Dosen sudah memiliki jadwal mengajar pada waktu tersebut" }, { status: 409 });
    }

    // 4. Jika aman, simpan ke database
    const newSchedule = await prisma.schedule.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        courseId,
        lecturerId,
        roomId,
      },
      // Mengembalikan (return) data lengkap dengan relasinya
      include: {
        course: true,
        lecturer: true,
        room: true,
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json({ error: "Gagal membuat jadwal baru" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mendefinisikan params sebagai Promise sesuai standar Next.js 16+ App Router
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // Await params karena di Next.js terbaru ini adalah proses asinkron
    const resolvedParams = await params;
    const scheduleId = resolvedParams.id;

    const body = await request.json();
    const { dayOfWeek, startTime, endTime, courseId, lecturerId, roomId } = body;

    // Validasi Bentrok
    if (dayOfWeek || startTime || endTime || roomId || lecturerId) {
      const currentSchedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
      });

      if (!currentSchedule) {
        return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
      }

      const checkDayOfWeek = dayOfWeek || currentSchedule.dayOfWeek;
      const checkStartTime = startTime || currentSchedule.startTime;
      const checkEndTime = endTime || currentSchedule.endTime;
      const checkRoomId = roomId || currentSchedule.roomId;
      const checkLecturerId = lecturerId || currentSchedule.lecturerId;

      // Cek bentrok ruangan
      const roomConflict = await prisma.schedule.findFirst({
        where: {
          id: { not: scheduleId },
          roomId: checkRoomId,
          dayOfWeek: checkDayOfWeek,
          AND: [{ startTime: { lt: checkEndTime } }, { endTime: { gt: checkStartTime } }],
        },
      });

      if (roomConflict !== null) return NextResponse.json({ error: "Ruangan bentrok pada waktu yang diubah" }, { status: 409 });

      // Cek bentrok dosen
      const lecturerConflict = await prisma.schedule.findFirst({
        where: {
          id: { not: scheduleId },
          lecturerId: checkLecturerId,
          dayOfWeek: checkDayOfWeek,
          AND: [{ startTime: { lt: checkEndTime } }, { endTime: { gt: checkStartTime } }],
        },
      });

      if (lecturerConflict !== null) return NextResponse.json({ error: "Dosen bentrok pada waktu yang diubah" }, { status: 409 });
    }

    // Parser-friendly spread operation (menggunakan ternary)
    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        ...(dayOfWeek ? { dayOfWeek } : {}),
        ...(startTime ? { startTime } : {}),
        ...(endTime ? { endTime } : {}),
        ...(courseId ? { courseId } : {}),
        ...(lecturerId ? { lecturerId } : {}),
        ...(roomId ? { roomId } : {}),
      },
      include: {
        course: true,
        lecturer: true,
        room: true,
      },
    });

    return NextResponse.json(updatedSchedule, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating schedule:", error.message);
    }
    return NextResponse.json({ error: "Gagal memperbarui jadwal" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const scheduleId = resolvedParams.id;

    await prisma.schedule.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json({ message: "Jadwal berhasil dihapus" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting schedule:", error.message);
    }
    return NextResponse.json({ error: "Gagal menghapus jadwal" }, { status: 500 });
  }
}

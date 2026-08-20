import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { dayOfWeek, startTime, endTime, courseId, lecturerId, roomId } = body;

    // Validasi Bentrok (jika waktu, ruangan, atau dosen diubah)
    // Kita perlu mengecualikan jadwal yang sedang diedit ini agar tidak "bentrok dengan dirinya sendiri"
    if (dayOfWeek || startTime || endTime || roomId || lecturerId) {
      // Ambil jadwal yang akan diedit untuk mendapatkan data terkininya
      const currentSchedule = await prisma.schedule.findUnique({
        where: { id: params.id },
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
          id: { not: params.id }, // Kecualikan jadwal ini
          roomId: checkRoomId,
          dayOfWeek: checkDayOfWeek,
          AND: [{ startTime: { lt: checkEndTime } }, { endTime: { gt: checkStartTime } }],
        },
      });

      if (roomConflict) return NextResponse.json({ error: "Ruangan bentrok pada waktu yang diubah" }, { status: 409 });

      // Cek bentrok dosen
      const lecturerConflict = await prisma.schedule.findFirst({
        where: {
          id: { not: params.id },
          lecturerId: checkLecturerId,
          dayOfWeek: checkDayOfWeek,
          AND: [{ startTime: { lt: checkEndTime } }, { endTime: { gt: checkStartTime } }],
        },
      });

      if (lecturerConflict) return NextResponse.json({ error: "Dosen bentrok pada waktu yang diubah" }, { status: 409 });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id: params.id },
      data: {
        ...(dayOfWeek && { dayOfWeek }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(courseId && { courseId }),
        ...(lecturerId && { lecturerId }),
        ...(roomId && { roomId }),
      },
      include: {
        course: true,
        lecturer: true,
        room: true,
      },
    });

    return NextResponse.json(updatedSchedule, { status: 200 });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: "Gagal memperbarui jadwal" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.schedule.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Jadwal berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json({ error: "Gagal menghapus jadwal" }, { status: 500 });
  }
}

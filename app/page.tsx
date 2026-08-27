import MainLayout from "@/src/layouts/MainLayout";
import ScheduleTable from "@/src/features/roster/ScheduleTable";
import FilterBar from "@/src/features/roster/FilterBar";
import AddScheduleForm from "@/src/features/roster/AddScheduleForm";
import prisma from "@/lib/prisma";
import type { DayOfWeek } from "../generated/prisma/client";

// Menggunakan tipe Promise yang sesuai untuk PageProps di Next.js 16+
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  // Ekstraksi nilai dengan aman
  const paramDay = resolvedParams["day"];
  const paramSearch = resolvedParams["search"];

  // Pastikan nilainya string, bukan array string
  const dayFilter = typeof paramDay === "string" ? paramDay : undefined;
  const searchFilter = typeof paramSearch === "string" ? paramSearch : undefined;

  // Query dinamis berdasarkan filter DAN ambil data master untuk form secara bersamaan (Promise.all)
  const [schedules, courses, lecturers, rooms] = await Promise.all([
    prisma.schedule.findMany({
      where: {
        ...(dayFilter ? { dayOfWeek: dayFilter as DayOfWeek } : {}),
        ...(searchFilter
          ? {
              OR: [{ course: { name: { contains: searchFilter, mode: "insensitive" } } }, { lecturer: { name: { contains: searchFilter, mode: "insensitive" } } }],
            }
          : {}),
      },
      include: {
        course: true,
        lecturer: true,
        room: true,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    prisma.course.findMany({ orderBy: { name: "asc" } }),
    prisma.lecturer.findMany({ orderBy: { name: "asc" } }),
    prisma.room.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Roster Matakuliah</h2>
        <p className="text-slate-500 mt-1">Daftar jadwal perkuliahan yang sedang berjalan.</p>
      </div>

      {/* Form Tambah Jadwal disisipkan di sini dengan mengirimkan data master */}
      <AddScheduleForm courses={courses} lecturers={lecturers} rooms={rooms} />

      <FilterBar />

      <ScheduleTable schedules={schedules} courses={courses} lecturers={lecturers} rooms={rooms} />
    </MainLayout>
  );
}

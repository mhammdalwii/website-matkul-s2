import MainLayout from "@/src/layouts/MainLayout";
import { AddTaskForm, TaskTable } from "@/src/features/lecturers/tasks/TaskComponents";
import prisma from "@/lib/prisma";

export default async function TasksPage() {
  // Ambil data matakuliah untuk pilihan di form
  const courses = await prisma.course.findMany({
    orderBy: { name: "asc" },
  });

  // Ambil data tugas dan urutkan dari deadline yang paling dekat
  const tasks = await prisma.task.findMany({
    include: { course: true },
    orderBy: { deadline: "asc" },
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manajemen Tugas</h2>
        <p className="text-slate-500 mt-1">Pantau deadline tugas kuliah agar tidak ada yang terlewat.</p>
      </div>

      <AddTaskForm courses={courses} />

      <TaskTable tasks={tasks} />
    </MainLayout>
  );
}

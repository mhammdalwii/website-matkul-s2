import MainLayout from "@/src/layouts/MainLayout";
import AddCourseForm from "@/src/features/courses/AddCourseForm";
import prisma from "@/lib/prisma";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manajemen Matakuliah</h2>
        <p className="text-slate-500 mt-1">Kelola data master matakuliah untuk keperluan penjadwalan.</p>
      </div>

      <AddCourseForm />

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Kode</th>
              <th className="px-6 py-4">Mata Kuliah</th>
              <th className="px-6 py-4 whitespace-nowrap">SKS</th>
              <th className="px-6 py-4 whitespace-nowrap">Semester</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  Belum ada data matakuliah yang ditambahkan.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{course.code}</td>
                  <td className="px-6 py-4 text-slate-700">{course.name}</td>
                  <td className="px-6 py-4 text-slate-700">{course.credits}</td>
                  <td className="px-6 py-4 text-slate-700">{course.semester}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

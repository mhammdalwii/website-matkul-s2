import MainLayout from "@/src/layouts/MainLayout";
import AddLecturerForm from "@/src/features/lecturers/AddLecturerForm";
import prisma from "@/lib/prisma";

export default async function LecturersPage() {
  const lecturers = await prisma.lecturer.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manajemen Dosen</h2>
        <p className="text-slate-500 mt-1">Kelola data dosen pengampu untuk pemetaan jadwal.</p>
      </div>

      <AddLecturerForm />

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap w-1/3">NIP / NIDN</th>
              <th className="px-6 py-4">Nama Lengkap & Gelar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lecturers.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                  Belum ada data dosen yang ditambahkan.
                </td>
              </tr>
            ) : (
              lecturers.map((lecturer) => (
                <tr key={lecturer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{lecturer.nip}</td>
                  <td className="px-6 py-4 text-slate-700">{lecturer.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

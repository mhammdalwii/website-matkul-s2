import MainLayout from "@/src/layouts/MainLayout";
import AddRoomForm from "@/src/features/rooms/AddRoomForm";
import prisma from "@/lib/prisma";

export default async function RoomsPage() {
  // Ambil data ruangan dari database
  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" }, // Urutkan berdasarkan nama
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Manajemen Ruangan</h2>
        <p className="text-slate-500 mt-1">Kelola data ruangan kelas dan laboratorium.</p>
      </div>

      <AddRoomForm />

      {/* Tabel Daftar Ruangan */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap w-2/3">Nama Ruangan</th>
              <th className="px-6 py-4 whitespace-nowrap">Kapasitas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                  Belum ada data ruangan yang ditambahkan.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{room.name}</td>
                  <td className="px-6 py-4 text-slate-700">{room.capacity} Orang</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

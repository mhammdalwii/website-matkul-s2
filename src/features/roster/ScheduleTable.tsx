import { ScheduleWithDetails } from "@/src/types";

interface ScheduleTableProps {
  schedules: ScheduleWithDetails[];
}

export default function ScheduleTable({ schedules }: ScheduleTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">Hari</th>
            <th className="px-6 py-4 whitespace-nowrap">Waktu</th>
            <th className="px-6 py-4">Matakuliah</th>
            <th className="px-6 py-4 whitespace-nowrap">Dosen Pengampu</th>
            <th className="px-6 py-4 whitespace-nowrap">Ruangan</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                Belum ada jadwal perkuliahan yang tersedia.
              </td>
            </tr>
          ) : (
            schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{schedule.dayOfWeek}</td>
                <td className="px-6 py-4 text-slate-600">
                  {schedule.startTime} - {schedule.endTime}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{schedule.course.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {schedule.course.code} • {schedule.course.credits} SKS
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700">{schedule.lecturer.name}</td>
                <td className="px-6 py-4 text-slate-700">{schedule.room.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

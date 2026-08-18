import type { Course, Lecturer, Room, Schedule, User } from "../../generated/prisma/client";

// Anda bisa mengekspor tipe-tipe ini untuk digunakan di komponen UI
export type { Course, Lecturer, Room, Schedule, User };

// Contoh membuat tipe gabungan (misal untuk jadwal beserta relasinya)
export type ScheduleWithDetails = Schedule & {
  course: Course;
  lecturer: Lecturer;
  room: Room;
};

import type { Course, Lecturer, Room, Schedule, User } from "../../generated/prisma/client";

export type { Course, Lecturer, Room, Schedule, User };

export type ScheduleWithDetails = Schedule & {
  course: Course;
  lecturer: Lecturer;
  room: Room;
};

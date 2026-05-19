import type { StudentProfile } from "@/hooks/use-student-profile";

export const COMPLETION_ITEMS: {
  label: string;
  done: (p: StudentProfile) => boolean;
}[] = [
  { label: "Profile photo", done: (p) => Boolean(p.avatar_url) },
  {
    label: "Write a bio",
    done: (p) => Boolean(p.bio && p.bio.trim().length > 10),
  },
  { label: "Phone number", done: (p) => Boolean(p.phone) },
  { label: "3+ hobbies", done: (p) => (p.hobbies?.length ?? 0) >= 3 },
];

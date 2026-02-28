import { ELECTION_DATE } from "./data";

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function getCountdown(): CountdownValues {
  const now = new Date().getTime();
  const target = ELECTION_DATE.getTime();
  const total = Math.max(target - now, 0);

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total };
}

import { BIRTHDAYS_DATA, type BirthdayPerson } from "./birthdays";

export interface UpcomingBirthday {
  name: string;
  daysUntil: number;
}

/**
 * Return array of students whose birthday is today (match month & day only).
 */
export function getTodaysBirthdays(): string[] {
  const now = new Date();
  const todayMonth = now.getMonth() + 1; // 1-12
  const todayDay = now.getDate();

  return BIRTHDAYS_DATA.filter((person) => {
    const [, month, day] = person.birthDate.split("-").map(Number);
    return month === todayMonth && day === todayDay;
  }).map((person) => person.name);
}

/**
 * Calculate days until the next birthday for a given person based on today's date.
 * Handles year-crossing (e.g., today is December, next birthday is in January).
 */
function daysUntilNextBirthday(person: BirthdayPerson): number {
  const now = new Date();
  const currentYear = now.getFullYear();

  const [, birthMonth, birthDay] = person.birthDate.split("-").map(Number);

  // This year's birthday
  const thisYearBirthday = new Date(currentYear, birthMonth - 1, birthDay);

  // Calculate difference in days from today
  const diffMs = thisYearBirthday.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 0) {
    // Birthday hasn't passed yet this year
    return diffDays;
  }

  // Birthday has passed; use next year's birthday
  const nextYearBirthday = new Date(currentYear + 1, birthMonth - 1, birthDay);
  const nextDiffMs = nextYearBirthday.getTime() - now.getTime();
  return Math.ceil(nextDiffMs / (1000 * 60 * 60 * 24));
}

/**
 * Return up to `max` students with the closest upcoming birthdays.
 */
export function getUpcomingBirthdays(max: number = 3): UpcomingBirthday[] {
  const todayNames = getTodaysBirthdays();

  const mapped = BIRTHDAYS_DATA
    .filter((person) => !todayNames.includes(person.name)) // exclude today's birthdays
    .map((person) => ({
      name: person.name,
      daysUntil: daysUntilNextBirthday(person),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil); // closest first

  return mapped.slice(0, max);
}
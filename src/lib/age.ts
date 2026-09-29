const BIRTHDAY = { year: 2005, month: 5, day: 30 };

export function getAge(now = new Date()): number {
  const hadBirthday =
    now.getMonth() + 1 > BIRTHDAY.month || (now.getMonth() + 1 === BIRTHDAY.month && now.getDate() >= BIRTHDAY.day);
  return now.getFullYear() - BIRTHDAY.year - (hadBirthday ? 0 : 1);
}

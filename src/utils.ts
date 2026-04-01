function getUkrainianPlural(
  number: number,
  singular: string,
  genitiveSingular: string,
  genitivePlural: string
): string {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return genitivePlural;
  }
  if (lastDigit === 1) {
    return singular;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return genitiveSingular;
  }
  return genitivePlural;
}

export function minutesToStr(minutes: number): string {
  if (!minutes || minutes <= 0) {
    return '0 хвилин';
  }

  let temp = Math.floor(minutes);
  const parts: string[] = [];

  // (525600 minutes per year)
  const years = Math.floor(temp / 525600);
  if (years) {
    parts.push(years + ' ' + getUkrainianPlural(years, 'рік', 'року', 'років'));
    temp %= 525600;
  }

  // (1440 minutes per day)
  const days = Math.floor(temp / 1440);
  if (days) {
    parts.push(days + ' ' + getUkrainianPlural(days, 'день', 'дні', 'днів'));
    temp %= 1440;
  }

  // (60 minutes per hour)
  const hours = Math.floor(temp / 60);
  if (hours) {
    parts.push(
      hours + ' ' + getUkrainianPlural(hours, 'година', 'години', 'годин')
    );
    temp %= 60;
  }

  if (temp > 0) {
    parts.push(
      temp + ' ' + getUkrainianPlural(temp, 'хвилина', 'хвилини', 'хвилин')
    );
  }

  if (parts.length === 0) {
    return '0 хвилин';
  }

  return parts.slice(0, 2).join(' ');
}

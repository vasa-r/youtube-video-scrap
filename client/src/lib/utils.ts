import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (sen: string, length = 50) => {
  return `${sen.slice(0, length)}...`;
};

export const formatUTC = (date: string) => {
  const utcDate = new Date(date);

  const adjustedDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );

  return formatDistanceToNow(adjustedDate, { addSuffix: true });
};

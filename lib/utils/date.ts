import { formatDistanceToNow as formatDistance } from "date-fns";

export function formatRelativeTime(date: string | Date) {
  return formatDistance(new Date(date), { addSuffix: true });
}
export const truncateByLetters = (text: string | any[], limit: number) =>
  text.length > limit ? `${text.slice(0, limit)}...` : text;

export const truncateByWords = (text: string, limit: number) =>
  text.split(" ").length > limit
    ? `${text.split(" ").slice(0, limit).join(" ")}...`
    : text;

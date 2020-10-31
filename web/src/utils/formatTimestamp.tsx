export const formatTimestamp = (timestampString: string) => {
  const date = new Date(parseInt(timestampString));
  const now = new Date();

  if (
    date.getDate() !== now.getDate() ||
    date.getMonth() !== now.getMonth() ||
    date.getFullYear() !== now.getFullYear()
  ) {
    return `on ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  }

  const secondDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minuteDiff = Math.floor(secondDiff / 60);
  const hourDiff = Math.floor(minuteDiff / 60);

  return (
    (hourDiff ? `${hourDiff}hr ` : "") +
    (minuteDiff ? `${minuteDiff % 60}min ` : "") +
    (!hourDiff ? `${secondDiff % 60}sec` : "") +
    " ago"
  );
};

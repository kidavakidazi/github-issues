const getIssueOpenedStatus = (date: Date) => {
  const today = new Date();
  const opened = new Date(date);
  const diff = today.getTime() - opened.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 7) {
    return `opened ${days} days ago`;
  } else if (days >= 7 && days <= 13) {
    return "opened last week";
  } else if (days >= 14 && days <= 31) {
    const weeks = Math.floor(days / 7);
    return `opened ${weeks} weeks ago`;
  } else {
    return `opened on ${opened.toDateString()}`;
  }
};

export default getIssueOpenedStatus;
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return dateString;
  
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  
  return `${month} ${year}`;
};

export const formatPageNumber = (current: number, total: number): string => {
  return `Page ${current} of ${total}`;
};

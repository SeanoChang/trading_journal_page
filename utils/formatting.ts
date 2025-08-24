export const marketCapToStr = (marketCap: number): string => {
  if (marketCap < 1000000) {
    return (marketCap / 1000).toFixed(2) + "K";
  } else if (marketCap < 1000000000) {
    return (marketCap / 1000000).toFixed(2) + "M";
  } else {
    return (marketCap / 1000000000).toFixed(2) + "B";
  }
};

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  
  if (diff < minute) return 'just now';
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
};
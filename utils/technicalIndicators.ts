export const calcRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50; // Default neutral value
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial average gains and losses
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses -= change; // Make losses positive
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100; // Prevent division by zero
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return Math.round(rsi * 100) / 100; // Round to 2 decimal places
};

export const calculateMovingAverage = (data: number[], period: number): number[] => {
  if (data.length < period) return [];
  
  const result: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    result.push(sum / period);
  }
  
  return result;
};
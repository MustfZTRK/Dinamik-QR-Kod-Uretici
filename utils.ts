
export const calculateDynamicPrice = (
  basePrice: number,
  rate: number,
  startTime: string,
  endTime: string
): number => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  let isActive = false;
  if (startMinutes <= endMinutes) {
    isActive = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overlays midnight (e.g., 22:00 to 02:00)
    isActive = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  if (isActive) {
    return basePrice * (1 + rate / 100);
  }
  return basePrice;
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

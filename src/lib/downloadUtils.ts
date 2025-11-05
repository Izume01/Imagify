export const downloadImage = async (imageUrl: string, filename?: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `imagify-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadAllImages = async (imageUrls: string[], baseFilename?: string) => {
  const promises = imageUrls.map((url, index) => 
    downloadImage(url, baseFilename ? `${baseFilename}-${index + 1}.png` : undefined)
  );
  await Promise.all(promises);
};

export const generateFilenameFromPrompt = (prompt: string, index?: number): string => {
  const cleanPrompt = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 30);
  const suffix = index !== undefined ? `-${index + 1}` : '';
  return `${cleanPrompt}-${Date.now()}${suffix}.png`;
};
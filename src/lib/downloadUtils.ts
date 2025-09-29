// Download utilities for generated images
export const downloadImage = async (imageUrl: string, filename?: string, format: 'png' | 'jpg' = 'png') => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename if not provided
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '');
    const defaultFilename = `imagify-${timestamp}.${format}`;
    link.download = filename || defaultFilename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

export const downloadAllImages = async (imageUrls: string[], baseFilename?: string) => {
  const promises = imageUrls.map((url, index) => {
    const filename = baseFilename 
      ? `${baseFilename}-${index + 1}.png`
      : `imagify-${Date.now()}-${index + 1}.png`;
    return downloadImage(url, filename);
  });
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Error downloading images:', error);
    throw error;
  }
};

export const generateFilenameFromPrompt = (prompt: string, index?: number): string => {
  // Clean the prompt to create a safe filename
  const cleanPrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .slice(0, 30); // Limit length
  
  const timestamp = Date.now();
  const suffix = index !== undefined ? `-${index + 1}` : '';
  
  return `${cleanPrompt}-${timestamp}${suffix}.png`;
};
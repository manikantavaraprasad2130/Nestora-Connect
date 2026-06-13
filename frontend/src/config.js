export const API_BASE = import.meta.env.MODE === 'production'
  ? 'https://nestora-connect-1.onrender.com'
  : '';

export const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  const path = img.startsWith("/") ? img : `/uploads/${img}`;
  return `${API_BASE}${path}`;
};

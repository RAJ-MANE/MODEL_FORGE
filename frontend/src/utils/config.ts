export const getBaseUrl = (url: string | undefined): string => {
  if (!url) return 'http://localhost:8001';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const AI_SERVICE_URL = getBaseUrl(process.env.REACT_APP_AI_SERVICE_URL);

// src/utils/moderateImage.js

const SIGHTENGINE_API_USER = `${import.meta.env.VITE_SIGHTENGINE_API_USER}`;     // 🔐 Replace with your actual credentials
const SIGHTENGINE_API_SECRET = `${import.meta.env.VITE_SIGHTENGINE_API_SECRET}`; // 🔐 NEVER expose these in production frontend!

export const moderateImage = async (file) => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('models', 'nudity,wad,offensive,text-content');
  formData.append('api_user', SIGHTENGINE_API_USER);
  formData.append('api_secret', SIGHTENGINE_API_SECRET);

  try {
    const response = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    const nudity = result.nudity || {};
    const offensive = result.offensive || {};

    const isSafe =
      (nudity.safe || 0) > 0.85 &&
      (result.alcohol || 0) < 0.3 &&
      (result.drugs || 0) < 0.3 &&
      (offensive.prob || 0) < 0.3;

    return { passed: isSafe, result };
  } catch (error) {
    console.error('Sightengine moderation failed:', error);
    return { passed: false, error };
  }
};

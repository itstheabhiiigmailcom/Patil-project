import axios from 'axios'
export async function sendAdView(adId) {
  if (!adId) return;

  console.log(`📺 Sending view for Ad ID: ${adId}`);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/ads/view`,
      { adId },
      { withCredentials: true }
    );

    console.log(`✅ View counted for Ad ID: ${adId}`, res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Failed to send ad view:', error);
    throw error;
  }
}

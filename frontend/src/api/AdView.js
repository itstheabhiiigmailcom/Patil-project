import axios from 'axios';

export async function sendAdView(adId,userId) {
if (!adId) return;
console.log(`📺 Sending view for Ad ID: ${adId} by User ID: ${userId}`);
try {
await axios.post(
`${import.meta.env.VITE_API_URL}/ads/view`,
{ adId,
    userId
 },
{ withCredentials: true }
);
console.log(`✅ View counted for Ad ID: ${adId}`);
console.log(`📺 Sending view for Ad ID: ${adId} by User ID: ${userId}`);

} catch (error) {
console.error('❌ Failed to send ad view:', error);
}
}
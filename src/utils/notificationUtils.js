export const sendNotification = async (recipientFcmToken, message) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: recipientFcmToken,
        title: 'New Message from firechat',
        message: message
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

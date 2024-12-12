import { getToken,deleteToken  } from 'firebase/messaging';
import { messaging } from '../config/firebase';
import { doc, updateDoc ,getDoc} from 'firebase/firestore';
import { db } from '../config/firebase';
export const registerForPushNotifications = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission) {
      // Clear any existing token
      await deleteToken(messaging);
      
      // Get fresh token
      const token = await getToken(messaging, {
        vapidKey: 'BLQvf5v3ztGJFrII0AlYinmQsbQjWv51A54GzsN77tMLsyV2N6mG4cRIKdI_ouVArdpAVZYmOXppMSvcB3nCRkc'
      });
      console.log("token",token)
      
      if (token) {
        // Update token in database
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          fcmToken: token,
          tokenUpdatedAt: new Date().toISOString()
        });
        
        // Verify token is stored
        const verifyDoc = await getDoc(userRef);
        console.log('Stored token:', verifyDoc.data().fcmToken);
        
        return token;
      }
    }
  } catch (error) {
    console.log('Token registration error:', error);
    throw error;
  }
};

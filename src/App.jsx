import { useState,useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { signInWithPopup } from 'firebase/auth'
import {auth,provider } from './config/firebase'
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection,query, where, getDocs, setDoc,doc} from 'firebase/firestore';
import { Link,useNavigate } from "react-router-dom";
import { Home } from './components/Home';
import {db} from './config/firebase'
import UserContext from './components/context/context';

function App() {
  const { user, setuser } = useContext(UserContext);
  const date = new Date();
  const messageref=collection(db,"users")
  const navigate = useNavigate();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  const signin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName.toUpperCase(),
        photoURL: result.user.photoURL,
        lastactive: Timestamp.fromDate(date),
        date
      };
      setuser(userData);
      
     
      console.log(userData); // Set the correct user object
      
      navigate('/Home');
      const userQuery = query(messageref, where("uid", "==", result.user.uid));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        const userDocRef = doc(db, 'users', userData.uid);
        await setDoc(userDocRef, userData);
        console.log("New user document written with UID:", result.user.uid);
      } else {
        console.log("User already exists with UID:", result.user.uid);
      }

    
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };
  return (
    <div>
      {user? (
        <>
          <div>Hello please login to your google account</div>
          <div className='p-5 text-center'>
            <div>
              {/* <img 
                src="https://cdn.pixabay.com/photo/2023/08/21/03/34/droplets-8203505_1280.jpg" 
                alt="logo" 
                width={400} 
                height={400} 
                className='pr-2' 
                style={{borderRadius: 200}}
              /> */}
            </div>
            <div className='btn btn-primary' style={{marginTop: "50px"}} onClick={signin}>
              Login
            </div>
          </div>
        </>
      ) :  <>
      <div>Hello is this your first time here sign up</div>
      <div className='p-5 text-center'>
        <div>
          {/* <img 
            src="https://cdn.pixabay.com/photo/2023/08/21/03/34/droplets-8203505_1280.jpg" 
            alt="logo" 
            width={400} 
            height={400} 
            className='pr-2' 
            style={{borderRadius: 200}}
          /> */}
        </div>
        <div className='btn btn-primary' style={{marginTop: "50px"}} onClick={signin}>
          Login
        </div>
      </div>
    </>}
    </div>
  );
}


export default App

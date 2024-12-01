import React from 'react'
import { useState,useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { signInWithPopup } from 'firebase/auth'
//import { openVideo } from '../../scripts/index.js';
import NumberTicker from '../ui/number-ticker'
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection,query, where, getDocs, setDoc,doc} from 'firebase/firestore';
import { Link,useNavigate } from "react-router-dom";
import { db,auth,provider } from '../../config/firebase'
import UserContext from '../context/context';
import ChatContext from '../context/ChatContext';
import '../../../src/tailwind-build.css';
import '../../../src/index.css';

// import './../../../index.js'
import { Helmet } from 'react-helmet';
import { Button } from 'antd';
import ScrollToTop from './Scroll-to-top'



export const Hero = () => {
    const { user, setuser } = useContext(UserContext);
  const {homereload,sethomereload}=useContext(ChatContext);
 

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
      localStorage.setItem("isloggedin", "true");
      localStorage.removeItem('cachedPosts');
  // Reset counter to 0 instead of incrementing
  sethomereload(0);
      console.log(userData); // Set the correct user object
      // await registerForPushNotifications(userData.uid);
     
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

useEffect(() => {
    const loadExternalScripts = async () => {
      // Load GSAP
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
  
      // Load Typed.js
     
  
      // Import your custom scripts
      await import('../../scripts/components.js');
      await import('../../scripts/index.js');
  
   
    };
  
    loadExternalScripts();
  }, []);
  
  
  
const videoBg = document.querySelector("#video-container-bg")
const videoContainer = document.querySelector("#video-container")
const iframe=document.getElementById("iframe");


 function openVideo(){
    videoBg.classList.remove("tw-scale-0", "tw-opacity-0")
    iframe.src = "https://www.youtube.com/embed/Occ9OlnVq8g?si=llcTrXPRM-MRXDZB&amp;controls=1&rel=0&showinfo=0&autoplay=1&loop=1&mute=0&vq=hd1080";
    videoBg.classList.add("tw-scale-100", "tw-opacity-100")
    videoContainer.classList.remove("tw-scale-0")
    videoContainer.classList.add("tw-scale-100")
   
    document.body.classList.add("modal-open")
}
function closeVideo() {
    // Stop video playback by targeting the iframe
    //const videoIframe = document.querySelector('#video-container iframe');
     iframe.src="";

    videoContainer.classList.add("tw-scale-0");
    videoContainer.classList.remove("tw-scale-100");

    setTimeout(() => {
        videoBg.classList.remove("tw-scale-100", "tw-opacity-100");
        videoBg.classList.add("tw-scale-0", "tw-opacity-0");
    }, 400);

    document.body.classList.remove("modal-open");
}

const RESPONSIVE_WIDTH = 1024;
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(window.innerWidth < RESPONSIVE_WIDTH);

  const toggleHeader = () => {
    const collapseBtn = document.getElementById("collapse-btn");
    const collapseHeaderItems = document.getElementById("collapsed-header-items");
    
    if (!collapseHeaderItems || !collapseBtn) return;

    if (isHeaderCollapsed) {
      collapseHeaderItems.classList.add("max-lg:!tw-opacity-100", "tw-min-h-[90vh]");
      collapseHeaderItems.style.height = "90vh";
      collapseBtn.classList.remove("bi-list");
      collapseBtn.classList.add("bi-x", "max-lg:tw-fixed");
      setIsHeaderCollapsed(false);
      document.body.classList.add("modal-open");
    } else {
      collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]");
      collapseHeaderItems.style.height = "0vh";
      collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed");
      collapseBtn.classList.add("bi-list");
      document.body.classList.remove("modal-open");
      setIsHeaderCollapsed(true);
    }
  };

  // Add this in your component
  useEffect(() => {
    // Remove any existing instances first
    const existingScript = document.getElementById('chatling-embed-script');
    if (existingScript) {
        existingScript.remove();
    }
    
    // Remove any existing widgets and icons
    const chatElements = document.querySelectorAll('[id*="chatling"], [class*="chatling"]');
    chatElements.forEach(element => element.remove());
    
    // Create and add new script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.id = '2448985569';
    script.id = 'chatling-embed-script';
    script.src = 'https://chatling.ai/js/embed.js';
    document.body.appendChild(script);

    window.chtlConfig = {
        chatbotId: "2448985569"
    };

    return () => {
        // Complete cleanup on unmount
        const scriptToRemove = document.getElementById('chatling-embed-script');
        if (scriptToRemove) {
            scriptToRemove.remove();
        }
        
        // Remove all chatbot related elements
        const allChatElements = document.querySelectorAll('[id*="chatling"], [class*="chatling"]');
        allChatElements.forEach(element => element.remove());
        
        // Clear the config
        window.chtlConfig = null;
        
        // Remove any leftover chat icons
        const chatIcons = document.querySelectorAll('.chatling-widget-icon');
        chatIcons.forEach(icon => icon.remove());
    };
}, []);




  return (
    <>
    <ScrollToTop/>
    {/* <div>Sign in with firechat</div>
    <Button onClick={signin}>Sign in</Button> */}
     <Helmet>
        <html lang="en" className="" />
        <title>FireChat - Connect, Collaborate & Chat with Professionals Worldwide</title>
<meta name="description" content="Experience real-time conversations, AI-powered networking, and personalized content. Join professionals worldwide for instant messaging, video calls, and trending discussions." />

        <link rel="shortcut icon" href="/logo3.png" type="image/x-icon" />
        {/* <script src="./../../../index.js"/> */}
        <link 
  rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
/>

{/* 
<script type="text/javascript">
    {`
      window.chtlConfig = { 
        chatbotId: "2448985569" 
      };
    `}
  </script>
<script async data-id="2448985569" id="chatling-embed-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script> */}


        <meta property="og:title" content="FireChat - Connect, Collaborate & Chat with Professionals Worldwide" />
        <meta property="og:description" content="Experience real-time conversations, AI-powered networking, and personalized content. Join professionals worldwide for instant messaging, video calls, and trending discussions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://github.com/alex7842" />
        <meta property="og:image" content="" />

        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css"
            integrity="sha512-dPXYcDub/aeb08c63jRq/k6GaKccl256JQy/AnOq7CAnOZ9FzSL9wSbcZkMp4R26vBsMLFYH4kQ67/bbV8XaCQ=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
        />

       
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-');
          `}
        </script>
        <script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.0/gsap.min.js"
        integrity="sha512-B1lby8cGcAUU3GR+Fd809/ZxgHbfwJMp0jLTVfHiArTuUt++VqSlJpaJvhNtRf3NERaxDNmmxkdx2o+aHd4bvw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
    ></script>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.0/ScrollTrigger.min.js"
        integrity="sha512-AY2+JxnBETJ0wcXnLPCcZJIJx0eimyhz3OJ55k2Jx4RtYC+XdIi2VtJQ+tP3BaTst4otlGG1TtPJ9fKrAUnRdQ=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
    ></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.10/typed.min.js" integrity="sha512-hIlMpy2enepx9maXZF1gn0hsvPLerXoLHdb095CmRY5HG3bZfN7XPBZ14g+TUDH1aGgfLyPHmY9/zuU53smuMw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <script src="../../../scripts/component.js"></script>
    <script src="../../../index.js"></script>
      </Helmet>
    <body>
          <header
            class="lg:tw-px-4 tw-max-w-[100vw] tw-max-w-lg:tw-mr-auto max-lg:tw-top-0 tw-fixed tw-top-4 lg:tw-left-1/2 lg:tw--translate-x-1/2 tw-z-20 tw-flex tw-h-[60px] tw-w-full 
                    tw-text-gray-700 tw-bg-white dark:tw-text-gray-200 dark:tw-bg-[#17181b] tw-px-[3%] tw-rounded-md lg:tw-max-w-5xl tw-shadow-md dark:tw-shadow-gray-700
                    lg:tw-justify-around lg:!tw-backdrop-blur-lg lg:tw-opacity-[0.99]"
        >
            <a class="tw-flex tw-p-[4px] tw-gap-2 tw-place-items-center" href="#">
               

                <div class="tw-h-[30px] tw-max-w-[100px]">
                    <img
                        src="/logo3.png"
                        alt="logo"
                        class="tw-object-contain tw-h-full tw-w-full dark:tw-invert"
                    />
                </div>
                <span class="tw-uppercase tw-text-base tw-font-medium">FireChat</span>
            </a>
            <div
                class="collapsible-header animated-collapse max-lg:tw-shadow-md"
                id="collapsed-header-items"
            >
                <nav
                    class="tw-relative tw-flex tw-h-full max-lg:tw-h-max tw-w-max tw-gap-5 tw-text-base max-lg:tw-mt-[30px] max-lg:tw-flex-col 
                                max-lg:tw-gap-5 lg:tw-mx-auto tw-place-items-center"
                >
                    <a class="header-links" href="#pixa-playground"> Chat</a>
                    <a class="header-links" href="#blog"> Blog </a>
                    <a class="header-links" href="#footer"> Contact </a>
                   
                    <div class="tw-relative tw-flex tw-flex-col tw-place-items-center">
                        <div id="nav-dropdown-toggle-0" class="max-lg:tw-max-w-fit tw-flex header-links tw-gap-1  tw-place-items-center">
                            <span class=""> Features </span>
                            <i class="tw-text-sm bi bi-chevron-down"></i>
                        </div>
                        <nav id="nav-dropdown-list-0" 
                            data-open="false"
                            class="tw-scale-0 tw-opacity-0  lg:tw-fixed tw-flex lg:tw-top-[80px] lg:tw-left-1/2 lg:tw--translate-x-1/2 
                                    tw-w-[90%] tw-rounded-lg max-lg:tw-h-0 max-lg:tw-w-0
                                    lg:tw-h-[450px] tw-overflow-hidden
                                     tw-bg-white dark:tw-bg-[#17181B] tw-duration-300 
                                     tw-transition-opacity tw-transition-height tw-shadow-lg tw-p-4">
                            <div class="tw-grid max-xl:tw-flex max-xl:tw-flex-col tw-justify-around tw-grid-cols-2 tw-w-full">
                                <a class="header-links tw-flex tw-text-left tw-gap-4 !tw-p-4" href="#">
                                    <div class="tw-font-semibold tw-text-3xl">
                                        <i class="bi bi-list-columns-reverse"></i>
                                    </div>
                                    <div class="tw-flex tw-flex-col tw-gap-2">
                                    <div class="tw-text-lg tw-text-black dark:tw-text-white tw-font-medium">Communities</div>
                                    <p>Join professional groups worldwide</p>
                                    </div> 
                                </a>

                                <a class="header-links tw-flex tw-text-left tw-gap-4 !tw-p-4" href="#">
                                    <div class="tw-font-semibold tw-text-3xl">
                                        <i class="bi bi-grid-1x2-fill"></i>
                                    </div>
                                    <div class="tw-flex tw-flex-col tw-gap-2">
                                    <div class="tw-text-lg tw-text-black dark:tw-text-white tw-font-medium">Real-time Chat</div>
                                    <p>Instant messaging with professionals</p>
                                    </div> 
                                </a>

                                <a class="header-links tw-flex tw-text-left tw-gap-4 !tw-p-4" href="#">
                                    <div class="tw-font-semibold tw-text-3xl">
                                        <i class="bi bi-globe"></i>
                                    </div>
                                    <div class="tw-flex tw-flex-col tw-gap-2">
                                        <div class="tw-text-lg tw-text-black dark:tw-text-white tw-font-medium">Realtime web search </div>
                                        <p class="">Search the internet in realtime</p>
                                    </div> 
                                </a>

                                <a class="header-links tw-flex tw-text-left tw-gap-4 !tw-p-4" href="#">
                                    <div class="tw-font-semibold tw-text-3xl">
                                        <i class="bi bi-image-fill"></i>
                                    </div>
                                    <div class="tw-flex tw-flex-col tw-gap-2">
                                    <div class="tw-text-lg tw-text-black dark:tw-text-white tw-font-medium">News Feed</div>
        <p>AI-powered personalized content</p>

                                    </div> 
                                </a>

                                <a class="header-links tw-flex tw-text-left tw-gap-4 !tw-p-4" href="#">
                                    <div class="tw-font-semibold tw-text-3xl">
                                        <i class="bi bi-calendar-range"></i>
                                    </div>
                                    <div class="tw-flex tw-flex-col tw-gap-2">
                                    <div class="tw-text-lg tw-text-black dark:tw-text-white tw-font-medium">Video Calls</div>
                                    <p>Face-to-face conversations globally</p>
                                    </div> 
                                </a>

                                <a class="header-links tw-flex tw-text-left tw-gap-4 !tw-p-4" href="#">
                                    <div class="tw-font-semibold tw-text-3xl">
                                        <i class="bi bi-translate"></i>
                                    </div>
                                    <div class="tw-flex tw-flex-col tw-gap-2">
                                    <div class="tw-text-lg tw-text-black dark:tw-text-white tw-font-medium">Multilingual</div>
                                    <p>Chat in multiple languages</p>
                                    </div> 
                                </a>
                            </div>           
                        </nav>
                    </div>
                    <a class="header-links" id="toggle-mode-icon" href="#pricing"> Pricing </a>
                    
                </nav>
                <div
                    class="lg:tw-mx-4 tw-flex tw-place-items-center tw-gap-[20px] tw-text-base max-md:tw-w-full 
                            max-md:tw-flex-col max-md:tw-place-content-center" onClick={signin}
                >
                    {/* <button type="button"  class="header-links tw-text-gray-600 dark:tw-text-gray-300" title="toggle-theme" 
                            id="theme-toggle"> 
                        <i class="bi bi-moon" id="toggle-mode-icon"></i>
                    </button> */}
                    <a
                        href="#"
                        aria-label="Try FireChat Playground"
                        class="btn tw-flex tw-gap-3 tw-px-3 tw-py-2 tw-transition-transform 
                                    tw-duration-[0.3s] hover:tw-translate-x-2"
                    >
                        <span>Join Now</span>
                        <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            </div>
            <button
                class="bi bi-list tw-absolute tw-right-3 tw-top-3 tw-z-50 tw-text-3xl tw-text-gray-500 lg:tw-hidden"
                onClick={toggleHeader}
                aria-label="menu"
                id="collapse-btn"
            ></button>
        </header>

        <section
            class="hero-section tw-relative tw-mt-20 tw-flex tw-min-h-[100vh] tw-w-full tw-max-w-[100vw] tw-flex-col tw-overflow-hidden max-lg:tw-mt-[100px]"
            id="hero-section"
        >

            
            <div class="tw-fixed tw-bg-[#000000af] dark:tw-bg-[#80808085] tw-top-0 tw-left-1/2 tw--translate-x-1/2 tw-z-20 tw-transition-opacity
                tw-duration-300 tw-scale-0 tw-opacity-0 tw-p-2
                tw-w-full tw-h-full tw-flex tw-place-content-center tw-place-items-center" id="video-container-bg">

                <div class="tw-max-w-[80vw] max-lg:tw-max-w-full max-lg:tw-w-full tw-scale-0 tw-transition-transform tw-duration-500 tw-p-6 tw-rounded-xl  max-lg:tw-px-2 tw-w-full tw-gap-2 tw-shadow-md 
                            tw-h-[90vh] max-lg:tw-h-auto max-lg:tw-min-h-[400px] tw-bg-white dark:tw-bg-[#16171A] tw-max-h-full
                            " id="video-container">
                    <div class="tw-w-full tw-flex">
                        <button type="button" onClick={closeVideo} class="tw-ml-auto tw-text-xl" title="close">
                            <i class="bi bi-x-circle-fill"></i>
                        </button>
                    </div>
                    <div class="tw-flex tw-w-full  tw-rounded-xl tw-px-[5%] max-md:tw-px-2 tw-min-h-[300px] tw-max-h-[90%] tw-h-full">

                        <div class="tw-relative tw-bg-black tw-min-w-full tw-min-h-full tw-overflow-clip tw-rounded-md">
                          
                        <iframe  id="iframe"
    class="tw-absolute tw-top-[50%] tw--translate-y-[50%] tw-left-[50%] tw--translate-x-[50%] tw-w-full tw-h-full"
    src=""
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen>
</iframe>

                        </div>
        
                    </div>
                </div>  
            </div>

            <div    
                class="hero-bg-gradient tw-relative tw-flex tw-h-full tw-min-h-[100vh] tw-w-full tw-flex-col tw-place-content-center tw-gap-6 tw-p-[5%] max-xl:tw-place-items-center max-lg:tw-p-4"
            >

                <div class="purple-bg-grad  reveal-up tw-absolute tw-left-1/2 tw--translate-1/2 tw-top-[10%] tw-h-[120px] tw-w-[120px]"
                ></div> 

                <div
                    class="tw-flex tw-flex-col tw-min-h-[60vh] tw-place-content-center tw-items-center"
                >
                   <h2 class="reveal-up tw-text-center tw-text-7xl tw-font-semibold tw-uppercase dark:tw-text-white tw-leading-[90px] max-lg:tw-text-4xl max-md:tw-leading-snug">
    <span class="">AI-Enhanced Chats</span>
    <br />
    <span class="tw-font-thin tw-font-serif">Smarter Connections</span>
</h2>

<div class="reveal-up tw-mt-8 tw-max-w-[450px] tw-text-lg max-lg:tw-text-base tw-p-2 tw-text-center tw-text-gray-800 dark:tw-text-white max-lg:tw-max-w-full">
   Connect instantly, share ideas, make video calls, and stay updated with personalized news - all within FireChat's seamless interface.
</div>


                    <div
                        class="reveal-up tw-mt-10 max-md:tw-flex-col tw-flex tw-place-items-center tw-gap-4"
                    >

                        <button onClick={openVideo}
                            class="btn !tw-w-[170px] max-lg:!tw-w-[160px] !tw-rounded-xl !tw-py-4 max-lg:!tw-py-2 tw-flex tw-gap-2 tw-group !tw-bg-transparent !tw-text-black dark:!tw-text-white tw-transition-colors 
                                        tw-duration-[0.3s] tw-border-[1px] tw-border-black dark:tw-border-white"
                        >
                            
                            <div class="tw-relative tw-flex tw-place-items-center tw-place-content-center tw-w-6 tw-h-6">
                                <div class="tw-absolute tw-inset-0 tw-top-0 tw-left-0 tw-scale-0 tw-duration-300 group-hover:tw-scale-100 tw-border-2
                                             tw-border-gray-600 dark:tw-border-gray-200 tw-rounded-full tw-w-full tw-h-full"></div>
                                <span class="bi bi-play-circle-fill"></span>
                            </div>
                            <span>Watch video</span>
                        </button>

                        <a
                            class="btn tw-group max-lg:!tw-w-[160px] tw-flex tw-gap-2 tw-shadow-lg !tw-w-[170px] !tw-rounded-xl !tw-py-4 max-lg:!tw-py-2 tw-transition-transform tw-duration-[0.3s] hover:tw-scale-x-[1.03]"
                            onClick={signin}
                        >
                            <span>Get started</span>
                            <i class="bi bi-arrow-right group-hover:tw-translate-x-1 tw-duration-300"></i>
                        </a>
                        
                    </div>
                </div>
                
               
                <div
                    class="reveal-up  tw-relative tw-mt-8 tw-flex tw-w-full tw-place-content-center tw-place-items-center"
                    id="dashboard-container"
                >
                    <div class="purple-bg-grad  reveal-up tw-absolute tw-left-1/2 tw--translate-x-1/2 tw-top-[5%] tw-h-[200px] tw-w-[200px]"
                    ></div>    

                    <div
                        class="tw-relative tw-max-w-[80%] tw-bg-white dark:tw-bg-black tw-border-[1px] dark:tw-border-[#36393c] lg:tw-w-[1024px]
                                lg:tw-h-[650px]  tw-flex tw-shadow-xl max-lg:tw-h-[450px] max-lg:tw-w-full
                                tw-overflow-hidden
                                tw-min-w-[320px] md:tw-w-full tw-min-h-[450px] tw-rounded-xl tw-bg-transparent max-md:tw-max-w-full"
                        id="dashboard"
                    >  

                        <div class="purple-bg-grad tw-max-w-[80%] reveal-up tw-absolute tw-left-1/2 tw--translate-x-1/2 tw-top-[0%] lg:tw-max-w-[1000px] tw-h-full tw-w-full"
                        ></div> 
                        <div class="animated-border tw-w-full tw-h-full tw-p-[2px]">
                            <div class="tw-w-full tw-h-full tw-rounded-xl tw-overflow-hidden tw-flex">
                              
                                <div class="tw-absolute tw-rounded-xl tw-text-center tw-transition-transform tw-duration-300 tw-scale-0 tw-backdrop-blur-lg tw-flex tw-flex-col tw-p-10 tw-place-items-center 
                                        tw-gap-4 tw-w-full tw-h-full dark:tw-bg-[#000000b4] tw-bg-[#ffffff6a] firefox:tw-bg-white tw-top-0 tw-left-0 tw-z-20"
                                        id="signup-prompt"
                                        >

                                    <h4 class="tw-mt-6 dark:tw-text-white tw-text-3xl max-md:tw-text-xl">
                                        Signup to connect with real people
                                    </h4>

                                    <div class="tw-flex tw-gap-1 tw-place-items-center">
                                        <div class="tw-flex tw--space-x-4">
                                            <img class="tw-z-10 tw-w-10 tw-h-10 tw-object-cover tw-rounded-full tw-border-2 tw-border-white" src="/assets/images/people/man.jpg" alt="Avatar 1"/>
                                            <img class="tw-z-[4] tw-w-10 tw-h-10 tw-object-cover tw-rounded-full tw-border-2 tw-border-white" src="/assets/images/people/women.jpg" alt="Avatar 2"/>
                                            <img class="tw-z-[3] tw-w-10 tw-h-10 tw-object-cover tw-rounded-full tw-border-2 tw-border-white" src="/assets/images/people/man2.jpg" alt="Avatar 3"/>
                                            <img class="tw-z-[2] tw-w-10 tw-h-10 tw-object-cover tw-rounded-full tw-border-2 tw-border-white" src="assets/images/people/man.jpg" alt="Avatar 4"/>
                                            <img class="tw-z-[1] tw-w-10 tw-h-10 tw-object-cover tw-rounded-full tw-border-2 tw-border-white" src="/assets/images/people/women.jpg" alt="Avatar 5"/>
                                        </div>
                                        <p class="dark:tw-text-white">+2000</p>
                                    </div>

                                    <div class="tw-mt-3 tw-text-lg dark:tw-text-white">
                                        Join Alex and 2000+ users using FireChat
                                    </div>

                                    <a href="#" onClick={signin}class="btn">
                                        Sign up
                                    </a>

                                </div>

                                <div class="tw-min-w-[250px] max-lg:tw-hidden tw-p-2 tw-gap-2 tw-flex tw-flex-col tw-bg-gray-100 
                                            dark:tw-bg-[#171717] tw-h-full">
                                 
                                    <div class="tw-h-[30px] tw-w-fit tw-max-w-[100px]">
                                        <img
                                            src="/logo3.png"
                                            alt="logo"
                                            class="tw-object-contain tw-opacity-80 tw-h-full tw-w-full dark:tw-invert"
                                        />
                                    </div>

                                    <div class="tw-flex tw-mt-2 dark:tw-text-white tw-gap-2 tw-flex-col">
                                        <a href="#Community" 
                                            class="tw-flex tw-rounded-sm tw-gap-2 tw-p-2 dark:hover:tw-bg-[#2d2d2ddb] hover:tw-bg-gray-200">
                                            <i class="bi bi-people-fill"></i>
                                            <span class="dark:tw-text-white">Communities</span>
                                        </a>
                                        <a href="#Group" 
                                            class="tw-flex tw-rounded-sm tw-gap-2 tw-p-2 dark:hover:tw-bg-[#2d2d2ddb] hover:tw-bg-gray-200">
                                            <i class="bi bi-chat"></i>
                                            <span>Groups</span>
                                        </a>
                                        <a href="#Profile" 
                                            class="tw-flex tw-rounded-sm tw-gap-2 tw-p-2 dark:hover:tw-bg-[#2d2d2ddb] hover:tw-bg-gray-200">
                                            <i class="bi bi-person-circle"></i>
                                            <span>Profile</span>
                                        </a>
                                        <a href="#" 
                                            class="tw-flex tw-rounded-sm tw-group tw-gap-2 tw-p-2 dark:hover:tw-bg-[#2d2d2ddb] hover:tw-bg-gray-200">
                                            <span>Show all</span>
                                            <i class="bi bi-arrow-right tw-transform tw-transition-transform tw-duration-300 group-hover:tw-translate-x-1"></i>
                                        </a>
                                    </div>

                                    <div class="tw-mt-auto tw-w-full tw-flex tw-px-6 tw-place-content-center" onClick={signin}>
                                        <a href="" class="btn !tw-w-full !tw-bg-transparent tw-duration-[0.3s] 
                                                                hover:!bg-violet-600 hover:!tw-text-white
                                                                dark:hover:!tw-bg-white dark:hover:!tw-text-black
                                                                !tw-border-[1px] !tw-border-black !tw-text-black
                                                                dark:!tw-border-white dark:!tw-text-white
                                                                ">
                                            Signup
                                        </a>
                                    </div>

                                </div>

                                <div class="tw-flex tw-w-full tw-p-4 tw-bg-white dark:tw-bg-black tw-h-full tw-flex-col" id="pixa-playground">
                                    <div class="tw-relative tw-w-full tw-flex tw-place-content-center tw-h-full">
                                        <div class="tw-absolute tw-top-[20%] max-lg:tw-top-[30%] tw-left-1/2 tw--translate-x-1/2  tw-w-[150px] tw-h-[150px]">
                                            <img src="/logo3.png" class="tw-w-full tw-h-full dark:tw-invert tw-object-contain tw-opacity-20"
                                                alt="Firechat logo"/>
                                        </div>
                                        <div class="prompt-container tw-overflow-y-auto tw-px-[5%] max-lg:tw-px-2 scrollbar max-lg:tw-max-h-[80%] tw-max-h-[550px] 
                                                    max-lg:tw-mt-12 tw-w-full tw-h-full tw-z-10 tw-flex tw-flex-col" id="prompt-container">
                                            <div class="tw-w-full tw-flex tw-text-center tw-flex-col tw-place-content-center">
                                                <h2 class="tw-text-4xl max-md:tw-text-2xl max-md:tw-mt-3 tw-opacity-80">
                                                    Chat Now
                                                </h2>
                                                <div class="tw-inline tw-mt-6 max-md:tw-mt-3">
                                                    <span id="prompts-sample" ></span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    <form action="" id="prompt-form" onSubmit="return false;" 
                                        class="tw-place-content-center tw-mt-auto tw-h-[50px] tw-p-1 tw-place-items-center 
                                                tw-justify-around tw-flex tw-gap-1 tw-bottom-2 tw-w-full tw-rounded-md tw-bg-[#f3f4f6] dark:tw-bg-[#171717]">
                                        <div class="tw-min-w-[140px] tw-min-h-[80px] max-lg:tw-absolute tw-z-10 tw-top-1 tw-left-1/2 max-lg:tw--translate-x-1/2 
                                                    tw-flex tw-flex-col tw-text-sm tw-gap-1 tw-place-content-center">
                                            <div class="dropdown tw-p-2 tw-rounded-md  tw-bg-[#f3f4f6] dark:tw-bg-[#171717]" id="dropdown1">
                                           
                                                <input type="hidden" class="dropdown-input"/>
                                                <button
                                                    type="button"
                                                    class="dropdown-toggle tw-flex tw-gap-5"
                                                >
                                                    <span class="tw-flex tw-w-fit tw-gap-2 tw-place-items-center">
                                                        <div class="tw-w-[20px] tw-h-[20px]">
                                                        <i class="bi bi-paperclip dropdown-select-icon dark:tw-invert " style={{fontSize:"22px"}}></i>
                                                           
                                                        </div>
                                                        <span class="dropdown-select-text">Attach</span>
                                                    </span>
                                                 
                                                </button>
                                                <ul class="dropdown-menu tw-shadow-md tw-bottom-[50px] max-lg:tw-top-[105%] max-lg:tw-bottom-[unset]">
                                                  
                                                    <li class="tw-flex tw-gap-2 tw-place-items-center">
                                                        <div class="tw-w-[20px] tw-h-[20px]">
                                                        <i class="bi  bi-file-earmark-pdf dropdown-menu-icon" style={{fontSize:"20px"}}></i>
                                                        </div>
                                                        <span class="dropdown-text">Pdf</span>
                                                    </li>
                                                    <li class="tw-flex tw-gap-2 tw-place-items-center">
                                                        <div class="tw-w-[20px] tw-h-[20px]">
                                                        <i class="bi bi-image dropdown-menu-icon" style={{fontSize:"20px"}}></i>
                                                        </div>
                                                        <span class="dropdown-text">Image</span>
                                                    </li>
                                                    <li class="tw-flex tw-gap-2 tw-place-items-center">
                                                        <div class="tw-w-[20px] tw-h-[20px]">
                                                        <i class="bi bi-file-earmark-code dropdown-menu-icon" style={{fontSize:"20px"}}></i>
                                                        </div>
                                                        <span class="dropdown-text">Doc</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <input placeholder="Start a secure, end-to-end encrypted conversation..."  
                                                type="text" class="tw-p-2 !tw-outline-none tw-bg-transparent tw-border-none tw-w-full tw-placehoder-gray-500
                                                                    dark:tw-placeholder-opacity-60 dark:tw-placeholder-gray-300 tw-max-w-[80%] tw-h-full" 
                                                name="prompt" />
                                        <button type="submit" class="btn !tw-bg-[#7f07cf] !tw-p-2 !tw-px-3 !tw-text-white" title="submit">
                                            <i class="bi bi-arrow-up"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section
            class="tw-relative tw-flex tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden tw-p-8"
        >
            <h2 class="reveal-up tw-text-3xl max-md:tw-text-xl">
                Trusted by brands you love
            </h2>

            <div class="reveal-up carousel-container">
                <div
                    class="carousel lg:w-place-content-center tw-mt-10 tw-flex tw-w-full tw-gap-5 max-md:tw-gap-2"
                >
                    
                 
                    <div class="carousel-img tw-h-[30px] tw-w-[150px]">
                        <img 
                            src="/assets/images/brand-logos/airbnb.svg"
                            alt="AirBnb"
                            class="tw-h-full tw-w-full tw-object-contain tw-grayscale tw-transition-colors hover:tw-grayscale-0"
                            srcset=""
                        />
                    </div>
                    <div class="carousel-img tw-h-[30px] tw-w-[150px]">
                        <img
                            src="/multi.png"
                            alt="Multigen"
                            class="tw-h-full tw-w-full tw-object-contain tw-grayscale tw-transition-colors hover:tw-grayscale-0"
                            srcset=""
                        />
                    </div>
                    
                    <div class="carousel-img tw-flex tw-items-center tw-gap-2">
    <div className='cursor-pointer mt-2 tw-grayscale hover:tw-grayscale-0 group' onClick={() => window.open('https://www.chatpulse.dev', '_blank')}>
        <img
            src="/chatpulsebg4.png"
            alt="ChatPulse Icon"
            class="tw-h-[30px] ml-7 tw-w-[30px] tw-object-contain tw-transition-colors"
        />
        <p class="tw-font-extrabold tw-text-xl tw-font-montserrat tw-tracking-wider tw-transition-all group-hover:text-emerald-400 group-hover:tw-scale-110 hover:tw-font-black tw-duration-300">
            ChatPulse
        </p>
    </div>
</div>







                    <div class="carousel-img tw-h-[30px] tw-w-[150px]">
                    <div class="carousel-img tw-h-[30px] tw-w-[150px]">
                    <div class="tw-flex tw-gap-1 cursor-pointer tw-flex  hover:text-red-500"     onClick={() => window.open('https://www.youtube.com/@notsatisfy-777', '_blank')}>
  <span class="tw-font-dancing-script tw-text-4xl tw-transition-all hover:tw-scale-125">N</span>
  <span class="tw-font-playfair tw-text-4xl  tw-transition-all hover:tw-scale-125">T</span>
  <span class="tw-font-lobster tw-text-4xl  tw-transition-all hover:tw-scale-125">S</span>
  <span class="tw-font-pacifico tw-text-4xl  tw-transition-all hover:tw-scale-125">5</span>
</div>

</div>
                    </div>
                    <div class="carousel-img tw-h-[50px] tw-w-[200px] cursor-pointer">
    <img
        src="/fx2.png"
        alt="fx"
        class="tw-h-full mt-2 tw-w-full tw-object-contain tw-grayscale tw-transition-all tw-duration-300 hover:grayscale-0 hover:sepia hover:tw-brightness-150 tw-hover:tw-saturate-[2] hover:tw-hue-rotate-[40deg]"
        srcset=""
    />
</div>
                </div>
            </div>
        </section>

            
        <section
            class="tw-relative tw-flex  tw-w-full tw-min-h-[100vh] max-lg:tw-min-h-[80vh] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden"
        >   
             <div class="tw-w-full  tw-place-content-center tw-items-center 
                        tw-flex tw-flex-col tw-max-w-[900px] tw-gap-4 tw-p-4">
               <div class="purple-bg-grad  reveal-up tw-absolute tw-right-[20%] tw-top-[20%] tw-h-[200px] tw-w-[200px]"
                ></div>
                <h2 class="reveal-up tw-text-6xl max-lg:tw-text-4xl tw-text-center tw-leading-normal tw-uppercase">
                    
                    <span class="tw-font-semibold">Connect Globally </span>
                    <br/>
                    <span class="tw-font-serif">with Secure Messaging</span>
                </h2>
                <p class="reveal-up tw-mt-8 tw-max-w-[650px] tw-text-gray-900 dark:tw-text-gray-200 tw-text-center max-md:tw-text-sm">   
                Experience real-time communication with end-to-end encryption. Join thriving professional communities, make video calls, and stay updated with personalized news feeds - all in one secure platform.
                </p>
                <div class="reveal-up tw-flex tw-mt-8 cursor-pointer " onClick={signin}>
                    <a  

                        rel="noopener"
                        class="tw-shadow-md hover:tw-shadow-xl dark:tw-shadow-gray-800 tw-transition-all tw-duration-300 
                                        tw-border-[1px] tw-p-3 tw-px-4 tw-border-black dark:tw-border-white tw-rounded-md">
                       Start Chatting Now
                    </a>
                </div>
            </div>
        </section>

        <section
            class="tw-relative tw-flex tw-max-w-[100vw] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden"
        >   


            <div
                class="tw-mt-8 tw-flex tw-flex-col tw-w-full tw-h-full tw-place-items-center tw-gap-5"
            >
                <div
                    class="reveal-up tw-mt-5 tw-flex tw-flex-col tw-gap-3 tw-text-center"
                >
                    <h2
                        class="tw-text-6xl tw-font-medium max-md:tw-text-3xl tw-p-2"
                    >
                        Experience all the benefits of AI
                    </h2>
                </div>
                <div class="mt-6 flex flex-col max-w-[1150px] max-lg:max-w-full h-full p-4 max-lg:place-content-center gap-8">
                    <div class="flex flex-col lg:flex-row gap-8 place-items-center place-content-center">



                        <div class="reveal-up tw-w-[350px] tw-h-[540px] tw-flex max-md:tw-w-full">
                            <a href="#"   onClick={(e) => e.preventDefault()} class=" tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card  tw-gap-5 tw-flex 
                                tw-flex-col tw-w-full tw-h-full  tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl 
                                hover:tw-scale-[1.02]">
                                <div class="tw-overflow-hidden tw-w-full tw-min-h-[180px] tw-h-[180px]">
                                    <img src="/u1bg.png" class="tw-w-full tw-object-contain tw-h-auto" 
                                        alt="unified interface"/>
                                   
                                </div>
                                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">Smart Messaging</h2>
                                <p class="tw-text-base tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">
                                Experience intelligent messaging with real-time grammar correction, message rephrasing, and smart auto-completion. Write perfect messages every time with our AI-powered writing assistance.
                                </p>
                                
                            </a>
                        </div>

                        
                        <div class="reveal-up tw-w-[350px] tw-h-[540px] tw-flex max-md:tw-w-full" >
                            <a href="#"   onClick={(e) => e.preventDefault()} class=" tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card  tw-gap-5 tw-flex 
                                tw-flex-col tw-w-full tw-h-full  tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl 
                                hover:tw-scale-[1.02]">
                                <div class="tw-w-full tw-min-h-[180px] tw-h-[180px] tw-overflow-hidden">
                                    <img src="/u2bg.png" 
                                        alt="API" class="tw-w-full tw-h-auto tw-object-contain"/>
                                    
                                </div>
                                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">AI-Curated Feed</h2>
                                <p class="tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">
                                Get personalized news and content tailored to your interests. Our AI analyzes your interactions to deliver relevant professional updates, industry news, and networking opportunities.
                                </p>
                              
                            </a>
                        </div>

                        
                        <div class="reveal-up tw-w-[350px] tw-h-[540px] tw-flex max-md:tw-w-full">
                            <a href="#"  onClick={(e) => e.preventDefault()} class=" tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card  tw-gap-5 tw-flex 
                                tw-flex-col tw-w-full tw-h-full  tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl 
                                hover:tw-scale-[1.02]">
                                <div class="tw-w-full tw-flex tw-place-contet-center tw-min-h-[180px] tw-h-[180px] tw-rounded-xl tw-overflow-hidden">
                                    <img src="/assets/images/home/integrations1.png" class="tw-w-full tw-h-auto tw-object-contain" 
                                            alt="Prebuilt integrations"/>
                                </div>
                                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">Smart Media Tools</h2>
                                <p class="tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">
                                Enhance your media with AI-generated captions, automatic image descriptions, and smart formatting. Share professional-looking content effortlessly with our intelligent media tools.
                                </p>
                                
                            </a>
                        </div>
                    </div>
                    
                    <div class="reveal-up tw-w-full md:tw-h-[350px] max-md:tw-min-h-[350px] tw-flex">
                        <a href="#"  onClick={(e) => e.preventDefault()} class=" tw-relative tw-p-10 tw-transition-all tw-duration-300 tw-group/card  tw-gap-5 tw-flex 
                            max-md:tw-flex-col tw-w-full tw-h-full  tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-rounded-3xl 
                            hover:tw-scale-[1.02]">
                            <div class="tw-text-6xl tw-overflow-hidden tw-rounded-xl tw-w-full tw-h-full max-md:tw-h-[180px]">
                                <img src="/u3.png" class="tw-w-full tw-object-contain tw-h-full" 
                                    alt="AI models"/>
                             
                            </div>
                            <div class="tw-flex tw-flex-col tw-gap-4">
                                <h2 class="tw-text-3xl max-md:tw-text-2xl tw-font-medium">AI Communication Assistant</h2>
                                <p class="tw-leading-normal tw-text-gray-800 dark:tw-text-gray-200">
                                Your personal AI assistant helps with message suggestions, meeting summaries, and professional networking recommendations. Get smart replies, schedule assistance, and communication insights all in one place.
                                </p>
                                
                            </div>
                        </a>
                    </div>

                </div>
            </div>
        </section>

        <section
            class="tw-relative tw-mt-10 tw-flex tw-min-h-[100vh] tw-w-full tw-max-w-[100vw] tw-flex-col tw-place-items-center lg:tw-p-6"
        >

            <div
                class="reveal-up tw-mt-[5%] tw-flex tw-h-full tw-w-full tw-place-content-center 
                        tw-gap-2 tw-p-4 max-lg:tw-max-w-full max-lg:tw-flex-col"
            >

                <div
                    class="tw-relative tw-flex tw-max-w-[30%] max-lg:tw-max-w-full tw-flex-col 
                            tw-place-items-start tw-gap-4  tw-p-2 max-lg:tw-place-items-center 
                            max-lg:tw-place-content-center max-lg:tw-w-full"
                >
                    <div
                        class="tw-top-40 tw-flex tw-flex-col lg:tw-sticky tw-place-items-center tw-max-h-fit tw-max-w-[850px] max-lg:tw-max-h-fit max-lg:tw-max-w-[320px] tw-overflow-hidden"
                    >
                        <h2 class="tw-text-5xl tw-font-serif tw-text-center tw-font-medium  max-md:tw-text-3xl"
                            >
                            Pre-built AI Tools
                        </h2>
                        
                        <a href="" onClick={signin} class="btn !tw-mt-8 !tw-bg-transparent !tw-text-black 
                                                !tw-border-[1px] !tw-border-black 
                                                dark:!tw-border-white dark:!tw-text-white">
                            Start Chat
                        </a>

                    </div>
                   
                </div>

                <div
                    class="tw-flex tw-flex-col tw-gap-10 tw-h-full tw-max-w-1/2 max-lg:tw-max-w-full tw-px-[10%]
                             max-lg:tw-px-4 max-lg:tw-gap-3 max-lg:tw-w-full lg:tw-top-[20%]
                             tw-place-items-center
                             "
                >   
                    <div class="reveal-up tw-h-[240px] tw-w-[450px] max-md:tw-w-full">
                        <a href="#"  onClick={(e) => e.preventDefault()}
                            class="tw-flex tw-w-full tw-h-full tw-gap-8 tw-rounded-xl 
                                    hover:tw-shadow-lg dark:tw-shadow-[#171717] tw-duration-300 tw-transition-all
                                  tw-p-8 tw-group/card"
                        >
                            <div class="tw-text-4xl max-md:tw-text-2xl">
                                <i class="bi bi-code-square"></i>
                            </div>

                            <div class="tw-flex tw-flex-col tw-gap-4">
                                <h3 class="tw-text-2xl max-md:tw-text-xl">
                                Real-time Notifications
                                </h3>
                                <p class="tw-text-gray-800 dark:tw-text-gray-100 max-md:tw-text-sm">
                                Stay connected with instant notifications for messages, mentions, and community updates. Never miss important conversations or networking opportunities.

                                </p>

                               
                            </div>
                        </a>
                    </div>

                    <div class="reveal-up tw-h-[240px] tw-w-[450px] max-md:tw-w-full">
                        <a href="#"  onClick={(e) => e.preventDefault()}
                            class="tw-flex tw-w-full tw-h-full tw-gap-8 tw-rounded-xl
                                 hover:tw-shadow-lg dark:tw-shadow-[#171717] tw-duration-300 tw-transition-all tw-p-8 tw-group/card"
                        >
                            <div class="tw-text-4xl max-md:tw-text-2xl">
                                <i class="bi bi-file-pdf-fill"></i>
                            </div>

                            <div class="tw-flex tw-flex-col tw-gap-4">
                                <h3 class="tw-text-2xl max-md:tw-text-xl">
                                HD Video Calls
                                </h3>
                                <p class="tw-text-gray-800 dark:tw-text-gray-100 max-md:tw-text-sm">
                                Crystal-clear video calls with automatic background blur, noise cancellation, and live captions.

                                </p>

                               
                            </div>
                        </a>
                    </div>

                    <div class="reveal-up tw-h-[240px] tw-w-[450px] max-md:tw-w-full">
                        <a href="#"  onClick={(e) => e.preventDefault()}
                            class="tw-flex tw-w-full tw-h-full tw-gap-8 tw-rounded-xl hover:tw-shadow-lg tw-duration-300 
                                tw-transition-all dark:tw-shadow-[#171717] tw-p-8 tw-group/card"
                        >
                            <div class="tw-text-4xl max-md:tw-text-2xl">
                                <i class="bi bi-image-fill"></i>
                            </div>

                            <div class="tw-flex tw-flex-col tw-gap-4">
                                <h3 class="tw-text-2xl max-md:tw-text-xl">
                                Professional Communities
                                </h3>
                                <p class="tw-text-gray-800 dark:tw-text-gray-100 max-md:tw-text-sm">
                                Join industry-specific groups, share knowledge, and network with professionals worldwide.
                                </p>

                               
                            </div>
                        </a>
                    </div>

                    <div class="reveal-up tw-h-[240px] tw-w-[450px] max-md:tw-w-full">
                        <a href="#"   onClick={(e) => e.preventDefault()}
                            class="tw-flex tw-w-full dark:tw-shadow-[#171717] tw-h-full tw-gap-8 tw-rounded-xl  hover:tw-shadow-lg tw-duration-300 
                            tw-transition-all tw-p-8 tw-group/card"
                        >
                            <div class="tw-text-4xl max-md:tw-text-2xl">
                                <i class="bi bi-bar-chart-line-fill"></i>
                            </div>

                            <div class="tw-flex tw-flex-col tw-gap-4">
                                <h3 class="tw-text-2xl max-md:tw-text-xl">
                                Smart News Feed
                                </h3>
                                <p class="tw-text-gray-800 dark:tw-text-gray-100 max-md:tw-text-sm">
                                AI-curated content feed delivering relevant industry news, trends, and networking opportunities.

                                </p>

                            </div>
                        </a>
                    </div>
                    
                    <div class="reveal-up tw-h-[240px] tw-w-[450px] max-md:tw-w-full">
                        <a href="#"  onClick={(e) => e.preventDefault()}
                            class="tw-flex tw-w-full tw-h-full tw-gap-8 tw-rounded-xl dark:tw-shadow-[#171717] hover:tw-shadow-lg tw-duration-300 
                                tw-transition-all tw-p-8 tw-group/card"
                        >
                            <div class="tw-text-4xl max-md:tw-text-2xl">
                                <i class="bi bi-music-note-beamed"></i>
                            </div>

                            <div class="tw-flex tw-flex-col tw-gap-4">
                                <h3 class="tw-text-2xl max-md:tw-text-xl">
                                Secure File Sharing
                                </h3>
                                <p class="tw-text-gray-800 dark:tw-text-gray-100 max-md:tw-text-sm">
                                Share files securely with end-to-end encryption and smart organization features.
                                </p>

                             
                            </div>
                        </a>
                    </div>

                    <div class="reveal-up tw-h-[240px] tw-w-[450px] max-md:tw-w-full">
                        <a href="#"  onClick={(e) => e.preventDefault()}
                            class="tw-flex tw-w-full tw-h-full tw-gap-8 tw-rounded-xl 
                                    hover:tw-shadow-lg dark:tw-shadow-[#171717] tw-duration-300 tw-transition-all tw-p-8 tw-group/card"
                        >
                            <div class="tw-text-4xl max-md:tw-text-2xl">
                                <i class="bi bi-camera-video-fill"></i>
                            </div>

                            <div class="tw-flex tw-flex-col tw-gap-4">
                                <h3 class="tw-text-2xl max-md:tw-text-xl">
                                Network Insights
                                </h3>
                                <p class="tw-text-gray-800 dark:tw-text-gray-100 max-md:tw-text-sm">
                                Track your networking growth, engagement metrics, and community impact with detailed analytics.
                            
                                </p>

                               
                            </div>
                        </a>
                    </div>

                </div>

                
            </div>
        </section>


        <section
            class="tw-relative tw-flex  tw-w-full tw-min-h-[110vh] max-md:tw-min-h-[80vh] tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden"
        >   
             <div class="tw-w-full max-lg:tw-max-w-full tw-place-content-center tw-items-center 
                        tw-flex tw-flex-col tw-max-w-[80%] tw-gap-4 tw-p-4">
               
                <h3 class="reveal-up tw-text-5xl tw-font-medium max-md:tw-text-3xl tw-text-center tw-leading-normal">
                    Additional Features
                </h3>
               
                <div class="tw-mt-8 tw-relative tw-gap-10 tw-p-4 tw-grid tw-place-items-center tw-grid-cols-3 max-lg:tw-flex max-lg:tw-flex-col">


                    <div class="reveal-up  tw-w-[350px] tw-border-[1px] tw-h-[400px] tw-rounded-md tw-place-items-center tw-p-4
                                 tw-bg-[#f2f3f4] max-md:tw-w-[320px] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-3">

                        <div class="tw-w-full tw-h-[250px]
                                    tw-p-4
                                    tw-rounded-xl 
                                     tw-backdrop-blur-2xl
                                     tw-overflow-hidden tw-flex tw-place-content-center">
                            <img src="/assets/images/home/undraw.png" 
                                    alt="Prompt library" class="tw-w-auto tw-h-full tw-object-contain"/>
                        </div>
                        <h3 class="tw-text-2xl">
                        Personalized News Feed
                        </h3>
                        <p class="tw-text-gray-700 dark:tw-text-gray-300 tw-px-4 tw-text-center tw-text-sm">
                        Stay updated with trending news, industry updates, and content tailored to your interests and network.
                        </p>
                    </div>
                    
                    <div class="reveal-up tw-w-[350px] max-md:tw-w-[320px] tw-border-[1px] tw-h-[400px] tw-rounded-md tw-place-items-center tw-p-4
                                 tw-bg-[#f2f3f4] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-3">

                        <div class="tw-w-full tw-h-[250px]
                                    tw-p-4
                                    tw-rounded-xl 
                                     tw-backdrop-blur-2xl
                                     tw-overflow-hidden tw-flex tw-place-content-center">
                            <img src="/assets/images/home/search.png" 
                                    alt="Web search" class="tw-w-auto tw-h-full tw-object-contain"/>
                        </div>
                        <h3 class="tw-text-2xl">
                        Smart Networking
                        </h3>
                        <p class="tw-text-gray-700 dark:tw-text-gray-300 tw-px-4 tw-text-center tw-text-sm">
                        Connect with professionals, join communities, and expand your network with AI-powered recommendations.
                        </p>
                    </div>

                    <div class="reveal-up tw-w-[350px] max-md:tw-w-[320px] tw-border-[1px] tw-h-[400px] tw-rounded-lg tw-place-items-center tw-p-4
                                 tw-bg-[#f2f3f4] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-3">

                        <div class="tw-w-full tw-h-[250px]
                                    tw-p-4
                                    tw-rounded-xl 
                                     tw-backdrop-blur-2xl
                                     tw-overflow-hidden tw-flex tw-place-content-center">
                            <img src="/assets/images/home/image.png" 
                                    alt="Image generation" class="tw-w-auto tw-h-full tw-object-contain"/>
                        </div>
                        <h3 class="tw-text-2xl">
                        Rich Content Sharing
                        </h3>
                        <p class="tw-text-gray-700 dark:tw-text-gray-300 tw-px-4 tw-text-center tw-text-sm">
                        Share articles, media, and updates with your network. Engage through comments, reactions, and discussions.
                        </p>
                    </div>

                    <div class="reveal-up tw-w-[350px] max-md:tw-w-[320px] tw-border-[1px] tw-h-[400px] tw-rounded-lg tw-place-items-center tw-p-4
                                 tw-bg-[#f2f3f4] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-3">

                        <div class="tw-w-full tw-h-[250px]
                                    tw-p-4
                                     tw-rounded-xl 
                                     tw-backdrop-blur-2xl
                                     tw-overflow-hidden tw-flex tw-place-content-center">
                            <img src="/assets/images/home/history.png" 
                                    alt="History" class="tw-w-auto tw-h-full tw-object-contain"/>
                        </div>
                        <h3 class="tw-text-2xl">
                            History
                        </h3>
                        <p class="tw-text-gray-700 dark:tw-text-gray-300 tw-px-4 tw-text-center tw-text-sm">
                            All of the models can recall previous topic, so you 
                            can continue your conversation at any point of time. 
                        </p>
                    </div>

                    <div class="reveal-up tw-w-[350px] max-md:tw-w-[320px] tw-border-[1px] tw-h-[400px] tw-rounded-lg tw-place-items-center tw-p-4
                                 tw-bg-[#f2f3f4] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-3">

                        <div class="tw-w-full tw-h-[250px]
                                    tw-p-4
                                    tw-rounded-xl 
                                     tw-backdrop-blur-2xl
                                     tw-overflow-hidden tw-flex tw-place-content-center">
                            <img src="/assets/images/home/import.png" 
                                    alt="Import content" class="tw-w-auto tw-h-full tw-object-contain"/>
                        </div>
                        <h3 class="tw-text-2xl">
                            Export content
                        </h3>
                        <p class="tw-text-gray-700 dark:tw-text-gray-300 tw-px-4 tw-text-center tw-text-sm">
                            Effortlessly Export PDFs, images, and documents. Use AI to ask questions, extract information, and summarize documents.
                        </p>
                    </div>

                    <div class="reveal-up tw-w-[350px] max-md:tw-w-[320px] tw-border-[1px] tw-h-[400px] tw-rounded-lg tw-place-items-center tw-p-4
                                 tw-bg-[#f2f3f4] dark:tw-bg-[#141414] dark:tw-border-[#1f2123] tw-flex tw-flex-col tw-gap-3">

                        <div class="tw-w-full tw-h-[250px]
                                    tw-p-4
                                    tw-rounded-xl 
                                     tw-backdrop-blur-2xl
                                     tw-overflow-hidden tw-flex tw-place-content-center">
                            <img src="/assets/images/home/multilingual.png" 
                                    alt="Multilingual" class="tw-w-auto tw-h-full tw-object-contain"/>
                        </div>
                        <h3 class="tw-text-2xl">
                            Global Reach
                        </h3>
                        <p class="tw-text-gray-700 dark:tw-text-gray-300 tw-px-4 tw-text-center tw-text-sm">
                        Connect with friends worldwide through real-time translation in over <NumberTicker value={100}/> languages. Break language barriers effortlessly.
                        </p>
                    </div>

                </div>

            </div>
        </section>

      

        <section
            class="tw-flex tw-min-h-[100vh] tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-p-[2%]"
        >
            <h3
                class="reveal-up tw-text-4xl tw-font-medium tw-text-center max-md:tw-text-2xl"
            >
                Join the professionals using FireChat
            </h3>
           
            <div
                class="tw-mt-20 tw-gap-10 tw-space-y-8  max-md:tw-columns-1 lg:tw-columns-2 xl:tw-columns-3"
            >
                <div
                    class="reveal-up tw-flex tw-h-fit tw-w-[350px] tw-break-inside-avoid 
                        tw-flex-col tw-gap-4 tw-rounded-lg tw-border-[1px] 
                        tw-bg-[#f6f7fb] dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-4 max-lg:tw-w-[320px]"
                >   

                    <div class="tw-flex tw-place-items-center tw-gap-3">
                        <div
                            class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full"
                        >
                            <img
                                src="/akhil.jpeg"
                                class="tw-h-full tw-w-full tw-object-cover"
                                alt="man"
                            />
                        </div>
                        <div class="tw-flex tw-flex-col tw-gap-1">
                            <div class="tw-font-semibold">Akhil R</div>
                            <div class="tw-text-gray-700 dark:tw-text-gray-300">Tech Lead, Infosys</div>
                        </div>
                    </div>

                    <p class="tw-mt-4 tw-text-gray-800 dark:tw-text-gray-200">
                    FireChat has transformed how our team communicates. The real-time translation feature helps us collaborate seamlessly with global teams. The interface is intuitive and the security features give us peace of mind
                    </p>
                </div>

                 <div
                    class="reveal-up tw-flex tw-h-fit tw-w-[350px] tw-break-inside-avoid 
                        tw-flex-col tw-gap-4 tw-rounded-lg tw-border-[1px] 
                        tw-bg-[#f6f7fb] dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-4 max-lg:tw-w-[320px]"
                >   

                    <div class="tw-flex tw-place-items-center tw-gap-3">
                        <div
                            class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full"
                        >
                            <img
                                src="/assets/images/people/man2.jpg"
                                class="tw-h-full tw-w-full tw-object-cover"
                                alt="women"
                            />
                        </div>
                        <div class="tw-flex tw-flex-col tw-gap-1">
                            <div class="tw-font-semibold">Trich B</div>
                            <div class="tw-text-gray-700 dark:tw-text-gray-300">AMI, ceo</div>
                        </div>
                    </div>

                    <p class="tw-mt-4 tw-text-gray-800 dark:tw-text-gray-200">
                    The group chat features are incredible! Creating and managing multiple communities has never been easier. The smart notifications keep me focused on what matters
                    </p>
                </div>

                 <div
                    class="reveal-up tw-flex tw-h-fit tw-w-[350px] tw-break-inside-avoid 
                        tw-flex-col tw-gap-4 tw-rounded-lg tw-border-[1px] 
                        tw-bg-[#f6f7fb] dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-4 max-lg:tw-w-[320px]"
                >   

                    <div class="tw-flex tw-place-items-center tw-gap-3">
                        <div
                            class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full"
                        >
                            <img
                                src="/hari.jpg"
                                class="tw-h-full tw-w-full tw-object-contain"
                                alt="man"
                            />
                        </div>
                        <div class="tw-flex tw-flex-col tw-gap-1">
                            <div class="tw-font-semibold">Hari</div>
                            <div class="tw-text-gray-700 dark:tw-text-gray-300">Benz, ceo</div>
                        </div>
                    </div>

                    <p class="tw-mt-4 tw-text-gray-800 dark:tw-text-gray-200">
                    The video calling quality is exceptional, and the smart notifications keep me updated without being overwhelming. FireChat has become an essential part of our daily communication workflow
                    </p>
                </div>

                 <div
                    class="reveal-up tw-flex tw-h-fit tw-w-[350px] tw-break-inside-avoid 
                        tw-flex-col tw-gap-4 tw-rounded-lg tw-border-[1px] 
                        tw-bg-[#f6f7fb] dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-4 max-lg:tw-w-[320px]"
                >   

                    <div class="tw-flex tw-place-items-center tw-gap-3">
                        <div
                            class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full"
                        >
                            <img
                                src="/viswa.jpeg"
                                class="tw-h-full tw-w-full tw-object-cover"
                                alt="man"
                            />
                        </div>
                        <div class="tw-flex tw-flex-col tw-gap-1">
                            <div class="tw-font-semibold">Vishwa</div>
                            <div class="tw-text-gray-700 dark:tw-text-gray-300">XZ tech, cto</div>
                        </div>
                    </div>

                    <p class="tw-mt-4 tw-text-gray-800 dark:tw-text-gray-200">
                    The community features are fantastic! I've connected with amazing professionals and the file sharing capabilities make collaboration effortless. The end-to-end encryption gives us confidence in sharing sensitive information.
                    </p>
                </div>

                 <div
                    class="reveal-up tw-flex tw-h-fit tw-w-[350px] tw-break-inside-avoid 
                        tw-flex-col tw-gap-4 tw-rounded-lg tw-border-[1px] 
                        tw-bg-[#f6f7fb] dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-4 max-lg:tw-w-[320px]"
                >   

                    <div class="tw-flex tw-place-items-center tw-gap-3">
                        <div
                            class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full"
                        >
                            <img
                                src="/assets/images/people/women.jpg"
                                class="tw-h-full tw-w-full tw-object-cover"
                                alt="women"
                            />
                        </div>
                        <div class="tw-flex tw-flex-col tw-gap-1">
                            <div class="tw-font-semibold">Rachel</div>
                            <div class="tw-text-gray-700 dark:tw-text-gray-300">Gem, cto</div>
                        </div>
                    </div>

                    <p class="tw-mt-4 tw-text-gray-800 dark:tw-text-gray-200">
                    The real-time translation feature is a game-changer for our global team. We can communicate effortlessly across languages while maintaining perfect clarity!
                    </p>
                </div>

                 <div
                    class="reveal-up tw-flex tw-h-fit tw-w-[350px] tw-break-inside-avoid 
                        tw-flex-col tw-gap-4 tw-rounded-lg tw-border-[1px] 
                        tw-bg-[#f6f7fb] dark:tw-bg-[#080808] dark:tw-border-[#1f2123] tw-p-4 max-lg:tw-w-[320px]"
                >   

                    <div class="tw-flex tw-place-items-center tw-gap-3">
                        <div
                            class="tw-h-[50px] tw-w-[50px] tw-overflow-hidden tw-rounded-full"
                        >
                            <img
                                src="/assets/images/people/man.jpg"
                                class="tw-h-full tw-w-full tw-object-cover"
                                alt="man"
                            />
                        </div>
                        <div class="tw-flex tw-flex-col tw-gap-1">
                            <div class="tw-font-semibold">Jamie</div>
                            <div class="tw-text-gray-700 dark:tw-text-gray-300">SnapFist.ai, ceo</div>
                        </div>
                    </div>

                    <p class="tw-mt-4 tw-text-gray-800 dark:tw-text-gray-200">
                    FireChat's end-to-end encryption gives us complete confidence in our communications. The multimedia sharing is smooth, and the interface is super intuitive!
                    </p>
                </div>
               
            </div>
        </section>


       
        <section
            class="tw-mt-5 tw-flex tw-min-h-[80vh] tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-p-[2%] max-lg:tw-p-3" id="blog"
        >
            <h3
                class="reveal-up tw-text-4xl tw-font-medium max-md:tw-text-2xl"
            >
                Read resources by experts ✨
            </h3>
      
        
            <div
                class="reveal-up tw-mt-10 tw-flex tw-flex-wrap tw-place-content-center tw-gap-10 max-lg:tw-flex-col"
            >
                <a
                    href="https://dev.to/alex7842/working-of-real-time-chat-application-using-firebase-ahh" target="_blank"
                    class="tw-flex tw-h-[500px] tw-w-[400px] tw-flex-col tw-gap-2 tw-overflow-clip tw-rounded-lg tw-p-4 max-lg:tw-w-[350px]"
                >
                    <div
                        class="tw-h-[350px] tw-min-h-[350px] tw-w-full tw-overflow-hidden tw-rounded-2xl"
                    >
                        <img
                            src="/assets/images/home/article1.png"
                            alt="article image"
                            class="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-700 hover:tw-scale-[1.3]"
                            srcset=""
                        />
                    </div>

                    <div class="tw-text-gray-600 dark:tw-text-gray-300 tw-justify-between tw-flex tw-gap-2">
                        <div class="tw-text-gray-800 dark:tw-text-gray-200">
                            Tools
                        </div>
                        <div class="tw-text-gray-600 dark:tw-text-gray-400">
                           Dec 2, 2024
                        </div>
                    </div>
                    <h3
                        class="tw-mt-1 tw-font-medium tw-text-xl max-md:tw-text-xl"
                    >
                        How Chat Works?
                    </h3>
                    
                </a>
                
                <a
                    href="https://dev.to/alex7842/firechat-user-guide-2914" target="_blank"
                    class="tw-flex tw-h-[500px] tw-w-[400px] tw-flex-col tw-gap-2 tw-overflow-clip tw-rounded-lg tw-p-4 max-lg:tw-w-[350px]"
                >
                    <div
                        class="tw-h-[350px] tw-min-h-[350px] tw-w-full tw-overflow-hidden tw-rounded-2xl"
                    >
                        <img
                            src="/assets/images/home/article2.jpg"
                            alt="article image"
                            class="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-700 hover:tw-scale-[1.3]"
                            srcset=""
                        />
                    </div>

                    <div class="tw-text-gray-600 dark:tw-text-gray-300 tw-justify-between tw-flex tw-gap-2">
                        <div class="tw-text-gray-800 dark:tw-text-gray-200">
                            Announcement
                        </div>
                        <div class="tw-text-gray-600 dark:tw-text-gray-400">
                            Nov 25 , 2024
                        </div>
                    </div>
                    <h3
                        class="tw-mt-1 tw-font-medium tw-text-xl max-md:tw-text-xl"
                    >
                        FireChat Unveils new technology
                    </h3>
                    
                </a>

                <a
                    href="https://dev.to/alex7842/firechat-technical-documentation-5811" target="_blank"
                    class="tw-flex tw-h-[500px] tw-w-[400px] tw-flex-col tw-gap-2 tw-overflow-clip tw-rounded-lg tw-p-4 max-lg:tw-w-[350px]"
                >
                    <div
                        class="tw-h-[350px] tw-min-h-[350px] tw-w-full tw-overflow-hidden tw-rounded-2xl"
                    >
                        <img
                            src="/assets/images/home/article3.png"
                            alt="article image"
                            class="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-700 hover:tw-scale-[1.3]"
                            srcset=""
                        />
                    </div>

                    <div class="tw-text-gray-600 dark:tw-text-gray-300 tw-justify-between tw-flex tw-gap-2">
                        <div class="tw-text-gray-800 dark:tw-text-gray-200">
                          Technical Document
                        </div>
                        <div class="tw-text-gray-600 dark:tw-text-gray-400">
                           Oct, 27, 2024
                        </div>
                    </div>
                    <h3
                        class="tw-mt-1 tw-font-medium tw-text-xl max-md:tw-text-xl"
                    >
                        How to Use?
                    </h3>
                    
                </a>

            </div>
        </section>

        <section
            class="tw-relative tw-flex tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-gap-[10%] tw-p-[5%] tw-px-[10%]"
        >   


            <h3
                class="tw-text-4xl tw-font-medium max-md:tw-text-2xl"
            >
                Frequently Asked Questions
            </h3>
            <div
                class="tw-mt-5 tw-flex tw-min-h-[300px] tw-w-full tw-max-w-[850px] tw-flex-col tw-gap-4"
            >
                <div
                    class="faq tw-w-full"
                >
                    <h4
                        class="faq-accordion tw-flex tw-w-full tw-select-none tw-text-xl max-md:tw-text-lg"
                    >
                        <span>What is FireChat?</span>
                        <i class="bi bi-plus tw-text-xl tw-origin-center tw-duration-300 tw-transition-transform 
                                    tw-ml-auto tw-font-semibold"></i>
                    </h4>
                    <div class="content max-lg:tw-text-sm">
                    FireChat is a powerful real-time messaging platform that connects you with friends, communities, and professional networks. It offers secure messaging, HD video calls, and smart group management features.

                    </div>
                </div>
                <hr/>
                <div
                    class="faq tw-w-full"
                >
                    <h4
                        class="faq-accordion tw-flex tw-w-full tw-select-none tw-text-xl max-md:tw-text-lg"
                    >
                        <span>What makes FireChat different?</span>
                        <i class="bi bi-plus tw-text-xl tw-origin-center tw-duration-300 tw-transition-transform 
                                    tw-ml-auto tw-font-semibold"></i>
                    </h4>
                    <div class="content max-lg:tw-text-sm">
                    FireChat stands out with its real-time translation, end-to-end encryption, and smart community features. Our platform supports unlimited group sizes, HD video calls, and seamless file sharing across devices.
                    </div>
                </div>
                <hr/>
                <div
                    class="faq tw-w-full"
                >
                    <h4
                        class="faq-accordion tw-flex tw-w-full tw-select-none tw-text-xl max-md:tw-text-lg"
                    >
                        <span>How many people can join a group?</span>
                        <i class="bi bi-plus tw-text-xl tw-origin-center tw-duration-300 tw-transition-transform 
                                    tw-ml-auto tw-font-semibold"></i>
                    </h4>
                    <div class="content max-lg:tw-text-sm">
                    Free users can create groups with up to 100 members. Professional plans support 500+ members, while Enterprise users enjoy unlimited group sizes with advanced management features.
                    </div>
                </div>
                <hr/>

                <div
                    class="faq tw-w-full"
                >
                    <h4
                        class="faq-accordion tw-flex tw-w-full tw-select-none tw-text-xl max-md:tw-text-lg"
                    >
                        <span>Is FireChat secure?</span>
                        <i class="bi bi-plus tw-text-xl tw-origin-center tw-duration-300 tw-transition-transform 
                                    tw-ml-auto tw-font-semibold"></i>
                    </h4>
                    <div class="content max-lg:tw-text-sm">
                    Yes! FireChat uses Advance end-to-end encryption for all messages and calls. Your privacy is our priority, with additional security features available in Professional and Enterprise plans.
                    </div>
                </div>
                <hr/>
                
            </div>
            <div class="purple-bg-grad max-md:tw-hidden reveal-up tw-absolute tw-bottom-14 tw-right-[20%] 
                                 tw-h-[150px] tw-w-[150px] tw-rounded-full"
                ></div>
           
        </section>

        <section
            class="tw-relative tw-flex tw-p-2  tw-w-full tw-min-h-[60vh]  tw-flex-col tw-place-content-center tw-place-items-center tw-overflow-hidden"
        >   
             <div class="reveal-up tw-w-full tw-h-full tw-min-h-[450px] max-lg:tw-max-w-full tw-rounded-md lg:tw-py-[5%] tw-bg-[#f6f7fb] dark:tw-bg-[#171717] tw-place-content-center tw-items-center 
                        tw-flex tw-flex-col tw-max-w-[80%] tw-gap-4 tw-p-4">
               
                <h3 class="reveal-up tw-text-5xl tw-font-medium max-md:tw-text-3xl tw-text-center tw-leading-normal">
                Connect and Chat with Your World
                </h3>
              
                <div class="tw-mt-8 tw-relative tw-flex max-lg:tw-flex-col tw-gap-5" onClick={signin}>

                    <a class="btn  reveal-up !tw-rounded-full !tw-p-4 tw-font-medium">
                        Start Now
                    </a>
                </div>

            </div>
        </section>

        <section
            class="tw-flex tw-w-full tw-flex-col tw-place-content-center tw-place-items-center tw-gap-[10%] tw-p-[5%] tw-px-[10%] max-md:tw-px-2"
        >
            <div
                class="tw-flex tw-w-full tw-max-w-[80%] tw-place-content-center tw-place-items-center tw-justify-between tw-gap-3 
                        tw-rounded-lg tw-bg-[#F6F7FB] dark:tw-bg-[#171717] tw-p-6 max-md:tw-max-w-full max-md:tw-flex-col"
            >
                <div class="tw-flex tw-flex-col max-lg:tw-text-center tw-gap-1">
                    <h2 class="tw-text-2xl tw-text-gray-800 dark:tw-text-gray-200 max-md:tw-text-xl">
                        Join our newsletter
                    </h2>
                    <div class="tw-text-gray-700 dark:tw-text-gray-300">Get product insights and updates.</div>
                </div>

                <div
                    class="tw-flex tw-h-[60px] tw-place-items-center tw-gap-2 tw-overflow-hidden tw-p-2"
                >
                    <input
                        type="email"
                        class="input tw-h-full tw-w-full !tw-border-gray-600 tw-p-2 tw-outline-none"
                        placeholder="email"
                    />
                    <a
                        class="btn !tw-rounded-full !tw-border-[1px] !tw-text-black !tw-border-solid !tw-border-black  dark:!tw-text-white
                            dark:!tw-border-gray-300 !tw-bg-transparent tw-transition-colors tw-duration-[0.3s]"
                        href=""
                    >
                        Signup
                    </a>
                </div>
            </div>
        </section>

        <footer
            class="tw-mt-auto tw-flex tw-flex-col tw-w-full tw-gap-4 tw-text-sm tw-pt-[5%] tw-pb-10 tw-px-[10%] 
                    tw-text-black dark:tw-text-white max-md:tw-flex-col" id="footer"
        >
            <div class="tw-flex max-md:tw-flex-col max-md:tw-gap-6 tw-gap-3 tw-w-full tw-place-content-around">
                <div
                    class="tw-flex tw-h-full tw-w-[250px] tw-flex-col tw-place-items-center tw-gap-6 max-md:tw-w-full"
                >   
                    <a href="#" class="tw-w-full tw-place-items-center tw-flex tw-flex-col tw-gap-6">
                        <img
                            src="/logo3.png"
                            alt="logo"
                            srcset=""
                            class="tw-max-w-[120px] dark:tw-invert"
                        />
                        <div class="tw-max-w-[120px] tw-text-center tw-text-3xl tw-h-fit">
                        FireChat
                        </div>
                    </a>
                   
                    <div class="tw-flex tw-gap-4 tw-text-lg">
                        <a
                            href="https://github.com/alex7842/" target="_BLANK"
                            aria-label="Github"
                        >
                            <i class="bi bi-github"></i>
                        </a>
                        <a
                            href="https://x.com/ALEX_444777" target="_BLANK"
                            aria-label="Twitter"
                        >
                            <i class="bi bi-twitter"></i>
                        </a>
                      
                        <a
                            href="https://www.linkedin.com/in/alex7842/" target="_BLANK"
                            aria-label="Linkedin"
                        >
                            <i class="bi bi-linkedin"></i>
                        </a>
                    </div>

                </div>

                <div class="tw-flex max-md:tw-flex-col tw-flex-wrap tw-gap-6 tw-h-full tw-w-full tw-justify-around">
                    <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
                        <h2 class="tw-text-xl">Links</h2>
                        <div class="tw-flex tw-flex-col tw-gap-3">
                            <a href="https://dev.to/alex7842/firechat-user-guide-2914" target="_blank" class="footer-link">Getting started</a>
                            <a href="https://dev.to/alex7842/firechat-technical-documentation-5811" target="_blank" class="footer-link">Docs</a>
                            <a href="https://dev.to/alex7842/working-of-real-time-chat-application-using-firebase-ahh" target="_blank" class="footer-link">Blog</a>
                            <a href="#" class="footer-link" target="_blank">Terms and Policy</a>
                           
                        </div>
                    </div>


                    <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
                        <h2 class="tw-text-xl">Our Products</h2>
                        <div class="tw-flex tw-flex-col tw-gap-3">
                            <a href="https://www.chatpulse.dev" target='_Blank' class="footer-link">ChatPulse</a>
                            <a href="https://multi-gen-ai.vercel.app" target="_Blank" class="footer-link">MultiGen</a>
                            <a href="https://www.linkedin.com/posts/alex7842_forextrading-flutterapp-firebaseintegration-activity-7186990344738111489-Z7bN?utm_source=share&utm_medium=member_desktop" target='_Blank' class="footer-link">Fx Journal</a>
                            <a href="https://react-image-gallery21.netlify.app/" target="_blank" class="footer-link">Image Gallery</a>
                           
                        </div>
                    </div>

                    <div class="tw-flex tw-h-full tw-w-[200px] tw-flex-col tw-gap-4">
                        <h2 class="tw-text-xl">Contact</h2>
                        <div class="tw-flex tw-flex-col tw-gap-3">
                            <a href="#" class="footer-link">Address</a>
                            <a 
    href="mailto:alex1958229@gmail.com" 
    class="footer-link"
>
    Gmail
</a>

                            <a href="https://www.linkedin.com/in/alex7842/" class="footer-link">LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="tw-mt-8"/>
            <div class="tw-mt-2 tw-flex tw-gap-2 tw-flex-col tw-text-gray-700 dark:tw-text-gray-300 tw-place-items-center 
                    tw-text-[12px] tw-w-full tw-text-center tw-place-content-around">
                <span>Copyright &#169; 2024-2025</span>
                <span>All trademarks and copyrights belongs to FireChat</span>
            </div>

        </footer>
    </body>
    


    </>

  );
}

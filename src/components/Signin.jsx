import { Button, Flex, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add animation library

export const Signin = () => {
    const [pause, setPause] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        api.open({
            message: 'Welcome to FireChat! 🔥',
            description: 'Please login to start connecting with friends',
            showProgress: true,
            pause,
        });
    }, []);

    return (
        <>
            {contextHolder}
            <div className='tw-min-h-screen tw-bg-gradient-to-b tw-from-violet-50 tw-to-white dark:tw-from-gray-900 dark:tw-to-gray-800 tw-flex tw-items-center tw-justify-center'>
    <Flex vertical align='center' justify='center' className='tw-text-center tw-p-8 tw-rounded-2xl tw-bg-white/80 dark:tw-bg-gray-800/80 tw-backdrop-blur-md tw-shadow-xl tw-max-w-md tw-w-full tw-mx-auto'>
        <motion.img
            src="/logo3.png"
            alt="FirChat Logo"
            className='w-26 h-25 tw-mb-4 dark:tw-invert tw-mx-auto'
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.8 }}
        />
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='tw-w-full tw-flex tw-flex-col tw-items-center'
        >
           <Button
                type='primary'
                onClick={() => navigate("/")}
                className='tw-bg-violet-600 tw-hover:bg-violet-700 tw-h-12 tw-px-8 tw-text-lg'
                size='large'
            >
                Sign In
            </Button>
            <h1 className='tw-text-3xl tw-font-bold tw-mb-2 tw-text-violet-600 dark:tw-text-violet-400'>FireChat</h1>
            <p className='tw-text-gray-600 dark:tw-text-gray-300 tw-mb-2'>You're not logged in yet</p>
            <p className='tw-text-gray-600 dark:tw-text-gray-300 tw-mb-6'>Join the conversation today! ✨</p>
            
           
        </motion.div>
    </Flex>
</div>

        </>
    );
};

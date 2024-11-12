"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const AnimatedList = React.memo(({
  className,
  children,
  delay = 1000
}) => {
  const [index, setIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    if (!animationComplete) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          if (prevIndex + 1 >= childrenArray.length) {
            clearInterval(interval);
            setAnimationComplete(true);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, delay);

      return () => clearInterval(interval);
    }
  }, [childrenArray.length, delay, animationComplete]);

  const itemsToShow = useMemo(() => 
    animationComplete ? childrenArray : childrenArray.slice(0, index + 1).reverse(), 
    [index, childrenArray, animationComplete]
  );

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <AnimatePresence>
        {itemsToShow.map((item) => (
          <AnimatedListItem key={item.key}>
            {item}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
});

AnimatedList.displayName = "AnimatedList";

// AnimatedListItem component remains the same


export function AnimatedListItem({
  children
}) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    (<motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>)
  );
}

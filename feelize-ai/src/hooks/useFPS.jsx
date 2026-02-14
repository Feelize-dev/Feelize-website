import { useEffect, useRef } from 'react';

export const useFPS = () => {
  const fpsRef = useRef(0);
  
  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = (currentTime) => {
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        fpsRef.current = Math.round((frames * 1000) / (currentTime - lastTime));
        console.log(`FPS: ${fpsRef.current}`);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }, []);
  
  return fpsRef.current;
};
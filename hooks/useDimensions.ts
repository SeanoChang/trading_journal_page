import { useState, useEffect, useRef } from 'react';

export interface UseDimensionsOptions {
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface DimensionsHook {
  dimensions: { width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useDimensions = ({
  defaultWidth = 900,
  defaultHeight = 600,
}: UseDimensionsOptions = {}): DimensionsHook => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ 
    width: defaultWidth, 
    height: defaultHeight 
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({
          width: offsetWidth || defaultWidth,
          height: offsetHeight || defaultHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [defaultWidth, defaultHeight]);

  return {
    dimensions,
    containerRef,
  };
};

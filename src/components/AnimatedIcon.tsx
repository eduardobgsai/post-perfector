import React, { useEffect, useState } from 'react';
import LottieDefault from 'lottie-react';
import { cn } from '@/lib/utils';

const Lottie = (LottieDefault as any).default || LottieDefault;

export interface AnimatedIconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'name'> {
  name: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function AnimatedIcon({ 
  name, 
  className, 
  loop = true,
  autoplay = true,
  ...props 
}: AnimatedIconProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`/icons/${name}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Icon not found");
        return res.json();
      })
      .then(data => {
        if (isMounted) setAnimationData(data);
      })
      .catch(err => console.error(`Failed to load icon ${name}`, err));

    return () => {
      isMounted = false;
    };
  }, [name]);

  if (!animationData) {
    // Render a placeholder with the same dimensions while loading
    return <div className={cn("inline-block w-4 h-4", className)} {...props} />;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={cn("inline-block w-4 h-4", className)}
      {...props as any}
    />
  );
}

// import Image from 'next/image';
// import { useState, useCallback, useMemo, memo } from 'react';

// interface CloudinaryImageProps {
//   src: string;
//   alt: string;
//   width: number;
//   height: number;
//   className?: string;
//   fallbackSrc?: string;
//   priority?: boolean;
// }

// const CloudinaryImage = memo(({
//   src,
//   alt,
//   width,
//   height,
//   className = '',
//   fallbackSrc = '/default-avatar.png',
//   priority = false
// }: CloudinaryImageProps) => {
//   const [imgSrc, setImgSrc] = useState(src);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   // Memoize URL optimization to prevent recalculation
//   const optimizedSrc = useMemo(() => {
//     const optimizeCloudinaryUrl = (url: string): string => {
//       if (!url || !url.includes('cloudinary.com')) return url;
      
//       try {
//         const urlParts = url.split('/upload/');
//         if (urlParts.length !== 2) return url;

//         const transformations = [
//           `w_${width * 2}`,
//           `h_${height * 2}`,
//           'c_fill',
//           'g_face',
//           'q_auto',
//           'f_auto',
//           'dpr_auto'
//         ].join(',');

//         return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
//       } catch {
//         return url;
//       }
//     };

//     return src ? optimizeCloudinaryUrl(src) : fallbackSrc;
//   }, [src, width, height, fallbackSrc]);

//   // Memoize error handler to prevent recreation on each render
//   const handleError = useCallback(() => {
//     if (!hasError) {
//       setHasError(true);
//       setImgSrc(fallbackSrc);
//       setIsLoading(false);
//     }
//   }, [hasError, fallbackSrc]);

//   // Memoize load handler to prevent recreation on each render
//   const handleLoad = useCallback(() => {
//     setIsLoading(false);
//   }, []);

//   return (
//     <div className="relative" style={{ width, height }}>
//       {isLoading && (
//         <div
//           className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"
//           style={{ width, height }}
//         />
//       )}
//       <Image
//         alt={alt}
//         src={imgSrc || fallbackSrc}
//         width={width}
//         height={height}
//         className={`rounded-full object-cover transition-opacity duration-300 ${
//           isLoading ? 'opacity-0' : 'opacity-100'
//         } ${className}`}
//         onError={handleError}
//         onLoad={handleLoad}
//         priority={priority}
//         loading={priority ? undefined : 'lazy'}
//       />
//     </div>
//   );
// });

// CloudinaryImage.displayName = 'CloudinaryImage';

// export default CloudinaryImage;

import Image from 'next/image';
import { useState, useCallback, useMemo, memo, useEffect } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

const CloudinaryImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/default-avatar.png',
  priority = false
}: CloudinaryImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Memoize URL optimization
  const optimizedSrc = useMemo(() => {
    const optimizeCloudinaryUrl = (url: string): string => {
      // Return fallback if URL is empty or invalid
      if (!url || typeof url !== 'string') return fallbackSrc;
      if (!url.includes('cloudinary.com')) return url;
      
      try {
        const urlParts = url.split('/upload/');
        if (urlParts.length !== 2) return url;

        const transformations = [
          `w_${width * 2}`,
          `h_${height * 2}`,
          'c_fill',
          'g_face',
          'q_auto',
          'f_auto',
          'dpr_auto'
        ].join(',');

        return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
      } catch {
        return url;
      }
    };

    // Use fallback if src is empty/falsy
    return src && src.trim() ? optimizeCloudinaryUrl(src) : fallbackSrc;
  }, [src, width, height, fallbackSrc]);

  // Reset loading and error states when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [optimizedSrc]);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
    }
  }, [hasError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Use fallback if there's an error, otherwise use optimizedSrc
  const finalSrc = hasError ? fallbackSrc : optimizedSrc;

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"
          style={{ width, height }}
        />
      )}
      <Image
        alt={alt}
        src={finalSrc}
        width={width}
        height={height}
        className={`rounded-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        unoptimized={!finalSrc.includes('cloudinary.com')}
      />
    </div>
  );
});

CloudinaryImage.displayName = 'CloudinaryImage';

export default CloudinaryImage;
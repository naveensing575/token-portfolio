import React, { useState, useEffect } from "react";

interface TokenImageProps {
  src: string;
  alt: string;
  symbol: string;
  className?: string;
}

const TokenImage: React.FC<TokenImageProps> = ({
  src,
  alt,
  symbol,
  className = "w-8 h-8 rounded-full"
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setImageError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      const fallbackUrl = `https://assets.coingecko.com/coins/images/1/large/${symbol.toLowerCase()}.png`;
      setCurrentSrc(fallbackUrl);
    } else {
      setCurrentSrc('');
    }
  };

  if (imageError && !currentSrc) {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-gray-500'
    ];
    const colorIndex = symbol.charCodeAt(0) % colors.length;

    return (
      <div className={`${className} ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-xs`}>
        {symbol.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default TokenImage;
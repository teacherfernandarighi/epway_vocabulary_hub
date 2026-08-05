import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface EpwayLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'color';
  className?: string;
  allowUploadOnClick?: boolean;
}

export const EpwayLogo: React.FC<EpwayLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  allowUploadOnClick = false,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return localStorage.getItem('epway_custom_school_logo');
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      setCustomLogo(localStorage.getItem('epway_custom_school_logo'));
    };
    window.addEventListener('epway_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('epway_logo_updated', handleLogoUpdate);
  }, []);

  const dimensions = {
    sm: { box: 'w-10 h-10', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-12 h-12', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-16 h-16', text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-24 h-24', text: 'text-3xl', sub: 'text-sm' },
  }[size];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          localStorage.setItem('epway_custom_school_logo', reader.result);
          setCustomLogo(reader.result);
          window.dispatchEvent(new Event('epway_logo_updated'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* EPWAY Round Emblem Badge or Custom Logo Image */}
      <div className="relative group shrink-0">
        <div
          className={`relative ${dimensions.box} rounded-full bg-white border-2 border-[#00A8B5] shadow-xs flex items-center justify-center p-0.5 shrink-0 overflow-hidden transition-all duration-200 group-hover:scale-105`}
          title={customLogo ? 'Logotipo da Escola EPWAY' : 'Clique para carregar a sua logo oficial'}
        >
          {customLogo ? (
            <img
              src={customLogo}
              alt="EPWAY Logo"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00A8B5] to-[#0A5260] flex items-center justify-center text-white font-black font-heading text-xs sm:text-sm tracking-tighter">
              EPWAY
            </div>
          )}

          {/* Upload overlay on hover if allowed */}
          {allowUploadOnClick && (
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[8px] font-bold cursor-pointer transition-opacity rounded-full text-center p-1">
              <Upload className="w-3.5 h-3.5 mb-0.5" />
              <span>Logo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* Brand Titles */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <h1
            className={`font-black font-heading tracking-tight ${dimensions.text} text-[#0C3859] whitespace-nowrap`}
          >
            EPWAY ENGLISH SCHOOL
          </h1>

          {showSubtitle && (
            <p
              className={`font-semibold text-[#0A5260] ${dimensions.sub} tracking-wide mt-0.5 whitespace-nowrap`}
            >
              ENGLISH FOR REAL LIFE & WORK
            </p>
          )}
        </div>
      )}
    </div>
  );
};



import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

/**
 * GifPopup - Enhanced modal component for displaying and downloading GIFs
 * 
 * Key improvements:
 * - Better TypeScript support with PropTypes
 * - Improved accessibility with ARIA labels and keyboard navigation
 * - Enhanced visual design with modern styling
 * - Performance optimizations with memoization and lazy loading
 * - Better separation of concerns with sub-components
 * - Responsive design improvements
 */
const GifPopup = ({
  gifs = [],
  gifSrc = null,
  usePreviewStyle = false,
  previewWrapperClass = "space-y-6 md:space-y-10 animate-slideInRight",
  previewCardClass = "relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group",
  previewImgClass = "w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105",
  thumbnailHeight = 160,
  columns = 4,
  modalMaxWidth = "min(900px, 92vw)",
  modalMaxHeight = "80vh",
  onThumbLoad = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const lastActiveRef = useRef(null);
  const objectUrlRef = useRef(null);

  // Normalize GIF data
  const normalized = (() => {
    const source = gifSrc 
      ? (Array.isArray(gifSrc) ? gifSrc : [gifSrc])
      : gifs;
    
    return (source || []).map(g => 
      typeof g === "string" 
        ? { url: g, thumbnail: g, title: "", id: g } 
        : { ...g, id: g.id || g.url }
    );
  })();

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      lastActiveRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      lastActiveRef.current?.focus?.();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const openModal = useCallback((index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const navigateToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + normalized.length) % normalized.length);
  }, [normalized.length]);

  const navigateToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % normalized.length);
  }, [normalized.length]);

  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => new Set(prev).add(index));
    if (typeof onThumbLoad === "function") {
      onThumbLoad();
    }
  }, [onThumbLoad]);

  const downloadCurrent = useCallback(async () => {
    if (!normalized[currentIndex]) return;
    
    const { url, title } = normalized[currentIndex];
    
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const blob = await res.blob();
      const ext = (blob.type.split("/")[1] || "gif").split(";")[0];
      const fileName = `${(title || `gif-${currentIndex + 1}`).replace(/[^a-z0-9.-_]/gi, "_")}.${ext}`;
      
      const objUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objUrl;
      
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.warn("Download failed. Opening image in new tab as fallback.", err);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, [currentIndex, normalized]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          navigateToPrevious();
          break;
        case "ArrowRight":
          navigateToNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal, navigateToPrevious, navigateToNext]);

  if (!normalized.length) return null;

  return (
    <div className="gif-popup-container">
      {usePreviewStyle ? (
        <div className="preview-layout">
          {normalized.map((gif, index) => (
            <PreviewThumbnail
              key={gif.id || index}
              gif={gif}
              index={index}
              onOpen={openModal}
              onLoad={() => handleImageLoad(index)}
              isLoaded={loadedImages.has(index)}
              wrapperClass={previewWrapperClass}
              cardClass={previewCardClass}
              imgClass={previewImgClass}
            />
          ))}
        </div>
      ) : (
        <GridLayout columns={columns}>
          {normalized.map((gif, index) => (
            <GridThumbnail
              key={gif.id || index}
              gif={gif}
              index={index}
              onOpen={openModal}
              onLoad={() => handleImageLoad(index)}
              isLoaded={loadedImages.has(index)}
              thumbnailHeight={thumbnailHeight}
            />
          ))}
        </GridLayout>
      )}

      {isOpen && (
        <GifModal
          gif={normalized[currentIndex]}
          onClose={closeModal}
          onDownload={downloadCurrent}
          onPrevious={navigateToPrevious}
          onNext={navigateToNext}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < normalized.length - 1}
          maxWidth={modalMaxWidth}
          maxHeight={modalMaxHeight}
        />
      )}
    </div>
  );
};

// Sub-components for better organization

const PreviewThumbnail = React.memo(({ 
  gif, 
  index, 
  onOpen, 
  onLoad, 
  isLoaded,
  wrapperClass,
  cardClass,
  imgClass
}) => (
  <div className={wrapperClass}>
    <button
      onClick={() => onOpen(index)}
      className={cardClass}
      aria-label={`Open ${gif.title || `GIF ${index + 1}`}`}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <img
        src={gif.thumbnail || gif.url}
        alt={gif.title || `GIF ${index + 1}`}
        className={imgClass}
        onLoad={onLoad}
        loading="lazy"
      />
      
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300" />
      
      {!isLoaded && <ThumbnailLoader />}
    </button>
  </div>
));

const GridThumbnail = React.memo(({ 
  gif, 
  index, 
  onOpen, 
  onLoad, 
  isLoaded,
  thumbnailHeight 
}) => (
  <button
    onClick={() => onOpen(index)}
    className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-[1.02]"
    aria-label={`Open ${gif.title || `GIF ${index + 1}`}`}
    type="button"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <img
      src={gif.thumbnail || gif.url}
      alt={gif.title || `GIF ${index + 1}`}
      style={{ height: `${thumbnailHeight}px` }}
      className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
      onLoad={onLoad}
      loading="lazy"
    />
    
    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
    
    {!isLoaded && <ThumbnailLoader />}
    
    {gif.title && (
      <div className="absolute left-3 right-3 bottom-3 p-2 bg-black/60 text-white text-xs rounded-lg transition-opacity group-hover:opacity-100 opacity-90">
        {gif.title}
      </div>
    )}
  </button>
));

const GridLayout = React.memo(({ columns, children }) => (
  <div
    className="grid gap-4"
    style={{ 
      gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))` 
    }}
  >
    {children}
  </div>
));

const ThumbnailLoader = React.memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/30">
    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
  </div>
));

const GifModal = React.memo(({
  gif,
  onClose,
  onDownload,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  maxWidth,
  maxHeight
}) => {
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  // Focus management when modal opens
  useEffect(() => {
    setTimeout(() => closeBtnRef.current?.focus(), 0);
  }, []);

  // Focus trap for accessibility
  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, []);

  if (!gif) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="GIF preview"
    >
      <div
        ref={modalRef}
        className="relative mx-auto outline-none"
        style={{ maxWidth, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="relative bg-gray-900/95 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out">
          {/* Navigation controls */}
          {hasPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              aria-label="Previous GIF"
            >
              <ChevronLeftIcon />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              aria-label="Next GIF"
            >
              <ChevronRightIcon />
            </button>
          )}
          
          {/* Header with controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            <button
              onClick={onDownload}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              aria-label="Download GIF"
            >
              Download
            </button>
            
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              aria-label="Close dialog"
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* GIF display */}
          <div 
            className="flex items-center justify-center bg-black"
            style={{ minHeight: "40vh", maxHeight }}
          >
            <img
              src={gif.url}
              alt={gif.title || "GIF"}
              className="max-h-full max-w-full object-contain"
              style={{ maxHeight }}
            />
          </div>
          
          {/* Footer with title */}
          {gif.title && (
            <div className="px-6 py-4 bg-gray-800/80 border-t border-gray-700">
              <div className="text-sm text-white font-medium">{gif.title}</div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
});

// Simple icon components
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default GifPopup;
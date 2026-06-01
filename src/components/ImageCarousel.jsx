/**
 * ImageCarousel Component
 *
 * A responsive and accessible image carousel with auto-scroll functionality.
 * Supports manual navigation via arrows and dots, and automatically restarts
 * the timer after manual interaction.
 *
 * Features:
 * - Auto-scroll with customizable interval
 * - Smooth slide transitions
 * - Navigation arrows and dot indicators
 * - Robust image URL filtering and fallback handling
 * - Restarts auto-scroll after manual navigation
 *
 * @author Fredrik Fordelsen & Bendik Viken Wangen
 * @version 1.1
 */

import { useState, useEffect, useMemo, useRef } from "react";
import "../styles/ImageCarousel.css";

function ImageCarousel({ images, autoScroll = true, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const imageArray = useMemo(() => {
    if (!images) return [];

    const arr = Array.isArray(images)
      ? images
      : Object.keys(images)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => images[key]);

    // Veldig åpen filter - aksepterer alle http-lenker
    const validImages = arr.filter(
      (url) =>
        typeof url === "string" && url.trim() !== "" && url.startsWith("https"),
    );

    console.log("🔥 RAW images from DB:", arr);
    console.log("✅ Valid images used:", validImages);

    return validImages;
  }, [images]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Go to next image
  const goToNext = () => {
    setCurrentIndex((prev) =>
      imageArray.length > 0 ? (prev + 1) % imageArray.length : 0,
    );
  };

  // Go to previous image
  const goToPrev = () => {
    setCurrentIndex((prev) =>
      imageArray.length > 0
        ? (prev - 1 + imageArray.length) % imageArray.length
        : 0,
    );
  };

  function progressCarousel() {
    goToNext();
  }

  // Start the auto-scroll timer if imageArray contains items
  function startTimer() {
    if (!autoScroll || imageArray.length <= 1) return;

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      progressCarousel();
    }, interval);
  }

  // Start the auto-scroll timer on component load, and clear the timer on component cleanup
  // Restarts the timer whenever the image carousel is progressed manually
  useEffect(() => {
    startTimer();

    return () => clearInterval(timerRef.current);
  }, [imageArray, autoScroll, interval, currentIndex]);

  if (imageArray.length === 0) {
    return <p>Ingen bilder tilgjengelig.</p>;
  }

  return (
    <div className="image-carousel">
      {/* Wrapper som holder både slides og piler */}
      <div className="carousel-wrapper">
        <div
          className="carousel-slides"
          style={{ "--current-index": currentIndex }}
        >
          {imageArray.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Bilde ${index + 1}`}
              className="carousel-image"
            />
          ))}
        </div>

        {/* Piler - må være utenfor slides */}
        {imageArray.length > 1 && (
          <>
            <button className="carousel-arrow left" onClick={goToPrev}>
              ❮
            </button>
            <button className="carousel-arrow right" onClick={goToNext}>
              ❯
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {imageArray.length > 1 && (
        <div className="carousel-dots">
          {imageArray.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => {
                setCurrentIndex(index);
                startTimer();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;

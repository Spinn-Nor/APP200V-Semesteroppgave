import { useState, useEffect, useMemo, useRef } from "react";
import "./ImageCarousel.css";

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
        typeof url === "string" &&
        url.trim() !== "" &&
        url.startsWith("https")
    );

    console.log("🔥 RAW images from DB:", arr);
    console.log("✅ Valid images used:", validImages);

    return validImages;
  }, [images]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  function progressCarousel() {
    setCurrentIndex((prev) =>
      imageArray.length > 0 ? (prev + 1) % imageArray.length : 0
    );
  }

  function startTimer() {
    if (!autoScroll || imageArray.length <= 1) return;

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      progressCarousel();
    }, interval);
  }

  useEffect(() => {
    startTimer();

    return () => clearInterval(timerRef.current);
  }, [imageArray, autoScroll, interval]);

  if (imageArray.length === 0) {
    return <p>Ingen bilder tilgjengelig.</p>;
  }

  return (
    <div className="image-carousel">
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

      {imageArray.length > 1 && (
        <div className="carousel-dots">
          {imageArray.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""
                }`}
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
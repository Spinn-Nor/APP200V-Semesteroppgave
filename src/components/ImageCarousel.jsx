import { useState, useEffect, useMemo } from "react";
import "./ImageCarousel.css";

function ImageCarousel({ images, autoScroll = true, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageArray = useMemo(() => {
    if (!images) return [];

    let arr = Array.isArray(images)
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

  useEffect(() => {
    if (!autoScroll || imageArray.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageArray.length);
    }, interval);

    return () => clearInterval(timer);
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
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;

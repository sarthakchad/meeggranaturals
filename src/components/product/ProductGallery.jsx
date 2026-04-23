import { useState } from "react";
export default function ProductGallery({ images = [], name }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (images.length === 0) return null;
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden border-2 transition-colors ${i === activeIndex ? "border-foreground" : "border-transparent"}`}>
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 aspect-[3/4] rounded-sm overflow-hidden bg-secondary/30">
        <img src={images[activeIndex]} alt={name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

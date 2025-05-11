import { useState, useEffect } from "react";
const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 4200);
  }, []);
  return (
    <div className="hero-section">
      <div className="container">
        <div className="row">
          <div className="hero-text">
            <h1>Binh Dan Hotel</h1>
            <p>
              Khách sạn Bình Dân cung cấp dịch vụ lưu trú chất lượng với giá cả
              phải chăng, là lựa chọn lý tưởng cho những ai muốn khám phá thành
              phố mà không lo về chi phí.
            </p>
          </div>
        </div>
      </div>
      <div className="hero-slider">
        <div
          className="hs-item"
          style={{
            backgroundImage: `url(${
              currentIndex === 0
                ? "/img/hero/hero-1.jpg"
                : currentIndex === 1
                ? "/img/hero/hero-2.jpg"
                : "/img/hero/hero-3.jpg"
            })`,
          }}
        ></div>
      </div>
    </div>
  );
};
export default Slider;

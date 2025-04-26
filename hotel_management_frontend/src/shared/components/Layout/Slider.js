const Slider = () => {
  return (
    <>
      <div className="hero-section">
        <div className="container">
          <div className="row">
            <div className="hero-text">
              <h1>Sona A Luxury Hotel</h1>
              <p>
                Here are the best hotel booking sites, including recommendations
                for international travel and for finding low-priced hotel rooms.
              </p>
            </div>
          </div>
        </div>
        <div className="hero-slider owl-carousel">
          <div
            className="hs-item set-bg"
            data-setbg="../../../public/img/hero/hero-1.jpg"
          />
          <div
            className="hs-item set-bg"
            data-setbg="../../../public/img/hero/hero-2.jpg"
          />
          <div
            className="hs-item set-bg"
            data-setbg="../../../public/img/hero/hero-3.jpg"
          />
        </div>
      </div>
    </>
  );
};
export default Slider;

import Slider from "../../../shared/components/Layout/Slider";

const About = () => {
  return (
    <>
      <Slider />
      <section className="aboutus-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="Khách Sạn Bình Dân"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <div className="section-title mb-3">
                <span className="fw-semibold">Về Chúng Tôi</span>
                <h2 className="fw-bold mt-2">
                  Binh Dan Hotel
                  <br />
                </h2>
                <h5>Trải Nghiệm Lưu Trú Tuyệt Vời</h5>
              </div>
              <p>
                Khách Sạn Bình Dân tự hào là lựa chọn hàng đầu cho những ai tìm
                kiếm nơi lưu trú chất lượng với giá cả phải chăng. Chúng tôi cam
                kết mang đến cho bạn trải nghiệm tuyệt vời mà không lo về chi
                phí.
              </p>
              <p>
                Đội ngũ nhân viên thân thiện, chuyên nghiệp luôn sẵn sàng phục
                vụ bạn 24/7. Dù bạn đang tìm kiếm một phòng đơn giản hay một
                không gian tiện nghi cho gia đình, chúng tôi đều có lựa chọn phù
                hợp cho bạn.
              </p>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <h3 className="fw-semibold mb-3">
                <i className="bi bi-stars text-warning me-2"></i>Tiện Nghi Đặc
                Biệt
              </h3>
              <ul className="list-unstyled ms-3">
                <li className="mb-2">
                  <i className="bi bi-wifi text-primary me-2"></i>Wifi miễn phí
                  toàn khách sạn
                </li>
                <li className="mb-2">
                  <i className="bi bi-cup-hot text-success me-2"></i>Bữa ăn đa
                  dạng
                </li>
                <li className="mb-2">
                  <i className="bi bi-bag-check text-secondary me-2"></i>Dịch vụ
                  giặt ủi, dọn phòng hằng ngày
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <h4 className="fw-semibold mb-3">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i>Địa Điểm
                Lý Tưởng
              </h4>
              <p>
                Khách Sạn Bình Dân nằm ở vị trí trung tâm, thuận tiện di chuyển
                đến các điểm du lịch nổi tiếng và khu mua sắm sôi động. Lý tưởng
                cho cả khách du lịch và doanh nhân.
              </p>
              <h4 className="fw-semibold mt-4 mb-3">
                <i className="bi bi-patch-check-fill text-success me-2"></i>Cam
                Kết Của Chúng Tôi
              </h4>
              <p>
                Chúng tôi cam kết mang đến cho bạn dịch vụ tốt nhất, trải nghiệm
                lưu trú đáng nhớ. Đội ngũ nhân viên luôn lắng nghe, đáp ứng mọi
                nhu cầu của khách hàng.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col text-center">
              <div
                className="alert alert-primary d-inline-block px-5 py-3 shadow-sm"
                role="alert"
              >
                Hãy đến với <strong>Khách Sạn Bình Dân</strong> để cảm nhận sự
                khác biệt và tận hưởng kỳ nghỉ đáng nhớ!
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

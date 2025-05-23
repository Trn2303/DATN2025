import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="footer-section">
        <div className="container">
          <div className="footer-text">
            <div className="row">
              <div className="col-lg-3">
                <div className="ft-about">
                  <h6>
                    <strong>Bình Dân Hotel</strong>
                  </h6>
                  <ul>
                    <li>Địa chỉ: 30A Trúc Lạc, Trúc Bạch, Ba Đình, Hà Nội</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ft-about">
                  <h6>Giới thiệu</h6>
                  <ul>
                    <Link to="/About" style={{ textDecoration: "none" }}>
                      <li>Về chúng tôi</li>
                    </Link>
                    <li>Quy định chung và lưu ý</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ft-contact">
                  <h6>Liên hệ</h6>
                  <ul>
                    <li>Hotline: +84 382 025 369</li>
                    <li>Email: binhdanhotel@gmail.com</li>
                    <li>Giờ làm việc: 08:00 - 22:00 hằng ngày</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ft-support">
                  <h6>Hỗ trợ khách hàng</h6>
                  <ul>
                    <li>Câu hỏi thường gặp</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

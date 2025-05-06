import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getServiceById,
  getReviewsService,
  createReviewService,
} from "../../services/Api";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState({});
  const [reviews, setReviews] = useState([]);
  const [inputReview, setInputReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const changeInputReview = (e) => {
    const { name, value } = e.target;
    setInputReview({ ...inputReview, [name]: value });
  };
  const clickSend = () => {
    createReviewService(id, inputReview)
      .then(({ data }) => {
        console.log(data);
        if (data.status === "success") {
          setInputReview({ name: "", rating: 0, comment: "" });
          getReviews(id);
        }
      })
      .catch((error) => console.log(error));
  };
  const getReviews = (id) => {
    getReviewsService(id, {})
      .then(({ data }) => setReviews(data.data.docs))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getServiceById(id, {})
      .then(({ data }) => setService(data.data))
      .catch((error) => console.log(error));
    getReviews(id);
  }, [id]);

  return (
    <div className="container py-5">
      {service ? (
        <div>
          {/* Thông tin dịch vụ */}
          <div className="row mb-5">
            <div className="col">
              <h1 className="mb-4">{service?.name}</h1>
              <p>{service?.description}</p>
              <h4 className="text-danger mb-4">
                {service?.price?.toLocaleString()}₫ / {service?.unit}
              </h4>
              <button
                className="btn btn-success mb-4"
                onClick={() => {
                  const user = localStorage.getItem("user");
                  if (!user) {
                    toast.warning("Vui lòng đăng nhập để đặt dịch vụ!");
                  } else {
                    navigate(`/BookingService-${service._id}`);
                  }
                }}
              >
                Đặt dịch vụ
              </button>
            </div>
          </div>

          {/* Đánh giá */}
          <div className="row">
            {/* Form đánh giá */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="card-title">Đánh giá dịch vụ</h4>
                  <form method="post">
                    <div className="mb-3">
                      <label className="form-label">Tên:</label>
                      <input
                        onChange={changeInputReview}
                        name="name"
                        required
                        type="text"
                        className="form-control"
                        value={inputReview.name}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Điểm đánh giá:</label>
                      <div className="btn-group mb-2" role="group">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() =>
                              setInputReview({ ...inputReview, rating: num })
                            }
                            className={`m-1 px-3 py-2 btn rounded-circle ${
                              inputReview.rating === num
                                ? "btn-warning text-white"
                                : "btn-outline-warning"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nội dung:</label>
                      <textarea
                        name="comment"
                        onChange={changeInputReview}
                        placeholder="Viết đánh giá của bạn..."
                        required
                        className="form-control"
                        rows="4"
                        value={inputReview.comment}
                      />
                    </div>

                    <button
                      onClick={clickSend}
                      type="button"
                      className="btn btn-primary"
                    >
                      Gửi
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Danh sách đánh giá gần đây */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h4 className="card-title">Các đánh giá gần đây</h4>
                  <div
                    className="overflow-auto mt-3"
                    style={{ maxHeight: "400px" }}
                  >
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => {
                        const m = moment(review.createdAt);
                        return (
                          <div key={index} className="card mb-3">
                            <div className="card-body">
                              <h5 className="card-title">
                                {review.name}
                                <span className="mx-3 badge bg-light text-dark">
                                  {review.rating} ⭐
                                </span>
                              </h5>
                              <h6 className="card-subtitle mb-2 text-muted">
                                {m.fromNow()}
                              </h6>
                              <p className="card-text">{review.comment}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>Chưa có đánh giá nào.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      ) : (
        <p>Đang tải thông tin dịch vụ...</p>
      )}
    </div>
  );
};

export default ServiceDetails;

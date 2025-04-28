import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById, getReviewsService } from "../../services/Api";
import moment from "moment";
const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState({});
  const [reviews, setReviews] = useState([]);
  const [inputReview, setInputReview] = useState({
    rating: 1,
    comment: ""
  });
  const changeInputReview = (e) => {
    const { name, value } = e.target;
    return setInputReview({ ...inputReview, [name]: value });
  }
  useEffect(() => {
    getServiceById({})
      .then(({ data }) => setService(data.data))
      .catch((error) => console.log(error)
      )
  }, []);
  return (
    <>
      <div className="service-details-container">
        {service ? (
          <div className="service-details">
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <p><strong>{service.price.toLocaleString()}₫ / {service.unit}</strong></p>
            <div className="reviews-section">
              <h3>Đánh giá</h3>
              <form method="post">
                <div>
                  <label>Tên: </label>
                  <input onChange={changeInputReview} name="name" required type="text" />
                </div>
                <div>
                  <label>Điểm đánh giá: </label>
                  <select
                    name="rating"
                    onChange={changeInputReview}
                    required
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
                <div>
                  <label>Nội dung: </label>
                  <textarea
                    name="comment"
                    onChange={changeInputReview}
                    placeholder="Viết đánh giá của bạn..."
                    required
                  />
                </div>
                <button type="submit">Gửi</button>
              </form>
              <div className="reviews-list">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => {
                    let m = moment(review.createdAt)
                    return (
                      <div key={index} className="review-item">
                        <p><strong>{review.user}</strong></p>
                        <p>{m.fromNow()}</p>
                        <p>{review.content}</p>
                        <p><em>Điểm: {review.rating}</em></p>
                      </div>
                    )
                  }
                  )
                ) : (
                  <p>Chưa có đánh giá nào.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin dịch vụ...</p>
        )}
      </div >
    </>
  )
};
export default ServiceDetails;
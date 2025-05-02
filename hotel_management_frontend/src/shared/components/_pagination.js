import { Link, useLocation, useSearchParams } from "react-router-dom";
const Pagination = ({ pages }) => {
  const { totalRows, page, limit, next, prev, hasNext, hasPrev } = pages;
  const totalPages = Math.ceil(totalRows / limit);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const formatUrl = (renderPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", renderPage);
    return `${location.pathname}?${newParams.toString()}`;
  };

  const renderPages = () => {
    const pagesIndex = [];
    const left = page - 1;
    const right = page + 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === page ||
        (i >= left && i <= right)
      ) {
        pagesIndex.push(i);
      } else if (i === left - 1 || i === right + 1) {
        pagesIndex.push("...");
      }
    }
    return pagesIndex;
  };
  return (
    <div className="pagination-container">
      <nav>
        <ul className="pagination justify-content-center">
          {hasPrev && (
            <li className="page-item">
              <Link className="page-link" to={formatUrl(prev)}>
                Trang trước
              </Link>
            </li>
          )}

          {renderPages().map((renderPage, index) =>
            renderPage === "..." ? (
              <li key={index} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li
                key={index}
                className={`page-item ${page === renderPage ? "active" : ""}`}
              >
                <Link className="page-link" to={formatUrl(renderPage)}>
                  {renderPage}
                </Link>
              </li>
            )
          )}

          {hasNext && (
            <li className="page-item">
              <Link className="page-link" to={formatUrl(next)}>
                Trang sau
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};
export default Pagination;

import { Link, useLocation, useSearchParams } from "react-router-dom";
const Pagination = ({ pages }) => {
  const { totalRows, page, limit, next, prev, hasNext, hasPrev } = pages;
  const totalPages = Math.ceil(totalRows / limit);
  const [searchParams, setSearchParams] = useSearchParams();
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
    <div className="pagination">
      {hasPrev && <Link to={formatUrl(prev)}>Trang trước</Link>}
      {renderPages().map((renderPage, index) =>
        renderPage === "..." ? (
          <span key={index} className="pagination-item">
            ...
          </span>
        ) : (
          <Link
            className={`${page === renderPage ? "active" : ""}`}
            to={formatUrl(renderPage)}
            key={index}
          >
            {renderPage}
          </Link>
        )
      )}
      {hasNext && <Link to={formatUrl(next)}>Trang sau</Link>}
    </div>
  );
};
export default Pagination;

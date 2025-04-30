import { Link, useSearchParams } from "react-router-dom";
const Pagination = ({ pages }) => {
  const { totalRows, page, limit, next, prev, hasNext, hasPrev } = pages;
  const totalPages = Math.ceil(totalRows / limit);
  const [searchParams, setSearchParams] = useSearchParams();
  const formatUrl = (renderPage) => {
    return `/Rooms?page=${renderPage}`;
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
      {renderPages().map((renderPage, index) => (
        <Link
          className={`${page === renderPage ? "active" : ""}`}
          to={formatUrl(renderPage)}
          key={index}
        >
          {renderPage}
        </Link>
      ))}
      {hasNext && <Link to={formatUrl(next)}>Trang sau</Link>}
    </div>
  );
};
export default Pagination;

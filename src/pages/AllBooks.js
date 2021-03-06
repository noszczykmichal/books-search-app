import { useEffect, useState, useContext, useRef } from "react";

import classes from './AllBooks.module.css'
import FindBookForm from "../components/books/FindBookForm/FindBookForm";
import BookList from "../components/books/BookList";
import TablePagination from "../components/ui/TablePagination/TablePagination";
import Preloader from "../components/ui/Preloader";
import GlobalContext from "../store/global-context";
import ErrorMessage from "../components/ui/ErrorMessage";

function AllBooks() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [isQuerySuccessful, setIsQuerySuccessful] = useState(false);
  const [totalBooksAvail, setTotalBooksAvail] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");

  const globalCtx = useContext(GlobalContext);

  const paginationArrowHandler = (buttonId) => {
    if (buttonId === "right") {
      return setCurrentPage((prevState) =>
        prevState !== Math.ceil(totalBooksAvail / 10)
          ? prevState + 1
          : Math.ceil(totalBooksAvail / 10)
      );
    } else {
      return setCurrentPage((prevState) =>
        prevState <= 1 ? 1 : prevState - 1
      );
    }
  };

  const paginationInputHandler = (event) => {
    const paginationInputValue = +event.target.value;

    if (
      paginationInputValue &&
      paginationInputValue > 0 &&
      paginationInputValue <= Math.ceil(totalBooksAvail / 10)
    ) {
      setCurrentPage(paginationInputValue);
    }
  };

  const searchHandler = (query) => {
    setCurrentPage(1);
    setCurrentQuery(query);
    setIsLoading(true);
    setLoadedData([]);
  };

  const takeToTop = useRef(globalCtx);

  useEffect(() => {
    let url = currentQuery ? `https://gnikdroy.pythonanywhere.com/api/book/?${currentQuery}&page=${currentPage}` : `https://gnikdroy.pythonanywhere.com/api/book/?page=${currentPage}`
    setIsLoading(true);

    fetch(`${url}`)
      .then((response) => {
        // console.log(response.json())
        if (!response.ok) {
          throw new Error("Sorry, We've run into issues. Please try again.");
        }
        return response.json();
      })
      .then((data) => {
        setTotalBooksAvail(data.count);
        const results = [...data.results];
        setIsLoading(false);
        setLoadedData(results);
        setIsQuerySuccessful(true);
        takeToTop.current.takeToTopPaginationArrows();
      })
      .catch((error) => {
        setIsQuerySuccessful(false);
        setIsLoading(false);
      });
  }, [currentPage, currentQuery]);

  return (
    <section className={classes['section']}>
      <h1>Let's find a good read for you.</h1>
      <FindBookForm onSearchHandler={searchHandler} />
      {isLoading && <Preloader />}
      {isQuerySuccessful && <BookList data={loadedData} />}
      {totalBooksAvail > 10 ? (
        <TablePagination
          totalPagesCount={Math.ceil(totalBooksAvail / 10)}
          value={currentPage}
          paginationArrowHandler={paginationArrowHandler}
          inputChangeHandler={paginationInputHandler}
        />
      ) : null}
      {!isLoading && !isQuerySuccessful && <ErrorMessage/>}
    </section>
  );
}

export default AllBooks;

import { useState, useEffect } from "react";

import BookList from "../components/books/BookList";

function BooksSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedBooks, setLoadedBooks]=useState([]);
  useEffect(() => {
    setIsLoading(true);
    fetch("https://gnikdroy.pythonanywhere.com/api/book/")
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        let currentlyLoaded=data.results;
        console.log(currentlyLoaded)
        setLoadedBooks(currentlyLoaded);
      });
  }, []);

  let currentContent;

  if (isLoading) {
    currentContent = <div>It's loading</div>;
  }else{
    currentContent= <BookList data={loadedBooks}/>
  }

  return (
    <div>
      <h1>Pick up something new to read:</h1>
      {currentContent}
    </div>
  );
}

export default BooksSearch;

import React, { useEffect, useRef, useState } from "react";
import Photo from "./Photo";
import "./style.css";
import { FaSearch } from "react-icons/fa";

const clientId = `?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`;
const photosUrl = `https://api.unsplash.com/photos/`;
const searchUrl = "https://api.unsplash.com/search/photos/";

const StockPhotos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [page, setPage] = useState(1);
  const mounted = useRef(false);
  const [newImages, setNewImages] = useState(true);

  const fetchImages = async () => {
    setIsLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${userInput}`;

    if (userInput) {
      url = `${searchUrl}${clientId}${urlPage}${urlQuery}`;
    } else {
      url = `${photosUrl}${clientId}${urlPage}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      setPhotos((oldPhotos) => {
        if (userInput && page === 1) {
          return data.results;
        } else if (userInput) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (isLoading) return;
    setPage((oldPage) => oldPage + 1);
  }, [newImages]);

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event);
  }, []);

  // useEffect(() => {
  //   const event = window.addEventListener("scroll", () => {
  //     if (
  //       !isLoading &&
  //       window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
  //     ) {
  //       setPage((oldPage) => oldPage + 1);
  //     }
  //   });
  //   return () => window.removeEventListener("scroll", event);
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput) return;
    if (page === 1) {
      fetchImages();
      return;
    }
    setPage(1);
  };
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text "
            placeholder="search"
            className="form-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image) => {
            return <Photo key={image.id} {...image} />;
          })}
        </div>
        {isLoading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
};

export default StockPhotos;

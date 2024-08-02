import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

let prevClickIDs = [];

function ConnectToGiphy({ setSearchResults, gameSize, searchQuery }) {
  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=iE1kjbuVCa8u2qZijWDthRFluXbARsLK&q=${searchQuery}&limit=${gameSize}`;
        const response = await fetch(url);
        const result = await response.json();
        setSearchResults(result.data);
      } catch (error) {
        console.error("Failed to fetch gifs: ", error);
        setSearchResults([]);
      }
    };

    fetchGifs();
    console.log("Called Fetch");
  }, [gameSize, searchQuery, setSearchResults]);

  return null;
}

function App() {
  const [gameSize, setGameSize] = useState(10);
  const [scoreData, setScoreData] = useState(0);
  const [searchQuery, setSearchQuery] = useState("pugs");
  const [searchResults, setSearchResults] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const isInitialMount = useRef(true);

  const notify = () =>
    toast("Game ended with: " + scoreData + " points scored!");

  const debouncingTimeout = useRef(null);

  useEffect(() => {
    if (debouncingTimeout.current) {
      clearTimeout(debouncingTimeout.current);
    }

    debouncingTimeout.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      if (debouncingTimeout.current) {
        clearTimeout(debouncingTimeout.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    // Skip the first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      handleGameEnd(false);
    }
  }, [debouncedSearchQuery]);

  function handleClick(id) {
    if (prevClickIDs.includes(id)) {
      handleGameEnd(true);
    } else {
      prevClickIDs.push(id);
      setScoreData((prevScore) => prevScore + 1);
      setSearchResults((prevSearch) => ShuffleArray(prevSearch));
    }
    console.log(scoreData);
  }

  function handleGameEnd(showToast) {
    if (showToast) {
      notify();
    }
    setScoreData(0);
    prevClickIDs = [];
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      setDebouncedSearchQuery(searchQuery);
    }
  }

  function handleBlur() {
    setDebouncedSearchQuery(searchQuery);
  }

  return (
    <>
      <div className="PageWrapper">
        <div className="navWrapper">
          <div className="explainationWrapper">
            <p>
              Click on an image you haven't clicked on before. Earn a point for
              each, you fail when you can't remember which images you've clicked
              on!
            </p>
          </div>
          <div className="Nav">
            <div className="TitleWrapper">
              <h1 className="Title">Giphy Memory Game</h1>
            </div>
            <div className="GameSearchWrapper">
              <input
                className="GameSearch"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyUp={handleKeyPress}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
        <div className="GameWrapper">
          <ConnectToGiphy
            setSearchResults={setSearchResults}
            gameSize={gameSize}
            searchQuery={debouncedSearchQuery}
          />
          <GenerateGame
            gameSize={gameSize}
            searchResults={searchResults}
            onClick={handleClick}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

function GenerateGame({ gameSize, searchResults, onClick }) {
  let gameCards = null;
  if (searchResults) {
    gameCards = searchResults
      .slice(0, gameSize)
      .map((result, index) => (
        <GenerateCard
          key={index}
          cardData={result.images.original.url}
          id={result.id}
          onClick={onClick}
        />
      ));
  }

  return <div className="GameWrapper">{gameCards}</div>;
}

function GenerateCard({ cardData, id, onClick }) {
  return (
    <div className="CardWrapper">
      <img src={cardData} alt="Giphy" onClick={() => onClick(id)} />
    </div>
  );
}

function ShuffleArray(unshuffled) {
  let shuffled = unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  console.log(unshuffled);
  console.log(shuffled);

  return shuffled;
}

export default App;

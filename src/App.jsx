import { useState, useEffect } from "react";
import "./App.css";

function ConnectToGiphy({ setSearchResults, gameSize }) {
  //Connect to Giphy and return gameSize of images to SetSearchResults.
  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const url =
          "https://api.giphy.com/v1/gifs/search?api_key=iE1kjbuVCa8u2qZijWDthRFluXbARsLK&q=kittens&limit=" +
          gameSize;
        const response = await fetch(url);
        const result = await response.json();
        setSearchResults(result.data);
      } catch {
        console.error("Failed to fetch gifs: ", error);
        setSearchResults([]);
      }
    };

    fetchGifs();
  }, []);

  return null;
}

function App() {
  const [gameSize, setGameSize] = useState(10);
  const [scoreData, setScoreData] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [maxScoreData, setMaxScoreData] = useState(0);

  //Generate the page
  return (
    <>
      <div className="PageWrapper">
        <div className="TitleWrapper">
          <h1 className="Title">Click the images</h1>
        </div>
        <ConnectToGiphy
          setSearchResults={setSearchResults}
          gameSize={gameSize}
        />
        <GenerateGame
          gameSize={gameSize}
          searchResults={searchResults}
          OnClick={handleClick}
        />
      </div>
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
          onClick={onClick}
        />
      ));
  }

  return <div className="GameWrapper">{gameCards}</div>;
}
function GenerateCard({ cardData, onClick }) {
  return (
    <div className="CardWrapper">
      <img src={cardData} alt="Giphy" onClick={onClick} />
    </div>
  );
}
function handleClick() {
  setScoreData = (prevScore) => prevScore + 1;
}
function handleGameEnd() {
  setScoreData = () => 0;
}

export default App;

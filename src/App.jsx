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
    console.log("Called Fetch");
  }, []);

  return null;
}

function handleClick() {
  setScoreData((prevScore) => prevScore + 1);
  setSearchResults((prevSearch) => ShuffleArray(prevSearch));
  console.log(scoreData);
}

function handleGameEnd() {
  setScoreData = () => 0;
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
        <GenerateGame gameSize={gameSize} searchResults={searchResults} />
      </div>
    </>
  );
}

function GenerateGame({ gameSize, searchResults }) {
  let gameCards = null;
  if (searchResults) {
    gameCards = searchResults
      .slice(0, gameSize)
      .map((result, index) => (
        <GenerateCard
          key={index}
          cardData={result.images.original.url}
          id={result.id}
        />
      ));
  }

  return <div className="GameWrapper">{gameCards}</div>;
}
function GenerateCard({ cardData, id }) {
  return (
    <div className="CardWrapper">
      <img src={cardData} alt="Giphy" onClick={handleClick(id)} />
    </div>
  );
}
function ShuffleArray(unshuffled) {
  //Taking in an array, return it shuffled.

  let shuffled = unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  console.log(unshuffled);
  console.log(shuffled);

  return shuffled;
}

export default App;

import { useState } from "react";
import "./index.css";
import Background from "./components/Background";

function App() {
  const [season, setSeason] = useState("spring");

  return (
    <>
      <Background season={season} />

      <SeasonSelector setSeason={setSeason} />
    </>
  );
}

export default App;

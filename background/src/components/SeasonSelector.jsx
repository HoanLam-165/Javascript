function SeasonSelector({ setSeason }) {
  return (
    <div className="selector">
      <button onClick={() => setSeason("spring")}>🌸 Spring</button>
      <button onClick={() => setSeason("summer")}>☀ Summer</button>
      <button onClick={() => setSeason("autumn")}>🍂 Autumn</button>
      <button onClick={() => setSeason("winter")}>❄ Winter</button>
    </div>
  );
}

export default SeasonSelector;

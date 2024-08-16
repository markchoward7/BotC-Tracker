import React from "react";
import TeamChart from "./TeamChart";
import PlayerCountChart from "./PlayerCountChart";
import LocationChart from "./LocationChart";
import ScriptChart from "./ScriptChart";

const ChartPage: React.FC = () => {
  return (
    <>
      <TeamChart />
      <PlayerCountChart />
      <ScriptChart />
      <LocationChart />
    </>
  );
};

export default ChartPage;

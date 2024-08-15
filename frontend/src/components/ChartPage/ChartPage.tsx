import React from "react";
import TeamChart from "./TeamChart";
import PlayerCountChart from "./PlayerCountChart";

const ChartPage: React.FC = () => {
  return (
    <>
      <TeamChart />
      <PlayerCountChart />
    </>
  );
};

export default ChartPage;

import React from "react";
import TeamChart from "./TeamChart";
import PlayerCountChart from "./PlayerCountChart";
import LocationChart from "./LocationChart";
import ScriptChart from "./ScriptChart";
import { Grid } from "@mui/material";

const ChartPage: React.FC = () => {
  return (
    <Grid container padding={5}>
      <Grid item xs={3}>
        <TeamChart />
      </Grid>
      <Grid item xs={3}>
        <LocationChart />
      </Grid>
      <Grid item xs={6}>
        <PlayerCountChart />
      </Grid>
      <Grid item xs={12}>
        <ScriptChart />
      </Grid>
    </Grid>
  );
};

export default ChartPage;

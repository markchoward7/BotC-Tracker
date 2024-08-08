import React from "react";
import { APIContextProvider, Main, ThemeWrapper } from "components";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeWrapper>
        <APIContextProvider>
          <Main />
        </APIContextProvider>
      </ThemeWrapper>
    </Router>
  );
};

export default App;

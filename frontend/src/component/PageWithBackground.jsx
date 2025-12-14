import React from "react";

const PageWithBackground = ({ children }) => {
  const styles = {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(to bottom right, #a8edea, #fed6e3)", // soft gradient
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
  };

  return <div style={styles}>{children}</div>;
};

export default PageWithBackground;

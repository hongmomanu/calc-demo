import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate() {
  return (
    <Box
      style={{
        width: "200px",
        height: "200px",
        position: "absolute",
        left: "50%",
      }}
      sx={{ display: "flex" }}
    >
      <CircularProgress
        style={{ width: "100%", height: "100%" }}
        color="success"
      />
    </Box>
  );
}

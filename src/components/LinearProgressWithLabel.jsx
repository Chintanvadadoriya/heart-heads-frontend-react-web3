import React, { useState, useEffect } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const LinearProgressWithLabel = (props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = 20;
      const finalProgress = Math.round(props.value);

      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress = prevProgress + increment;
          return nextProgress > finalProgress ? finalProgress : nextProgress;
        });
      }, 100); 

      if (progress === finalProgress) {
        clearInterval(interval);
      }

      return () => {
        clearInterval(interval);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.value]);

  return (
    <Box sx={{ display: "block", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={progress}  />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary" style={{ color: "white" }}>
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;

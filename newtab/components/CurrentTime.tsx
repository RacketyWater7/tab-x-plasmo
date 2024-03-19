import { Box, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",
        color: "#fff"
      }}>
      <Typography variant="h3">{formattedTime}</Typography>
      <Box height={"1rem"} />
      <Typography variant="h5">
        {currentTime.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric"
        })}
      </Typography>
    </Box>
  )
}

export default CurrentTime

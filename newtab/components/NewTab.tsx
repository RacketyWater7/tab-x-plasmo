import { Box, Button } from "@mui/material"
import React from "react"

import CurrentTime from "./CurrentTime"
import SearchBar from "./SearchBar"

const NewTab = () => {
  return (
    <Box
      className="App"
      sx={{
        p: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#343d3f"
      }}>
      <Box
        sx={{
          mb: "5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <Button
          variant="contained"
          sx={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            borderRadius: "50px",
            backgroundColor: "#ba55d3",
            "&:hover": {
              backgroundColor: "#a74bc8"
            }
          }}
          href="mailto:haseebudeen@outlook.com?subject=Tab%20X%20Feedback">
          Have any ideas or feedback? Let me know!
        </Button>
        <Box
          sx={{
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8
            }
          }}
          onClick={() => {
            window.open("https://www.buymeacoffee.com/haseebudeen", "_blank")
          }}>
          <img
            style={{ height: "40px", borderRadius: "50px" }}
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="buyMeACofee"
          />
        </Box>
      </Box>
      <SearchBar />

      <Box>
        <CurrentTime />
      </Box>
    </Box>
  )
}

export default NewTab

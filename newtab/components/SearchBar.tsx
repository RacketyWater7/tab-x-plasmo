import { Search as SearchIcon } from "@mui/icons-material"
import GoogleIcon from "@mui/icons-material/Google"
import { Box, IconButton, InputBase, Paper } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

// @ts-expect-error - it works
import chatGptIcon from "~assets/chatgptIcon.webp"

const SearchBar = () => {
  const [search, setSearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [searchChoice, setSearchChoice] = useState("google")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchInputRef = useRef(null) // Ref for the search input field

  useEffect(() => {
    chrome.storage.sync.get("searchChoice", function (data) {
      setSearchChoice(data.searchChoice || "google")
    })
  }, [])

  /**
   * Handle the change event for the search input field
   * @param {React.ChangeEvent<HTMLInputElement>} e The event object
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (searchChoice === "chatgpt") {
      chrome.storage.sync.set({ savedQuery: e.target.value })
    }
    if (e.target.value.length > 0) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }

    if (e.target.value.length > 0) {
      fetch(
        `https://suggestqueries.google.com/complete/search?client=chrome&q=${search}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data[1])
        })
    }
  }

  /**
   * Handle the search event
   * @param {string} suggestion The suggestion to search for
   */
  const handleSearch = (suggestion: string) => {
    if (searchChoice === "chatgpt") {
      console.info("saving: ", suggestion)
      chrome.storage.sync.set({ savedQuery: suggestion })
      window.open(`https://chat.openai.com`)
    } else {
      window.open(`https://www.google.com/search?q=${suggestion || search}`)
    }
    setShowSuggestions(false)
  }

  useEffect(() => {
    // Calculate and set the width of the suggestions box to match the input field
    if (searchInputRef.current) {
      const inputWidth = searchInputRef.current.offsetWidth
      const suggestionsBox = document.getElementById("suggestions-box")
      if (suggestionsBox) {
        suggestionsBox.style.width = inputWidth + "px"
      }
    }
  }, [search])

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion)
    setShowSuggestions(false)
    handleSearch(suggestion)
  }

  const handleArrowKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const totalSuggestions = suggestions.length
      let newIndex =
        e.key === "ArrowDown"
          ? (highlightedIndex + 1) % totalSuggestions
          : (highlightedIndex - 1 + totalSuggestions) % totalSuggestions
      if (newIndex === -1) {
        newIndex = totalSuggestions - 1
      }
      setHighlightedIndex(newIndex)
      // look at the line below
      // searchInputRef.current.value = suggestions[newIndex];
      setSearch(suggestions[newIndex])
    } else if (e.key === "Enter") {
      if (highlightedIndex !== -1) {
        handleSuggestionClick(suggestions[highlightedIndex])
      } else {
        handleSearch(null)
      }
    } else {
      setHighlightedIndex(-1)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: "900px",
        borderRadius: "50px",
        alignSelf: "center",
        minWidth: "600px",
        mt: 2,
        mb: "5rem",
        backgroundColor: "#fff"
      }}>
      <SearchIcon
        sx={{ color: "#5F6368", alignSelf: "center", ml: "0.5rem" }}
      />
      <InputBase
        type="text"
        style={{
          flexGrow: 1,
          padding: "0 10px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#5F6368",
          backgroundColor: "#fff"
        }}
        placeholder="Search on Google or ChatGPT"
        value={search}
        onKeyDown={handleArrowKeyDown}
        onChange={handleChange}
        ref={searchInputRef}
      />
      <IconButton
        sx={{
          borderRadius: "50%",
          backgroundColor: searchChoice === "google" ? "#ddd" : "#fff",
          ml: 1,
          "&:hover": {
            backgroundColor: "#eee"
          }
        }}
        onClick={() => {
          setSearchChoice("google")
          chrome.storage.sync.set({ searchChoice: "google" })
        }}>
        <GoogleIcon />
      </IconButton>
      <IconButton
        sx={{
          borderRadius: "50%",
          backgroundColor: searchChoice === "chatgpt" ? "#ddd" : "#fff",
          ml: 1,
          "&:hover": {
            backgroundColor: "#eee"
          }
        }}
        onClick={() => {
          setSearchChoice("chatgpt")
          chrome.storage.sync.set({ searchChoice: "chatgpt" })
        }}>
        <img style={{ height: "24px" }} src={chatGptIcon} alt="chatgpt" />
      </IconButton>

      {showSuggestions && suggestions.length > 0 && (
        <Paper
          id="suggestions-box"
          elevation={3}
          sx={{
            position: "absolute",
            zIndex: 1,
            width: "30%",
            ml: "40px",
            marginTop: "49px"
          }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSuggestionClick(suggestion)
                  }
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderBottom: "1px solid #ccc",
                  backgroundColor: highlightedIndex === index ? "#eee" : "#fff",
                  // @ts-expect-error - it should work
                  "&:hover": {
                    backgroundColor: "#eee"
                  }
                }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </Paper>
      )}
    </Box>
  )
}

export default SearchBar

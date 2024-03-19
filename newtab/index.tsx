import React from "react"

import { AppThemeProvider } from "~styles/theme"

import NewTab from "./components/NewTab"

import "~styles/index.css"

const NewTabIndex = () => {
  return (
    <AppThemeProvider>
      <NewTab />
    </AppThemeProvider>
  )
}

export default NewTabIndex

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider
} from "@mui/material/styles"
import React from "react"

import { themeOptions } from "./options"

const createAppTheme = () => {
  const theme = createTheme(themeOptions)

  return responsiveFontSizes(theme)
}

export const AppThemeProvider = ({ children }) => {
  return <ThemeProvider theme={createAppTheme()}>{children}</ThemeProvider>
}

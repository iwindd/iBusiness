import type { Config } from 'tailwindcss'
import { colors as muiColors } from '@mui/material'

export const colors = {
  ...muiColors,
  primary: {
    light: "#1769aa",
    main: muiColors.cyan[700],
    dark: "#4dabf5"
  },
  secondary: {
    light: "#f3e5f5",
    main: "#ce93d8",
    dark: "#ab47bc"
  },
  error: {
    light: "#e57373",
    main: "#f44336",
    dark: "#d32f2f"
  },
  warning: {
    light: "#ffb74d",
    main: "#ffa726",
    dark: "#f57c00"
  },
  info: {
    light: "#4fc3f7",
    main: "#29b6f6",
    dark: "#0288d1"
  },
  success: {
    light: "#81c784",
    main: "#66bb6a",
    dark: "#388e3c"
  },
  base: {
    main: "rgb(245, 253, 251)",
    divider: "#d1e7e1"
  },
  common: {
    ...muiColors.common,
    main: "#fff",
  }
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: 'body',
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      xs: "0px",
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1536px"
    },
    extend: {
      colors: colors,
      borderColor: {
        DEFAULT: colors.base.divider,
      },
    }
  },
  plugins: [],
}
export default config

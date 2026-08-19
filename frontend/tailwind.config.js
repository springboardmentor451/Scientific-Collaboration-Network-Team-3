/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-secondary-fixed": "#1b1b1d",
        "primary-container": "#081b3a",
        "on-tertiary": "#ffffff",
        "inverse-primary": "#b6c6ee",
        "tertiary-fixed-dim": "#e0c29b",
        "inverse-on-surface": "#f0f0f2",
        "surface-container": "#edeef0",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e8e8ea",
        "on-secondary": "#ffffff",
        "surface-container-highest": "#e2e2e4",
        "error-red": "#ba1a1a",
        "surface-variant": "#e2e2e4",
        "tertiary": "#000000",
        "inverse-surface": "#2f3132",
        "on-tertiary-fixed": "#281802",
        "secondary-container": "#e2dfe1",
        "surface-bright": "#f9f9fb",
        "on-secondary-fixed-variant": "#474648",
        "background": "#f9f9fb",
        "on-primary-fixed": "#081b3a",
        "tertiary-container": "#281802",
        "on-error": "#ffffff",
        "on-tertiary-fixed-variant": "#584325",
        "surface": "#f9f9fb",
        "secondary-fixed": "#e5e2e4",
        "surface-dim": "#d9dadc",
        "on-error-container": "#93000a",
        "on-tertiary-container": "#99805d",
        "outline-variant": "#c5c6cf",
        "on-primary-container": "#7384a8",
        "on-primary": "#ffffff",
        "surface-container-low": "#f3f3f5",
        "primary-fixed-dim": "#b6c6ee",
        "secondary-fixed-dim": "#c8c6c8",
        "on-surface": "#1a1c1d",
        "error-container": "#ffdad6",
        "surface-tint": "#4e5e81",
        "on-secondary-container": "#636264",
        "outline": "#75777f",
        "on-surface-variant": "#44474e",
        "on-primary-fixed-variant": "#364768",
        "primary-fixed": "#d8e2ff",
        "error": "#ba1a1a",
        "tertiary-fixed": "#fddeb5",
        "on-background": "#1a1c1d",
        "primary": "#000000",
        "secondary": "#5f5e60"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "stack-lg": "64px",
        "gutter": "32px",
        "unit": "8px",
        "stack-md": "32px",
        "stack-sm": "16px",
        "container-padding": "64px"
      },
      "fontFamily": {
        "body-md": ["Inter"],
        "label-sm": ["Inter"],
        "display-lg": ["Inter"],
        "headline-md": ["Inter"],
        "headline-lg": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "body-lg": ["Inter"]
      },
      "fontSize": {
        "body-md": ["16px", { "lineHeight": "1.6", "letterSpacing": "0em", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "1.2", "letterSpacing": "0.02em", "fontWeight": "600" }],
        "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "letterSpacing": "0em", "fontWeight": "400" }]
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight so it doesn't mess up our custom Login.jsx CSS
  }
}

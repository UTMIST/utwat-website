/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "surface-variant": "#33343e",
        "primary-fixed-dim": "#b8c3ff",
        "on-primary-fixed-variant": "#0035be",
        "secondary": "#fff9ef",
        "tertiary-fixed": "#e2e2e8",
        "tertiary": "#c6c6cc",
        "on-surface-variant": "#c4c5d9",
        "on-secondary-fixed-variant": "#544600",
        "on-error-container": "#ffdad6",
        "on-secondary-container": "#725f00",
        "surface-bright": "#373943",
        "background": "#11131c",
        "surface-container-lowest": "#0c0e17",
        "surface": "#11131c",
        "on-primary-container": "#efefff",
        "outline": "#8e90a2",
        "on-tertiary-fixed": "#1a1c20",
        "on-error": "#690005",
        "surface-dim": "#11131c",
        "secondary-container": "#ffdb3c",
        "on-secondary-container": "#725f00",
        "error": "#ffb4ab",
        "surface-container-low": "#191b24",
        "on-primary": "#002388",
        "outline-variant": "#434656",
        "surface-tint": "#b8c3ff",
        "surface-container": "#1d1f29",
        "on-background": "#e2e1ef",
        "surface-container-highest": "#33343e",
        "on-surface": "#e2e1ef",
        "on-secondary-fixed": "#221b00",
        "on-tertiary": "#2f3035",
        "primary": "#b8c3ff",
        "error-container": "#93000a",
        "tertiary-fixed-dim": "#c6c6cc",
        "inverse-surface": "#e2e1ef",
        "inverse-on-surface": "#2e303a",
        "surface-container-high": "#282933",
        "secondary-fixed": "#ffe16d",
        "primary-container": "#2e5bff",
        "on-secondary": "#3a3000",
        "on-primary-fixed": "#001356",
        "inverse-primary": "#124af0",
        "on-tertiary-fixed-variant": "#45474b",
        "tertiary-container": "#6c6d72",
        "secondary-fixed-dim": "#e9c400",
        "primary-fixed": "#dde1ff",
        // Interactive Mixed Cyber Gold / Electric Blue Palettes
        "cyber-blue": "#2e5bff",
        "cyber-gold": "#ffe16d",
        "cyber-gold-dim": "#e9c400"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "stack-lg": "64px",
        "stack-sm": "8px",
        "stack-md": "24px",
        "margin-mobile": "16px",
        "container-max": "1280px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Sarabun", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Inter", "monospace"]
      },
      fontSize: {
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["32px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "headline-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "label-code": ["14px", {"lineHeight": "1.0", "fontWeight": "500"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-lg": ["48px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "display-hero": ["72px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800"}]
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(46, 91, 255, 0.45)',
        'glow-gold': '0 0 25px rgba(233, 196, 0, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}

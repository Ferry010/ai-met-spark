import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        body: ['Lexend', 'system-ui', 'sans-serif'],
        // Legacy names used by the teacher area, mapped onto the brand fonts.
        fraunces: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        'dm-sans': ['Lexend', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          dark: "hsl(var(--primary-dark))",
          soft: "hsl(var(--primary-soft))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          dark: "hsl(var(--secondary-dark))",
          soft: "hsl(var(--secondary-soft))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          dark: "hsl(var(--destructive-dark))",
          soft: "hsl(var(--destructive-soft))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          dark: "hsl(var(--success-dark))",
          soft: "hsl(var(--success-soft))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          dark: "hsl(var(--accent-dark))",
          soft: "hsl(var(--accent-soft))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        night: "hsl(var(--night))",
        dusk: {
          DEFAULT: "hsl(var(--dusk))",
          2: "hsl(var(--dusk-2))",
          3: "hsl(var(--dusk-3))",
        },
        "on-dark": "hsl(var(--on-dark))",
        safe: {
          DEFAULT: "hsl(var(--safe))",
          dark: "hsl(var(--safe-dark))",
          soft: "hsl(var(--safe-soft))",
          foreground: "hsl(var(--safe-foreground))",
        },
        smart: {
          DEFAULT: "hsl(var(--smart))",
          dark: "hsl(var(--smart-dark))",
          soft: "hsl(var(--smart-soft))",
          foreground: "hsl(var(--smart-foreground))",
        },
        stronger: {
          DEFAULT: "hsl(var(--stronger))",
          dark: "hsl(var(--stronger-dark))",
          soft: "hsl(var(--stronger-soft))",
          foreground: "hsl(var(--stronger-foreground))",
        },
        spark: {
          DEFAULT: "hsl(var(--spark))",
          dark: "hsl(var(--spark-dark))",
          eye: "hsl(var(--spark-eye))",
        },
        "border-strong": "hsl(var(--border-strong))",
        classroom: {
          teal: "hsl(var(--classroom-teal))",
          "teal-dark": "hsl(var(--classroom-teal-dark))",
          amber: "hsl(var(--classroom-amber))",
          dark: "hsl(var(--classroom-dark))",
          muted: "hsl(var(--classroom-muted))",
          bg: "hsl(var(--classroom-bg))",
          surface: "hsl(var(--classroom-surface))",
          border: "hsl(var(--classroom-border))",
          success: "hsl(var(--classroom-success))",
          warning: "hsl(var(--classroom-warning))",
        },
        "world-1": "hsl(var(--world-1))",
        "world-2": "hsl(var(--world-2))",
        "world-3": "hsl(var(--world-3))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 6px)",
        sm: "calc(var(--radius) - 12px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.12)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0.6) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(15deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3.5s ease-in-out infinite",
        "twinkle": "twinkle 2.2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

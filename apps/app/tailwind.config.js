/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    prefix: "",
    theme: {
        screens: {
            xs: "380px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        container: {
            center: true,
            padding: "2rem",
            screens: {
                xs: "380px",
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                dashboardbg: "var(--dashboardbg)",

                cshadow: "var(--cshadow)",
                primarytext: "var(--primarytext)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    background: "var(--destructive-background)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                blue: {
                    DEFAULT: "var(--blue)",
                    background: "var(--blue-background)",
                },
                purple: {
                    DEFAULT: "var(--purple)",
                    background: "var(--purple-background)",
                },
                orange: {
                    DEFAULT: "var(--orange)",
                    background: "var(--orange-background)",
                },
                yellow: {
                    DEFAULT: "var(--yellow)",
                    background: "var(--yellow-background)",
                },
                green: {
                    DEFAULT: "var(--green)",
                    background: "var(--green-background)",
                },
                gray: {
                    DEFAULT: "var(--gray)",
                    background: "var(--gray-background)",
                },
                cyan: {
                    DEFAULT: "var(--cyan)",
                    background: "var(--cyan-background)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                normal: ["Geist", "sans-serif"],
                header: "var(--headerfont)",
            },
            borderWidth: { border: "var(--borderwidth)" },
            fontWeight: {
                header: "var(--size)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

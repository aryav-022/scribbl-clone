import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
			animation: {
				'mount': 'mount 4s linear forwards',
			}
		},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				".scrollbar": {
					"&::-webkit-scrollbar": {
						width: "0.5rem",
					},
					"&::-webkit-scrollbar-track": {
						borderRadius: "9999px",
						backgroundColor: "#f3f4f6", // gray-100
					},
					"&::-webkit-scrollbar-thumb": {
						borderRadius: "9999px",
						backgroundColor: "#d1d5db", // gray-300
					},
				},
				".scrollbar-dark": {
					"&::-webkit-scrollbar-track": {
						backgroundColor: "#374151", // neutral-700
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "#6b7280", // neutral-500
					},
				},
			});
		}),
	],
} satisfies Config;

import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		screens: {
			sm: '640px',
			md: '900px',
			lg: '1200px',
			xl: '1536px',
			'2xl': '1536px',
			'3xl': '1800px',
		},
		fontSize: {
			xs: ['0.75rem', '1rem'],
			sm: ['0.875rem', '1.25rem'],
			base: ['1rem', '1.5rem'],
			lg: ['1.125rem', '1.75rem'],
			xl: ['1.25rem', '1.75rem'],
			'22': ['1.375rem', '2rem'],
			'2xl': ['1.5rem', '2rem'],
			'3xl': ['1.875rem', '2.25rem'],
			'32': ['2rem', '2.25rem'],
			'4xl': ['2.25rem', '2.5rem'],
			'40': ['2.5rem', '3rem'],
			'5xl': ['3rem', '1'],
			'57': ['3.56rem', '4rem'],
			'6xl': ['3.75rem', '1'],
			'7xl': ['4.5rem', '1'],
			'8xl': ['6rem', '1'],
			'9xl': ['8rem', '1'],
		},
		extend: {
			fontFamily: {
				sans: ['AmpleAlt', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				'green-light': '#1EFF9D',
				'green-dark': '#06EBBD',
				'black-light': '#222325',
				'gray-light': '#F4F6F8',
				'black-dark': '#1C1D23',
				'menu-dark': '#2C2E30',
				'custom-grey': 'rgb(115 120 141 / 15%)',
				'pink-light': '#E372FF',
				'pink-dark': '#FF56F8',
			},
		},
	},
	plugins: [],
};
export default config;

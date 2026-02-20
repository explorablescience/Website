<p style="font-size: 30px; font-weight: bold;"><img src="public/imgs/logo.png" alt="ExplorableScience logo" style="max-width: 38px; display: inline; margin-right: 8px; vertical-align: middle;"> ExplorableScience</p>

**ExplorableScience** is the main public site for explorable science. It combines long-form articles and interactive simulations (*explorables*) to help users learn about scientific concepts through exploration and engagement. The site is built with Next.js using the App Router architecture, organized into route groups for the homepage and core content.

## Highlights
- Interactive simulations built with a reusable simulation library
- Articles about multiple scientific topics, organized by year
- Next.js App Router architecture with route groups for home and core content

## Content
- Articles live under `app/(core)/articles` with yearly collections and dedicated pages
- Simulations live under `app/(core)/simulations` and the explorable simulation library under `lib/explorable_simlib`
- Public assets live in `public/` (images, models, icons)

## Tech Stack
- Next.js (App Router)
- TypeScript
- CSS Modules

## Local Development
1. Install dependencies
	 ```bash
	 npm install
	 ```
2. Start the dev server
	 ```bash
	 npm run dev
	 ```
3. Open `http://localhost:3000`

## Scripts
- `npm run dev` - Start local dev server
- `npm run build` - Build for production
- `npm run start` - Run the production build
- `npm run lint` - Lint the project

## Project Structure (Selected)
```text
app/
	(home)/
	(core)/
		articles/
		simulations/
	components/
	api/
lib/
	explorable_simlib/
public/
	imgs/
	articles/
	simulations/
```

## Notes
- The site is organized by route groups for homepage sections and core content.
- Simulation and article assets are stored in `public/` for direct access.
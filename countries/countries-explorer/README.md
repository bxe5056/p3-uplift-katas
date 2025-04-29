# Countries Explorer

## The Problem

We've been asked to create a responsive frontend interface that allows people to explore and learn about countries around the world using a public API. The goal is to build a clean, performant, and accessible UI that supports browsing, and navigating through real-world data.

The project should be built using any modern frontend framework (e.g., React, Vue, Svelte) and must consume data from the [REST Countries API](https://restcountries.com/).

---

## Requirements

### Browsing Countries

**As a** curious person, **I want** to scroll through a list of countries, **so that** I can see what's out there.

- Fetch and display a paginated or infinite-scrolling list of countries.
- Each country should show at least its name, flag, population, region, and capital.

---

### Responsive Design

**As a** person on the go, **I want** the UI to adapt to my device, **so that** it's always easy to use.

- Use flexible layout techniques (grid, flexbox).
- Avoid fixed widths or pixel-specific sizing.

## ✨ ✨ Optional Enhancements ✨ ✨

If you find yourself with extra time or inspiration, feel free to extend your solution with any of the ideas below. These are completely optional and not expected — no worries at all if you choose to skip them!

### Favorites

**As a** user, **I want** to favorite countries I care about, **so that** I can quickly revisit them later.

- Allow users to mark/unmark countries as favorites.
- Favorites should be persisted regardless of navigation
- Provide a dedicated view or section that lists all favorite countries.
- Indicate which countries are favorited in both the list and details views.

# Countries Explorer Skeleton

This is intended to be a jumping off point for interviews, so folks have a place to start immediately.

Feel free to add what you need to add to develop comfortably.

## Included:

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [React Router](https://github.com/remix-run/react-router)
- [xState](https://xstate.js.org/)
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/)
- [Mock Service Worker](https://mswjs.io/)
- [Faker](https://fakerjs.dev/)
- [ESLint](https://eslint.org/)

## Commands:

Run: `yarn dev`

Test: `yarn test`

---

# Implementation Details

## Running the Application

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`
5. Run tests:
   ```
   npm run test
   ```

## Deployments

The main branch is deployed through Vercel at [demo.bentheitguy.me](demo.bentheitguy.me)
The feature branch is deployed through Vercel at [demo-dev.bentheitguy.me](demo-dev.bentheitguy.me)

## Design Decisions & Trade-offs

### Architecture

- Used the existing Vite application with TypeScript for type safety
- Implemented responsive design using CSS Grid and Flexbox to avoid fixed widths
- Chose infinite scrolling over pagination to create a smoother user experience
- Used fetch for data retrival and implemented caching to reduce API calls and improve performance due to the need for pagination

### Considerations

- Implemented in-state pagination for the country list to handle only being able to get the entire API result
  - While all the data is still in memory, we at least aren't loading all the flags at one time.
- Added loading states and error handling for better user experience
- Utilized React's useState for initial state flows
  - I did not expand the options to include a favorites feature, which would have needed a persistent state management system

## Future Improvements

With more time, I would:

1. Implement more detailed country views with additional information from the API
1. Add analytics to track user interactions and improve UX
1. Add filtering and sorting capabilities by region, population, etc.
1. Improve accessibility features and ensure Lighthouse compliance
1. Add dark/light theme support
1. Optimize bundle size through code splitting and lazy loading

# Online Medicose - AI Coding Guidelines

## Architecture Overview
This is a React single-page application (SPA) built with Create React App, focused on medication management for patients and caregivers. The app uses client-side routing with React Router DOM and maintains all state locally within components using React hooks.

Key components:
- **Home** (`src/Home.jsx`): Landing page with navigation and feature overview
- **Login/Signup** (`src/Login.jsx`, `src/Signup.jsx`): Authentication forms with validation
- **Profile** (`src/Profile.jsx`): User profile management with extensive medical data fields
- **Medications** (`src/Medications.jsx`): CRUD interface for managing medication schedules
- **Appointments** (`src/Appointments.jsx`): Doctor appointment booking and management with upcoming/history views

## State Management
- No global state library (Redux, Context) - each component manages its own state with `useState`
- Form data stored as objects (e.g., `profileData`, `formData`) with individual field updates
- Validation errors tracked separately in `errors` state objects

## Routing & Navigation
- Routes defined in `src/App.js` using `<Routes>` and `<Route>`
- Navigation handled with `useNavigate` hook from react-router-dom
- Links use `<Link>` component for internal navigation
- Available routes: /, /login, /signup, /profile, /medications, /appointments

## Form Patterns
- Controlled components with `value` and `onChange={handleChange}`
- `handleChange` function updates state and clears errors: `setFormData({...formData, [name]: value})`
- Validation in separate `validateForm` functions, setting `errors` object
- Submit handlers prevent default, validate, then simulate API calls (currently no real backend)

## Development Workflow
- `npm start`: Runs development server on localhost:3000
- `npm test`: Launches Jest test runner in watch mode
- `npm run build`: Creates production build in `build/` folder
- No custom scripts - standard Create React App setup

## Code Conventions
- Functional components with arrow functions: `const Component = () => {}`
- CSS modules not used - separate `.css` files imported directly
- File naming: `Component.jsx` for components, `Component.css` for styles
- Imports: React hooks from 'react', router hooks from 'react-router-dom'

## Key Patterns
- Password visibility toggles with `showPassword` state
- File uploads handled in `handleChange` with `files[0]`
- Medication times as arrays, managed with add/remove functions
- Success/error messages displayed conditionally in UI

## Testing
- Uses React Testing Library with Jest
- Test file: `src/App.test.js` (basic render test)
- Run tests with `npm test` for interactive mode

Reference `src/App.js` for routing setup, `src/Profile.jsx` for complex form handling, and `src/Medications.jsx` for list management patterns. For appointment booking UI, see `src/Appointments.jsx`.
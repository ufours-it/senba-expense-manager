# Pocket Ledger

A small Expo + React Native personal expense tracker demo.

**Project Overview**

This repository demonstrates a minimal expense-tracking app built with Expo and TypeScript. It uses a straightforward, file-based routing structure and React Context for state management so you can focus on UI and features rather than infrastructure.

**Folder Structure**

- App/: App entry and route-driven screens. Follows Expo Router conventions for file-based routing and contains top-level layouts and screen components.
- Assets/: Static assets such as images and icons used by the app.
- components/: Reusable UI components (e.g., theme toggle, chart components) to keep screens small and focused.
- config/: App-wide configuration (e.g., toast configuration) and shared settings.
- constants/: Static constants like categories.ts, icon maps, and theme.ts used across the app.
- context/: React Context providers (for example expenseContext.tsx and themeContext.tsx) used for lightweight state management.
- models/: Type definitions and domain models (for example expense.ts).
- storage/: Persistence layer (for example expenseStorage.ts) that abstracts Async storage details so it can be swapped later (SecureStore, or a DB).
- utils/: Small helper functions, such as FormatDate.ts and listHelper.ts.
- Validation/: Schemas and validation logic (e.g., expenseSchema.ts) to validate user input.
- Root files: package.json, app.json, tsconfig.json, and ESLint/config files for tooling and build configuration.

**Why these choices (Libraries & Tools)**

- Expo: Fast cross-platform development, easy device testing, and a managed workflow that removes native build complexity.
- TypeScript: Improves developer experience and reduces runtime bugs through static types.
- File-based routing (Expo Router): Keeps navigation simple and maps filesystem layout to app routes.
- React Context: Lightweight, built-in state management ideal for an app of this scope (centralized contexts for expenses and theme).
- Separation of concerns: components/, context/, storage/, and utils/ keep code modular and testable.
- Validation and models: Using a Validation/ folder and typed models/ helps ensure data integrity and easier refactors.

These choices prioritize quick iteration, clarity, and portability for a demo app while keeping the codebase approachable for contributors.

**Getting Started**

1. Install dependencies

`bash
npm install
`

2. Start the Expo dev server

`bash
npx expo start
`

3. Open on a device or emulator using the QR code or the listed options (Expo Go, simulator, or development build).

**Development notes**

- To modify app routes, edit files under app/ following the file-based routing rules.
- Persistent storage is abstracted in storage/expenseStorage.ts; swap implementations without changing UI code.
- Charts live in components/charts/ they are isolated to keep visual logic separated from screen logic.

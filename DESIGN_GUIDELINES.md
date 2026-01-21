# Design Guidelines & Standards

This document outlines the design principles, libraries, and asset management strategies for the MiKiwi project.

## 1. Iconography System
We utilize **Google Material Symbols** for all iconography within the application to ensure consistency and scalability.

-   **Library**: Material Symbols (Rounded/Outlined variant preferred).
-   **Implementation**: Use the SVG or font version.
    -   *Installation*: Include the font link in the main layout (`app.blade.php` or `index.html`) or install via npm if dynamic loading is required.
    -   *Link*: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`
-   **Usage**: Icons should be used to enhance navigation and visual cues without cluttering the UI.

## 2. Color Palette & Typography
-   **Colors**: Utilize the predefined Tailwind CSS colors.
    -   *Primary Backgrounds*: Light greens (`bg-green-50`) as seen in the product visualizer.
    -   *Action Colors*: Distinct colors for CTAs to ensure they stand out.
    -   *Feedback*: Standard semantic colors (red for errors, green for success).
-   **Typography**:
    -   Font Family: Standard Sans-Serif font stack provided by Tailwind (or define a custom Google Font like 'Inter' if needed).
    -   Readability: Ensure high contrast text on light backgrounds.

## 3. Asset Management
Assets are organized within the `public/assets` directory to separate them from logic code.

### Structure
-   `public/assets/img/`: General purpose images, product photos, banners.
-   `public/assets/icons/`: Custom SVGs not available in Material Symbols.

### Best Practices
-   **Naming Convention**: Use kebab-case for filenames (e.g., `product-hero-bg.jpg`, `icon-check.svg`).
-   **Optimization**: Ensure images are compressed (WebP preferred) for optimal load times.

## 4. UI/UX Principles
-   **Clean Architecture**: UI components are strictly presentational. Logic resides in containers or hooks.
-   **Visual Hierarchy**: Use spacing (`gap`, `margin`, `padding` in Tailwind) effectively. Group related elements visually (like the unified Product Visualizer block).
-   **Interaction**:
    -   Buttons and interactive elements must have hover/active states.
    -   Cursor behavior should reflect interactivity (`cursor-pointer` for links/buttons, `cursor-default` for static content).
    -   Avoid text selection highlighting (`select-none`) on structural UI elements to maintain an app-like feel.

## 5. Component Structure
-   **Atomic Design**: Small, reusable components (Buttons, Inputs) -> Molecules (Forms, Cards) -> Organisms (Sections like `ProductInfo`).
-   **Identification**: During development, components may have temporary visual borders for debugging layouts. Remove these for production.

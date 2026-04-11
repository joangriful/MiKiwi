# Cloudinary Setup Guide

This guide explains how to set up the Cloudinary integration for the Doll Configurator.

## 1. Prerequisites

The project uses the `cloudinary/cloudinary_php` SDK (Version 3.x) to fetch images from your Cloudinary media library.

### Installation

If you are setting this up for the first time or pulling the project, run:

```bash
composer install
```

If the Cloudinary SDK is missing, install it manually:

```bash
composer require cloudinary/cloudinary_php
```

## 2. Environment Variables

You must add your Cloudinary credentials to the `.env` file in the root of the project.

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_URL=https://res.cloudinary.com/your_cloud_name/image/upload/
```

> **Note:** Do not commit the `.env` file to the repository.

## 3. Cloudinary Folder Structure

The application automatically scans the **`doll_parts_ps`** folder in your Cloudinary Media Library.

### Expected Hierarchy

-   **`doll_parts_ps`** (Root)
    -   **`front`** / **`back`** (Views)
        -   **`cuerpo`**, **`manchas`**, **`vientre`**, etc. (Categories)
            -   **Images:** `10_body.png`
            -   **Groups:** Subfolders containing multiple layers (e.g., `fancy_shirt/base.png`).

### Automatic Filename & Suffix Handling

Cloudinary often appends a random 6-character suffix to filenames upon upload (e.g., `vello3_u6z7kf.png`).

**You do NOT need to rename these files manually.**

The backend service automatically:
1.  Uses the **Search API** to find all files recursively.
2.  **Strips the random suffix** (`_xxxxxx`) from the ID.
3.  Matches the original filename logic (e.g., uses `vello3` as the ID).

## 4. Caching

To improve performance and avoid hitting Cloudinary API limits, the doll parts list is cached for **1 hour**.

**Important:** If you upload new images to Cloudinary and don't see them immediately, you MUST clear the cache:

```bash
php artisan cache:clear
```

## 5. Troubleshooting

-   **"Class not found" error:** Ensure you have run `composer require cloudinary/cloudinary_php`.
-   **"Internal Server Error (max_results)":** Ensure you are using SDK v3.x which uses camelCase methods (`maxResults`).
-   **"No options available" / Empty list:**
    -   Check if `doll_parts_ps` exists in the root of your Cloudinary Media Library.
    -   Verify your API Credentials in `.env`.
    -   Check `storage/logs/laravel.log` for any error messages.

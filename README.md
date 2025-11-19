# Household Marketplace Web App

A simple, modern, client-side marketplace web app for listing household items for sale.
Runs entirely in the browser using **HTML, CSS, JavaScript, and localStorage**, making it ideal for hosting on **GitHub Pages** with zero backend or paid services.

---

## Features

### Core Functionality

* Add items with:

  * Image upload (auto-compressed and stored as Base64)
  * Name
  * Description
  * Price
  * Contact information
  * Date & time auto-generated
* Mark items as **Sold**
* Edit existing listings
* Delete listings
* Search bar to filter items by name or description

### Demo Marketplace Data

* First time the app is opened, several fake items are automatically created.
* These can also be edited or deleted by the user.

### Storage

* All data is stored locally in:

  ```
  localStorage["market_items"]
  ```
* No external database required.

### UI

* Clean, modern, mobile-friendly layout.
* Responsive cards using flexbox/grid.

---

## File Structure

Ensure your repository contains:

```
index.html
style.css
app.js
```

You may also include:

```
README.md
```

---

## How to Run Locally

1. Download the files and place them in a single folder.
2. Open `index.html` in any modern web browser.

No installation needed.

---

## How to Deploy on GitHub Pages

1. Create a GitHub repository.

2. Upload the files (`index.html`, `style.css`, `app.js`, `README.md`).

3. Go to:

   **Settings → Pages**

4. Under "Source", choose:

   * Branch: `main`
   * Folder: `/root`

5. Click **Save**.

GitHub Pages will generate a shareable URL within a minute or two.

---

## How Image Compression Works

When a user selects an image:

1. JavaScript reads the file.
2. It is drawn onto a `<canvas>`.
3. The image is resized (max width ~600px).
4. It is converted to a Base64 string.
5. The Base64 data is stored in `localStorage`.

This keeps image sizes small enough for browser storage limits.

---

## LocalStorage Reset (Optional)

If you want to clear all items and reset the demo data:

1. Open the Developer Console (F12).
2. Run:

```javascript
localStorage.removeItem("market_items")
```

3. Refresh the page.

---

## Limitations

* Browser `localStorage` has a size limit (~5MB).
* All data is local to the user’s browser; not shared with others.
* No user authentication.
* For real multi-user functionality, a backend would be required.

---

## Future Improvements (Optional)

If expanding the app later, recommended upgrades include:

* Cloud storage backend (Supabase, Firebase, etc.).
* Authentication system.
* Pagination or infinite scroll.
* Multiple images per listing.
* Sorting (price, date, location).

---

## License

This project is free to use and modify for personal or academic projects.

---

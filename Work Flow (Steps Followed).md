# Household Marketplace Web App – Workflow (How the Project Was Built)

1. **Define project requirements**

   * A simple marketplace that runs in the browser
   * Users can add and manage listings
   * No server or database

2. **Use LLM for Self-Prompting**

   * First ask the LLM to generate the best possible prompt based on requirements.
   * Copy that optimized prompt.

3. **Generate Project Code with LLM**

   * Paste the optimized prompt back into the model.
   * Receive:

     * `index.html`
     * `style.css`
     * `script.js`
     * `README.md`

4. **Create Local Project Folder**

   * Save all files to a directory on the computer.

5. **Test Locally**

   * Open `index.html` in a browser.
   * Confirm:

     * Listings display properly
     * Adding/removing/editing works
     * LocalStorage persists data

6. **Initialize Git and Commit**

   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

7. **Push to GitHub**

   ```
   git remote add origin <repo-link>
   git push -u origin main
   ```

8. **Deploy with GitHub Pages**

   * Go to: `Settings → Pages`
   * Publish from `main` branch

9. **Obtain Live Website Link**

   * GitHub Pages provides the project URL

---

## How to Run Locally

1. Download or clone the repository:

   ```
   git clone <repository-link>
   ```
2. Open the project folder.
3. Open `index.html` in a web browser.

No installation required.

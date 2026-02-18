# PalmCar Rental

Internal fleet management system for **PalmCar Rental** — manage vehicles, bookings, and operations.

**Stack:** Vite, React, TypeScript, Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Demo logins:**

- Admin: `admin@palmcar.com` / `admin123`
- User: `user@example.com` / `user123`

## Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `npm run dev`    | Start dev server         |
| `npm run build`  | Production build         |
| `npm run preview`| Preview production build |
| `npm run lint`   | Run ESLint               |

## Push to GitHub

1. Create a new repository on GitHub named **PalmCar Rental** (or **PalmCar-Rental**).
2. Do **not** initialize it with a README (you already have one).
3. In this folder, add the remote and push (replace `YOUR_GITHUB_USERNAME` with your username):

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/PalmCar-Rental.git
git push -u origin main
```

If the repo name has a space, use: `https://github.com/YOUR_GITHUB_USERNAME/PalmCar%20Rental.git`

## Deploy on Netlify

1. Push this repo to GitHub (see above).
2. Log in at [netlify.com](https://www.netlify.com) → **Add new site** → **Import an existing project**.
3. Connect **GitHub** and choose the **PalmCar-Rental** repository.
4. Netlify will use the repo’s `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**. The app will be live at a URL like `https://random-name-123.netlify.app`.
6. Optional: set a custom domain under **Domain settings**.

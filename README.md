# 🏡 UrbanNest – MERN Real Estate App

UrbanNest is a full-stack real estate marketplace built with the MERN stack. Users can browse, search, and filter properties for rent or sale, and signed-in users can create and manage their own listings with image uploads.

## ✨ Features

- 🔑 **Advanced Authentication** – JWT (stored in HTTP-only cookies), email/password sign-up, and Google OAuth via Firebase
- 🏡 **Real-world CRUD** – Create, read, update, and delete property listings stored in MongoDB
- 🖼️ **Image Uploads** – Upload up to 6 images per listing (first image is the cover), with client-side compression and ImageKit storage
- 👤 **Profile Management** – Update account details, view/edit/delete your own listings, delete account, sign out
- 🔍 **Advanced Search** – Search by keyword, filter by type (Rent & Sale / Rent / Sale / Offer), amenities (Parking, Furnished), and sort by price
- 💸 **Offers & Discounts** – Mark listings as offers with a discounted price
- 📱 **Responsive UI** – Built with Tailwind CSS, Swiper image sliders, and a clean card layout
- 🌐 **Free Deployment** – Deployable on Render


## 🛠️ Tech Stack

**Frontend**
- React 19, Vite
- Redux Toolkit + Redux Persist
- React Router DOM v7
- Tailwind CSS v4
- Firebase (Google OAuth)
- Swiper, React Icons

**Backend**
- Node.js, Express 5
- MongoDB with Mongoose
- JSON Web Tokens, bcryptjs, cookie-parser, cors
- ImageKit (image storage)
- browser-image-compression (client-side)

## 📁 Project Structure

```
realestateapp/
├── api/                  # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── firebase.js
│   └── package.json
├── package.json          # Backend package.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)
- A Firebase project with Google sign-in enabled
- An ImageKit account

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/realestateapp.git
cd realestateapp
```

### 2. Install dependencies

```bash
# Backend (root)
npm install

# Frontend
cd client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the **root** folder:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Create a `.env` file in the **client** folder:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

> Never commit `.env` files. Make sure they are listed in `.gitignore`.

### 4. Run the app

```bash
# Terminal 1 – backend (from root)
npm run dev

# Terminal 2 – frontend (from /client)
cd client
npm run dev
```

## 📜 Available Scripts

**Backend (root)**

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with nodemon |
| `npm start` | Start the API with Node |

**Frontend (`/client`)**

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## 🔌 API Endpoints

**Auth** – `/api/auth`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/signup` | Register a new user |
| POST | `/signin` | Sign in with email and password |
| POST | `/google` | Sign in with Google |
| GET | `/signout` | Sign out |

**User** – `/api/user`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/update/:id` | Update user profile |
| DELETE | `/delete/:id` | Delete account |
| GET | `/listings/:id` | Get a user's listings |

**Listing** – `/api/listing`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/create` | Create a listing |
| POST | `/update/:id` | Update a listing |
| DELETE | `/delete/:id` | Delete a listing |
| GET | `/get/:id` | Get a single listing |
| GET | `/get` | Search listings (`searchTerm`, `type`, `offer`, `parking`, `furnished`, `sort`, `order`) |

## 🚀 Deployment (Render)

1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) and connect your repo.
3. Set the build and start commands:
   - **Build command:** `npm install && npm install --prefix client && npm run build --prefix client`
   - **Start command:** `npm start`
4. Add all environment variables from your `.env` files in Render's dashboard.
5. Make sure Express serves the built `client/dist` folder in production.

## 🗺️ Roadmap

- [ ] Favorites / saved listings
- [ ] Contact the landlord form
- [ ] Map view for listings
- [ ] Pagination / infinite scroll on search results
- [ ] Profile picture upload

## 🤝 Contributing

Contributions are welcome! Fork the repo, create a feature branch, and open a pull request.

## 📄 License

This project is licensed under the ISC License.

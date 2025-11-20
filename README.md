# 🌌 **BlogSphere**

### A High-End Social Blogging + Micro-Community Platform (React + Firebase)

BlogSphere is a modern, space-themed, glassmorphic social blogging platform designed with a premium UX and full real-time features. Users can create posts, interact socially, follow others, receive notifications, and explore a rich community-driven environment — all powered by Firebase and a beautifully engineered React frontend.

---

## 🔗 **Live Demo**

🚀 **Production Deployment:**
[https://blogsphere-iv27-adgpasxqt-anuj52s-projects.vercel.app/login](https://blogsphere-iv27-adgpasxqt-anuj52s-projects.vercel.app/login)

📦 **GitHub Repository:**
[https://github.com/Anuj52/blogsphere](https://github.com/Anuj52/blogsphere)

---

## 🚀 **Tech Stack**

| Layer                  | Technology                                    |
| ---------------------- | --------------------------------------------- |
| **Frontend**           | React (Vite)                                  |
| **Styling**            | Tailwind CSS v3 (Glassmorphism + Space Theme) |
| **Routing**            | react-router-dom                              |
| **Icons**              | lucide-react                                  |
| **Markdown Rendering** | react-markdown                                |
| **Time Formatting**    | date-fns                                      |
| **Notifications**      | react-hot-toast                               |
| **Backend**            | Firebase v9 (Auth + Firestore + Hosting)      |

---

## 🌌 **Design Philosophy**

BlogSphere features a **cosmic space aesthetic** combined with **glassmorphism UI**:

* Dark cosmic background (`bg-slate-950`)
* Animated floating gradients / energy blobs (`DynamicBackground.jsx`)
* Frosted glass UI (`bg-white/5`, `backdrop-blur-xl`, `border-white/10`)
* Modern typeface (Plus Jakarta Sans)
* A clean 3-column social layout (Twitter/X-inspired)

---

## 🏛️ **App Architecture**

### **Three-Column Layout**

1. **Left Sidebar** – Logo, Navigation, User Mini-Profile
2. **Center Feed** – Global + Following posts
3. **Right Sidebar** – Trending topics, Suggestions, Footer

---

## 🧑‍🚀 **Core Features**

### 🔐 **Authentication & Onboarding**

* Email/Password Login & Register
* Firebase Auth
* Protected routes redirect unauthenticated users
* First-time profile setup (name, username, bio, location)
* Input stability fix included (no re-renders destroying cursor focus)

---

### 📰 **Home Feed (`Feed.jsx`)**

* **Global Feed:** All posts from all users
* **Following Feed:** Only posts from people you follow
* Real-time search (title/content/category)
* Markdown-ready post creation
* Skeleton loading animations

---

### 💬 **Post Interactions (`PostCard.jsx`)**

* ❤️ Like
* 🔁 Boost (Repost)
* 👁 View Count (tracked via modal opens)
* 🔖 Bookmark
* 🔗 Share (copy to clipboard + toast)
* ✏ Edit your own posts
* 🗑 Delete your own posts

---

### 📝 **Post Details Modal (`PostModal.jsx`)**

* Built with React Portals (`createPortal`)
* Displays full Markdown-rendered post body
* Includes comments section
* Sticky comment input
* Updates view counts

---

### 👤 **User Profile (`Profile.jsx`)**

* Unique avatars via **DiceBear API**
* Gamified **Reputation Level**
* Rank tiers (Rookie → Master → Legend)
* Pinned post
* Profile edit modal
* Followers / Following / Reputation stats

---

### 🔔 **Real-Time Notifications**

* Likes
* Comments
* Follows
* Sender avatar + context message
* Updates in real-time via Firebase listeners

---

## 📁 **Folder Structure**

```
src/
├── AuthContext.jsx
├── firebase-config.js
├── pages/
│   ├── Feed.jsx
│   ├── Profile.jsx
│   ├── Notifications.jsx
│   └── Messages.jsx   # (Reserved for future use)
│
├── components/
│   ├── Layout.jsx
│   ├── UI.jsx
│   ├── Avatar.jsx
│   ├── FollowButton.jsx
│   ├── modal/
│   │   └── Modal.jsx
│   ├── feed/
│   │   ├── PostCard.jsx
│   │   ├── CreatePost.jsx
│   │   ├── PostModal.jsx
│   │   └── ...
│   └── sidebar/
│       ├── TrendingWidget.jsx
│       └── WhoToFollowWidget.jsx
```

---

## ⚙️ **Environment Setup**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Anuj52/blogsphere
cd blogsphere
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Firebase

Create a `.env` file:

```
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

---

## 📦 **Build for Production**

```bash
npm run build
```

Deploy via **Firebase Hosting**, **Vercel**, or **Netlify**.

---

## ⭐ **Contribute**

Suggestions, bug fixes, and pull requests are welcome.
If you need help extending BlogSphere, open an issue!

---

## 📄 **License**

MIT License © 2025 BlogSphere

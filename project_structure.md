// Frontend Structure
// ------------------
// public/
// ├── index.html
// └── favicon.ico
// src/
// ├── App.jsx
// ├── components/
// │   ├── ProfileForm.jsx
// │   ├── BirthdayDashboard.jsx
// │   └── StickerGallery.jsx
// ├── assets/
// │   ├── stickers/
// │   └── particles.js
// ├── styles/
// │   └── global.css
// ├── main.jsx
// └── tailwind.config.js
//
// Backend Structure
// ---------------
// server.js
// routes/
// │   ├── students.js
// │   └── birthdays.js
// ├── migrations/
// │   └── 20260213_create_students_table.js
// ├── .env
// └── supabase.js
//
// Supabase Migration
// ------------------
// CREATE TABLE students (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   nickname TEXT NOT NULL UNIQUE,
//   birthdate DATE NOT NULL,
//   photo_url TEXT,
//   sticker_id UUID REFERENCES stickers(id)
// );
//
// CREATE TABLE birthdays (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   student_id UUID NOT NULL REFERENCES students(id),
//   month INTEGER NOT NULL,
//   notified BOOLEAN DEFAULT false,
//   FOREIGN KEY (student_id) REFERENCES students(id)
// );
//
// Deployment
// --------
// # docker-compose.yml
// version: '3.8'
// services:
//   app:
//     build: .
//     ports:
//       - '3000:3000'
//     environment:
//       - SUPABASE_URL=your-url
//       - SUPABASE_ANON_KEY=your-key
//     volumes:
//       - .:/app
//     stdin_open: true
//     tty: true
//
// # .env
// PORT=3000
// SUPABASE_URL=your-url
// SUPABASE_ANON_KEY=your-key
//
// # README.md
// # Student Platform
//
// ## Getting Started
// 1. Clone this repository
// 2. Install dependencies
// 3. Set up Supabase project
// 4. Configure environment variables
// 5. Run `docker-compose up`
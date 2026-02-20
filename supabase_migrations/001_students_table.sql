// Supabase Migration: students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL UNIQUE,
  birthdate DATE NOT NULL,
  photo_url TEXT,
  sticker_id INTEGER REFERENCES stickers(id)
);

CREATE TABLE birthdays (
  student_id UUID REFERENCES students(id),
  month INTEGER NOT NULL,
  notified BOOLEAN DEFAULT false,
  PRIMARY KEY (student_id, month)
);

CREATE TABLE stickers (
  id SERIAL PRIMARY KEY,
  emoji TEXT NOT NULL UNIQUE
);

-- Insert 20 emojis
INSERT INTO stickers (emoji) VALUES
  ('🎉'), ('🎂'), ('🎈'), ('🎁'), ('🎊'), ('🌟'),
  ('✨'), ('💖'), ('🧡'), ('💙'), ('💚'), ('💛'),
  ('💜'), ('🖤'), ('🤍'), ('🤍'), ('🤍'), ('🤍'),
  ('🤍');
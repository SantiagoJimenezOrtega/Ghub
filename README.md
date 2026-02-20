# 🎓 Student Platform

Una plataforma para la gestión de perfiles de estudiantes, seguimiento de cumpleaños y galería de stickers.

## 🚀 Cómo ejecutar en local

### 1. Requisitos previos
- [Node.js](https://nodejs.org/) (v16+)
- Una cuenta en [Supabase](https://supabase.com/)

### 2. Configuración de la Base de Datos (Supabase)
Crea un proyecto en Supabase y ejecuta el siguiente SQL en el **SQL Editor**:

```sql
-- Crear tabla de estudiantes
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL UNIQUE,
  birthdate DATE NOT NULL,
  photo_url TEXT,
  sticker_id TEXT, -- Cambiado a TEXT para simplificar con emojis
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de cumpleaños para notificaciones
CREATE TABLE birthdays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Configuración de Variables de Entorno
Copia el archivo `.env.example` a `.env` tanto en la raíz como en la carpeta `backend/`:

```bash
cp .env.example .env
cp .env.example backend/.env
```

Luego, abre los archivos `.env` y rellena `SUPABASE_URL` y `SUPABASE_ANON_KEY` con los datos de tu proyecto de Supabase (Settings > API).

### 4. Instalación y Ejecución

#### Opción A: Ejecución Manual (Recomendado para Desarrollo)

**Backend:**
```bash
cd backend
npm install
npm run dev # Servidor en http://localhost:3001
```

**Frontend:**
```bash
# En una nueva terminal, en la raíz del proyecto
npm install
npm start # Aplicación en http://localhost:3000
```

#### Opción B: Docker (Próximamente)
Estamos trabajando en un `Dockerfile` optimizado. Por ahora, usa la Opción A.

## 🛠️ Tecnologías
- **Frontend**: React, Tailwind CSS, Lucide React (opcional).
- **Backend**: Node.js, Express, Supabase.
- **Base de Datos**: PostgreSQL (vía Supabase).

## 📁 Estructura del Proyecto
- `src/`: Código fuente del frontend (React).
- `backend/`: Código fuente del backend (Express).
- `migrations/`: Scripts de migración (histórico).
- `.env`: Configuración local.
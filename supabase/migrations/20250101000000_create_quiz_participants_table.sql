-- Crear la tabla para almacenar los participantes del quiz
CREATE TABLE IF NOT EXISTS quiz_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  accept_data_processing BOOLEAN NOT NULL,
  accept_promotions BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_result TEXT NOT NULL,
  answers JSONB NOT NULL
);

-- Crear un índice para buscar por email
CREATE INDEX IF NOT EXISTS idx_quiz_participants_email ON quiz_participants(email);

-- Activar RLS (Row Level Security)
ALTER TABLE quiz_participants ENABLE ROW LEVEL SECURITY;

-- Política de inserción (permitir a cualquier persona insertar)
CREATE POLICY "Permitir inserción de participantes" ON quiz_participants
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política de lectura (solo para admins o el propio usuario si lo necesitaras)
-- Por defecto, solo los admins pueden leer para proteger la privacidad

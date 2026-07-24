-- Cerrar la insercion publica legacy ahora que el formulario usa
-- exclusivamente el backend de Next.js con service_role.

DROP POLICY IF EXISTS "Permitir inserción de participantes"
  ON public.quiz_participants;

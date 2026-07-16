# Política de Seguridad

## Seguridad de los Datos

Este proyecto maneja datos sensibles. Es obligatorio:

1. **Nunca subir credenciales** al repositorio (API keys, contraseñas, tokens)
2. Usar variables de entorno para toda información sensible
3. Encriptar datos sensibles en reposos y en tránsito

## Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor contacta de forma privada:

- Email: seguridad@dunkin-colombia.com

No publiques públicamente las vulnerabilidades hasta que hayan sido resueltas.

## Variables de Entorno

Todas las credenciales deben estar en variables de entorno (archivo `.env`), que NUNCA se sube al repositorio.

Ejemplo de variables de entorno necesarias (ver `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Cumplimiento Legal

- Cumplimiento con la Ley de Protección de Datos Personales de Colombia (Ley 1581 de 2012)
- No almacenar datos personales sin consentimiento explícito del usuario
- Eliminar datos de usuarios cuando no sean necesarios

## Mejoras de Seguridad Recomendadas

1. Habilitar autenticación de dos factores en GitHub
2. Limitar el acceso al repositorio solo a personal autorizado
3. Usar ramas protegidas para la rama principal
4. Realizar auditorías de seguridad periódicas

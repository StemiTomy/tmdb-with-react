# tmdb-with-react

Front React puro, backend Firebase.

Librerías:

-- React Query (TanStack Query)
-- antd


```npm run start``` y para iniciar frontend.

```npm run build``` para construir la app para producción.

Usamos fontawseome con este comando (los gratuitos)

```bash
npm install @fortawesome react-fontawesome @fortawesome free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
```

La app en producción es:
https://web-app-50f58.web.app/

```firbase deploy``` para hacer el deploy público.






# TODO: utilizar estas cosas:


1. React Router (tú ya lo usas, pero mejora usando useSearchParams, useNavigate, useRoutes)
Permite navegación declarativa

Puedes usar lazy() por rutas como hiciste

Puedes usar loaders (v6.4+) al estilo Remix (más abajo te hablo de eso)


```bash
npm install @tanstack/react-query
```

Mirar esto: useMutation o useInfiniteQuery en v5 si piensas paginar con scroll o hacer favoritos desde Firebase?

2. React Query (TanStack Query) – 👑 data fetching avanzado
Para trabajar con APIs (como TMDB o Firebase) con cache, refetching, paginación, sincronización y más.
npm install @tanstack/react-query
Ejemplo:

js
Copy
Edit
const { data, isLoading } = useQuery(['movies'], fetchMovies);
🧠 Si usas Firebase o APIs públicas como TMDB, te cambia la vida.

3. React Signals (experimental aún)
Alternativa ultrarrápida a useState y useEffect, basada en reactividad “fine-grained”.

🚧 Aún es experimental en React core, pero puedes probarlo con @preact/signals-react.

Ventajas:

No necesitas hooks

Menos renders

Reacciones automáticas

js
Copy
Edit
import { signal } from "@preact/signals-react";

const counter = signal(0);

function MyComponent() {
  return <button onClick={() => counter.value++}>{counter}</button>;
}



### TODOS:

1. En el futuro permitir añadir idiomas sin recompilar (modo SaaS), es decir, pasar a cargar las traducciones con una librería como i18next-http-backend directamente desde /public/locales/....





### Modelo de autenticación

- dj-rest-auth - Tengo para el login, registro y serializadores
- simplejwt - Para crear tokens JWT
- CookieJWTAuthentication - Para leer el token directamente el access_token de la cookie
- rest_framework - Base para apis y permisos


#### Registro
1. POST a /api/autenticacion/registro/
2. Usa CustomRegisterSerializer
3. Si vienes de tmdb.steluttomoiaga.com, se marca user.app_origin = TMDB
4. Se genera una sesión TMDB (guest_session_id) y se guarda como api_key en el usuario.

#### Login
1. POST a /api/auth/login/ con email y contraseña
2. Usa CustomLoginSerializer para:
  - Verificar email/contraseña con authenticate(...)
  - Comprobar si user.app_origin coincide con el Origin de la cabecera HTTP (ej: "tmdb.steluttomoiaga.com")
  
  Si es válido:
  Se crean dos tokens:
    - access_token → 15 min
    - refresh_token → 7 días

  Se guardan como cookies HttpOnly (no accesibles desde JavaScript) y se devuelve:
  ```json
  {
  "detail": "Inicio de sesión exitoso",
  "email": "ejemplo@gmail.com",
  "user_id": 123,
  "api_key": "..."
  }
  ```

¿Cómo se mantiene la sesión?
Tu frontend no necesita guardar nada (ni en localStorage ni en variables). Cada vez que hace una petición protegida, el backend:
1. Usa CookieJWTAuthentication
2. Lee la cookie access_token automáticamente
3. Si está caducado, el frontend hace una petición a /api/auth/token/refresh/
4. El backend devuelve un nuevo access_token (lo guarda en cookies otra vez)

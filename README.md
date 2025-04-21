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

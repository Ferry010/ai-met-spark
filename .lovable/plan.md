

# Fix: "Wereld niet gevonden" na inloggen

## Oorzaak

De route is `/world/:worldId` (zie `App.tsx`), maar `WorldPage.tsx` leest `const { id } = useParams()` en doet `getWorld(Number(id))`. Omdat de param `worldId` heet, is `id` altijd `undefined` → `Number(undefined) = NaN` → `getWorld` vindt niets → fallback "Wereld niet gevonden". Daarom werkt geen enkele wereld na inloggen.

`LessonPage.tsx` heeft dit al correct opgelost met `params.lessonId ?? params.id`.

## Wat ik aanpas

**`src/pages/WorldPage.tsx`** — vervang:
```ts
const { id } = useParams();
...
const baseWorld = getWorld(Number(id));
```
door:
```ts
const params = useParams<{ worldId?: string; id?: string }>();
const worldId = params.worldId ?? params.id;
...
const baseWorld = getWorld(Number(worldId));
```

Dat is alles. Eén bestand, twee regels. Alle bestaande links (`/world/1`, `/world/2`, `/world/3`) blijven werken en lessen worden weer geladen.

## Wat ik bewust NIET doe

- Geen wijziging aan de route in `App.tsx` (zou breken in andere paginas die `worldId` verwachten).
- Geen refactor van auth/loading state — de race-condition uit de stack-overflow tip speelt hier niet; profile/user worden correct geladen (zie network logs: profiles + user_roles 200 OK). De bug is puur de mismatched param naam.


# Travel Leader Network Mobile (Capacitor)

This configuration wraps the Nuxt frontend for iOS/Android.

## Steps

1) Build the frontend

```bash
npm run build -w frontend
```

2) Sync Capacitor

```bash
npm run sync -w mobile
```

3) Open native project

```bash
npm run open:ios -w mobile
npm run open:android -w mobile
```

During development, Capacitor points to `http://localhost:3000`.

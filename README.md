# RevQuest — site de révision (oral Code Review HETIC WEB3)

Site de révision gamifié pour préparer l'**oral de Code Review** (épreuve déterminante, Bloc 3).
HTML/CSS/JS + petit serveur Node pour **comptes et sauvegarde cloud** de la progression.

## Lancer le site (recommandé)

```powershell
cd revisionCodeReview\server
npm install
npm start
```

Puis ouvre **http://localhost:4599**

- Crée un compte (bouton en haut à droite) pour sauvegarder XP, parcours, certificat sur le serveur.
- Ta progression est synchronisée automatiquement à chaque action.

## Comptes sur plusieurs PC

Par défaut, les comptes sont stockés dans un fichier local (`data.json`) : ils ne suivent **pas** d'un PC à l'autre.

Pour synchroniser ton compte partout (PC perso, école, etc.), configure **Supabase** (gratuit) — une seule fois :

### 1. Créer la base Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un projet gratuit.
2. Ouvre **SQL Editor** → **New query**.
3. Colle le contenu de `server/supabase/schema.sql` et clique **Run**.

### 2. Configurer le serveur

1. Dans Supabase : **Project Settings → API**.
2. Copie l'**URL du projet** et la clé **service_role** (secret, ne jamais la mettre dans le front).
3. Dans `server/`, copie `.env.example` en `.env` et remplis :

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=un-secret-aleatoire-long
```

4. **Copie ce même fichier `.env` sur chaque PC** (USB, cloud perso, gestionnaire de mots de passe…).

### 3. Lancer sur n'importe quel PC

```powershell
cd revisionCodeReview\server
npm install
npm start
```

Connecte-toi avec le **même e-mail / mot de passe** : ta progression est restaurée depuis le cloud.

> Au démarrage, le serveur affiche `Stockage cloud Supabase actif` si la config est OK.

## Mode local (sans compte)

Double-clique sur `index.html` : la progression reste dans le **localStorage** du navigateur (non partagée entre appareils).

## Fichiers
- `index.html` — page + barre de stats (série, niveau, XP) + connexion
- `auth.js` — connexion / inscription / sync cloud
- `server/server.js` — API REST (auth JWT)
- `server/store.js` — stockage Supabase ou local
- `server/supabase/schema.sql` — tables pour Supabase
- `style.css` — styles (thème sombre)
- `data.js` — banque de **60 questions** (QCM / Vrai-Faux / flashcards)
- `lessons.js` — **cours** par monde + fiches + glossaire
- `roadmap.js` — **parcours guidé** (34 étapes ordonnées par prérequis)
- `app.js` — moteur (Leitner, XP, roadmap, examen, fiches, cahier)

## Fonctionnalités
- **Comptes utilisateur** : inscription, connexion, progression sauvegardée (Supabase ou `data.json`)
- **🚀 Roadmap guidée** (débutant → prêt) : 34 étapes verrouillées, exos de code éditables, checkpoint à réussir
- **📖 Cours** par monde + **📑 Fiches** + **📖 Glossaire** + **📓 Mon cahier**
- **🏆 Examen final de certification** (≥85% global + ≥70%/monde)

Périmètre V1 : Cours 1 (POO/SOLID), Cours 2 (Design Patterns), Clean Architecture, méthode Code Review.

## Variables d'environnement (optionnel)
- `PORT` — port du serveur (défaut : 4599)
- `JWT_SECRET` — secret pour les tokens (à changer en production)
- `SUPABASE_URL` — URL du projet Supabase (comptes multi-PC)
- `SUPABASE_SERVICE_KEY` — clé service_role Supabase (côté serveur uniquement)

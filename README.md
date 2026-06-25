# RevQuest — site de révision (oral Code Review HETIC WEB3)

Site de révision gamifié pour préparer l'**oral de Code Review** (épreuve déterminante, Bloc 3).
HTML/CSS/JS + petit serveur Node pour **comptes et sauvegarde cloud** de la progression.

## Lancer le site (recommandé)

```powershell
cd revisionWeb3\server
npm install
npm start
```

Puis ouvre **http://localhost:4599**

- Crée un compte (bouton en haut à droite) pour sauvegarder XP, parcours, certificat sur le serveur.
- Ta progression est synchronisée automatiquement à chaque action.

## Mode local (sans compte)

Double-clique sur `index.html` : la progression reste dans le **localStorage** du navigateur (non partagée entre appareils).

## Fichiers
- `index.html` — page + barre de stats (série, niveau, XP) + connexion
- `auth.js` — connexion / inscription / sync cloud
- `server/server.js` — API REST (auth JWT + stockage JSON)
- `style.css` — styles (thème sombre)
- `data.js` — banque de **60 questions** (QCM / Vrai-Faux / flashcards)
- `lessons.js` — **cours** par monde + fiches + glossaire
- `roadmap.js` — **parcours guidé** (34 étapes ordonnées par prérequis)
- `app.js` — moteur (Leitner, XP, roadmap, examen, fiches, cahier)

## Fonctionnalités
- **Comptes utilisateur** : inscription, connexion, progression sauvegardée dans `server/data.json`
- **🚀 Roadmap guidée** (débutant → prêt) : 34 étapes verrouillées, exos de code éditables, checkpoint à réussir
- **📖 Cours** par monde + **📑 Fiches** + **📖 Glossaire** + **📓 Mon cahier**
- **🏆 Examen final de certification** (≥85% global + ≥70%/monde)

Périmètre V1 : Cours 1 (POO/SOLID), Cours 2 (Design Patterns), Clean Architecture, méthode Code Review.

## Reprendre le travail (sur un autre PC)
1. Copie tout le dossier `revisionWeb3` (Git, USB, cloud).
2. Lance le serveur (`npm start` dans `server/`).
3. Connecte-toi avec ton compte : ta progression est restaurée automatiquement.

## Variables d'environnement (optionnel)
- `PORT` — port du serveur (défaut : 4599)
- `JWT_SECRET` — secret pour les tokens (à changer en production)

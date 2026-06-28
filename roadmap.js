/* ============================================================
   ROADMAP — parcours guidé "débutant → prêt pour les tests"
   Apprentissage par maîtrise (mastery learning) : ordre des
   prérequis respecté, chaque étape verrouillée tant que son
   checkpoint n'est pas réussi.

   Chaque étape (step) :
     id        : identifiant unique
     titre     : titre de l'étape
     pourquoi  : à quoi ça sert / prérequis (cadrage débutant)
     lesson    : [worldId, indexSection]  → réutilise le contenu du Cours
     lessons   : [[worldId, index]...]     → plusieurs sections de cours
     glos      : [termes...]              → affiche des entrées du glossaire
     html      : contenu personnalisé (sinon lesson/glos)
     exo       : exercice guidé {
                   enonce, probleme, mauvais, starter?, zone?, guide?, runTest?, runnable?, indices[], solution, solutionZone?
                 }
     note      : 📓 phrase à recopier dans le cahier
     checkpoint: [cardIds...] → questions (des vrais tests) à réussir pour valider
   ============================================================ */

const ROADMAP = [
  /* ---------- CHAPITRE 0 ---------- */
  { chapitre: "0 · Le vocabulaire de base", emoji: "🔤", steps: [
    {
      id: "r0-1", titre: "Programme, code, langage",
      pourquoi: "Avant tout : de quoi parle-t-on quand on dit « coder » ?",
      glos: ["Programme / Application", "Code (source)", "Langage de programmation"],
      note: "Un programme = une suite d'instructions ; le code = le texte écrit dans un langage (PHP, JS…).",
      checkpoint: []
    },
    {
      id: "r0-2", titre: "Classe et Objet",
      pourquoi: "La brique centrale de la POO. Si tu confonds classe et objet, rien ne suivra.",
      glos: ["Classe", "Objet / Instance", "Instancier"],
      html: `<p>Pense à un <strong>plan d'architecte</strong> (la <strong>classe</strong>) et aux <strong>maisons construites</strong> à partir de ce plan (les <strong>objets</strong>).</p>
        <p>Un seul plan → autant de maisons qu'on veut. Chaque maison est une <strong>instance</strong> du plan.</p>`,
      note: "Classe = le plan/modèle. Objet (instance) = un exemplaire concret fabriqué à partir de la classe.",
      checkpoint: []
    },
    {
      id: "r0-3", titre: "Attribut et Méthode",
      pourquoi: "Un objet, c'est des données (attributs) + des actions (méthodes).",
      glos: ["Attribut / Propriété", "Fonction / Méthode", "Paramètre / Argument"],
      note: "Attribut = une donnée de l'objet (sa couleur). Méthode = une action de l'objet (rouler()).",
      checkpoint: []
    },
  ]},

  /* ---------- CHAPITRE 1 : POO ---------- */
  { chapitre: "1 · Les piliers de la POO", emoji: "🧱", steps: [
    {
      id: "r1-0", titre: "Pourquoi viser un code de qualité",
      pourquoi: "Comprendre le but : sans ça, les principes semblent gratuits.",
      lessons: [["fond", 0], ["fond", 1]],
      note: "Un logiciel ne s'use pas mais se détériore ; la maintenance peut être la majeure partie du travail.",
      checkpoint: ["fond-01", "fond-02", "fond-03", "fond-04", "fond-05"]
    },
    {
      id: "r1-1", titre: "Encapsulation",
      pourquoi: "Le premier pilier : protéger l'intérieur d'un objet.",
      lesson: ["fond", 2],
      exo: {
        enonce: "Un compte bancaire ne devrait pas laisser n'importe qui modifier le solde librement.",
        probleme: "Le solde est public : depuis l'extérieur, on peut écrire compte.solde = -9999 sans aucun contrôle. Aucune règle n'est appliquée.",
        mauvais: `class CompteBancaire {
  public solde = 0;   // ⚠️ accessible par tous
}

const compte = new CompteBancaire();
compte.solde = -9999;  // rien ne l'empêche !`,
        mission: "Corrige la classe : rends solde privé et ajoute une méthode deposer() qui n'accepte que les montants positifs.",
        guide: [
          "Supprime l'accès direct : remplace public solde par private solde.",
          "Ajoute public deposer(montant) { ... } pour contrôler les dépôts.",
          "Dans deposer, vérifie if (montant > 0) avant d'ajouter au solde.",
          "Supprime la ligne compte.solde = -9999 — ce ne sera plus possible."
        ],
        indices: [
          "Une donnée sensible ne devrait pas être modifiable directement de l'extérieur.",
          "Rends l'attribut « privé », et expose une méthode qui contrôle la modification."
        ],
        solution: `class CompteBancaire {
  private solde = 0;
  public deposer(montant) {
    if (montant > 0) this.solde += montant;
  }
}`,
        runTest: `const compte = new CompteBancaire();
compte.deposer(100);
compte.deposer(-50);
console.log("deposer() OK — montant négatif ignoré");`
      },
      note: "Encapsulation = cacher les détails internes (private) et n'exposer que des méthodes contrôlées.",
      checkpoint: ["fond-06"]
    },
    {
      id: "r1-2", titre: "Héritage & Composition",
      pourquoi: "Deux façons de réutiliser du code — savoir quand choisir laquelle.",
      lesson: ["fond", 3],
      note: "Héritage = « est un » (rigide). Composition = « a un / utilise » (souple). Préférer la composition.",
      checkpoint: ["fond-07"]
    },
    {
      id: "r1-3", titre: "Couplage fort / faible",
      pourquoi: "La notion qui revient SANS CESSE : c'est le but de SOLID et de la Clean Archi.",
      lesson: ["fond", 4],
      note: "Couplage fort = modifier A oblige à modifier B (fragile). On vise le couplage faible (testable, évolutif).",
      checkpoint: ["fond-08"]
    },
    {
      id: "r1-4", titre: "Abstraction",
      pourquoi: "Indispensable AVANT le polymorphisme et le principe O de SOLID.",
      html: `<p><strong>Abstraction</strong> = ne garder que l'idée générale d'une chose, en oubliant les détails.</p>
        <p>🅿️ <em>Analogie :</em> un panneau « véhicules interdits » parle de l'idée « véhicule » — il ne liste pas voiture, moto, camion, scooter… un par un.</p>
        <p>En code, abstraire c'est écrire un programme qui manipule un concept général (ex. <code>Forme</code>) sans dépendre de chaque cas concret (<code>Cercle</code>, <code>Carré</code>).</p>`,
      exemple: "Le mot « moyen de transport » : tu raisonnes dessus sans préciser si c'est un bus ou un vélo.",
      exo: {
        enonce: "Cette fonction calcule l'aire en testant le type de chaque forme avec des if.",
        probleme: "La fonction connaît tous les types concrets (cercle, carré…). Ajouter un triangle = ajouter un if. Le code devient rigide et difficile à maintenir.",
        mauvais: `function aire(forme) {
  if (forme.type === "cercle") return 3.14 * forme.r * forme.r;
  if (forme.type === "carre")  return forme.cote * forme.cote;
  // ajouter un triangle = encore un if...
}`,
        mission: "Corrige la fonction : supprime les if et fais confiance à forme.aire() — chaque forme sait calculer son aire.",
        guide: [
          "Supprime les deux if — la fonction ne doit plus connaître les types.",
          "Remplace tout le corps par une seule ligne : return forme.aire();",
          "L'idée d'abstraction : on raisonne sur « une forme », pas sur chaque cas."
        ],
        indices: [
          "Le problème : la fonction connaît tous les types concrets.",
          "On voudrait une notion générale « Forme » qui sait calculer son aire, peu importe laquelle."
        ],
        solution: `function aire(forme) {
  return forme.aire();
}`,
        runTest: `const cercle = { aire(){ return 3.14 * 2 * 2; } };
const carre = { aire(){ return 3 * 3; } };
console.log("Aires:", aire(cercle), aire(carre));`
      },
      note: "Abstraction = raisonner sur l'idée générale (Forme, Véhicule) sans dépendre des cas concrets.",
      checkpoint: ["fond-13"]
    },
    {
      id: "r1-5", titre: "Interface (le contrat)",
      pourquoi: "L'outil concret de l'abstraction : il prépare le polymorphisme et SOLID.",
      html: `<p>Une <strong>interface</strong> est un <strong>contrat</strong> : la liste des actions qu'une classe DOIT savoir faire, sans dire comment.</p>
        <p>📑 <em>Analogie :</em> un contrat de livraison impose l'action <code>livrer()</code>. Colissimo et Chronopost signent ce contrat et le réalisent chacun à leur façon.</p>
        <pre><code>interface MoyenPaiement { payer(montant); }

class Carte  implements MoyenPaiement { payer(m){ /* ... */ } }
class Paypal implements MoyenPaiement { payer(m){ /* ... */ } }</code></pre>
        <p>Une interface ne s'instancie pas (ce n'est pas un objet) ; elle définit un <strong>type</strong> commun.</p>`,
      note: "Interface = un contrat de méthodes. Plusieurs classes peuvent l'implémenter → une « famille ».",
      checkpoint: ["fond-10"]
    },
    {
      id: "r1-6", titre: "Polymorphisme",
      pourquoi: "Le concept-clé qui rend le code souple — il a besoin d'abstraction + interface.",
      html: `<p><strong>Polymorphisme</strong> (« plusieurs formes ») : un même appel s'adapte à l'objet réel, sans <code>if</code> sur le type.</p>
        <p>📺 <em>Analogie :</em> une télécommande universelle. Le bouton <strong>ON</strong> allume la TV, la box ou la hi-fi — même geste, comportement adapté à chaque appareil.</p>
        <p>C'est possible parce que tous ces objets partagent une <strong>interface</strong> commune. Le slogan : <strong>« program to interfaces, not implementations »</strong>.</p>`,
      exo: {
        enonce: "On veut additionner les aires de plusieurs formes. Voici la mauvaise façon de le faire.",
        probleme: "Tu testes le type de chaque objet avec des if (instanceof). À chaque nouvelle forme (Triangle, Rectangle…), tu dois rouvrir et modifier cette boucle. C'est l'opposé du polymorphisme.",
        mauvais: `let total = 0;
for (const f of formes) {
  if (f instanceof Cercle) total += 3.14 * f.r * f.r;
  else if (f instanceof Carre) total += f.cote * f.cote;
  // ajouter Triangle = encore un else if...
}`,
        starter: `interface Forme { aire(); }
class Cercle {
  constructor(r) { this.r = r; }
  aire(){ return 3.14*this.r*this.r; }
}
class Carre {
  constructor(cote) { this.cote = cote; }
  aire(){ return this.cote*this.cote; }
}

const formes = [new Cercle(2), new Carre(3)];`,
        mission: "Corrige la boucle : supprime tous les if/else if et appelle simplement f.aire() — le bon calcul s'exécutera tout seul.",
        guide: [
          "Garde let total = 0; et la boucle for (const f of formes).",
          "Supprime les if (f instanceof Cercle) et else if (f instanceof Carre).",
          "Remplace par : total += f.aire();",
          "Résultat : 2 lignes utiles — let total = 0; et for... total += f.aire();"
        ],
        indices: [
          "Chaque forme sait déjà calculer son aire via la même méthode aire().",
          "Tu peux parcourir la liste et appeler aire() sans jamais tester le type."
        ],
        solutionZone: `let total = 0;
for (const f of formes) total += f.aire();`,
        solution: `let total = 0;
for (const f of formes) total += f.aire();`,
        runTest: `console.log("Total des aires =", total);`
      },
      note: "Polymorphisme = un même appel (ex. aire()) prend plusieurs formes selon l'objet, via une interface commune. Évite les if/switch sur le type.",
      checkpoint: ["fond-09", "fond-14"]
    },
    {
      id: "r1-7", titre: "DRY, YAGNI, KISS",
      pourquoi: "Les 3 réflexes de bon sens qui équilibrent tout le reste.",
      lesson: ["fond", 6],
      note: "DRY (pas de duplication) · YAGNI (pas d'anticipation inutile) · KISS (rester simple).",
      checkpoint: ["fond-11", "fond-12"]
    },
  ]},

  /* ---------- CHAPITRE 2 : SOLID ---------- */
  { chapitre: "2 · Les principes SOLID", emoji: "🪨", steps: [
    {
      id: "r2-0", titre: "Vue d'ensemble de SOLID",
      pourquoi: "Tu as maintenant tous les prérequis POO. On assemble.",
      lesson: ["solid", 0],
      note: "SOLID = S Single Responsibility · O Open/Closed · L Liskov · I Interface Segregation · D Dependency Inversion (R.C. Martin, ~2000).",
      checkpoint: ["solid-00", "solid-13"]
    },
    { id: "r2-1", titre: "S — Single Responsibility", pourquoi: "Une classe = une seule raison de changer.", lesson: ["solid", 1],
      note: "S : une classe ne doit avoir qu'une seule responsabilité (une seule raison de changer).", checkpoint: ["solid-01", "solid-02"] },
    {
      id: "r2-2", titre: "O — Open/Closed", pourquoi: "S'appuie sur abstraction + polymorphisme (revus au ch.1).", lesson: ["solid", 2],
      exo: {
        enonce: "Cette fonction de paiement doit accepter de nouveaux moyens de paiement sans être modifiée.",
        probleme: "Chaque nouveau moyen (Apple Pay, virement…) oblige à ajouter un else if dans payer(). La fonction est « fermée » aux extensions — ça viole Open/Closed.",
        mauvais: `function payer(type, montant) {
  if (type === "carte")  { /* traitement carte */ }
  else if (type === "paypal") { /* traitement paypal */ }
  // nouveau moyen = encore un else if ⚠️
}`,
        mission: "Corrige : crée une interface MoyenPaiement + des classes Carte/Paypal, puis une fonction payer(moyen, montant) qui appelle moyen.payer() sans if.",
        guide: [
          "Crée interface MoyenPaiement { payer(montant); }",
          "Crée class Carte implements MoyenPaiement { payer(m){ /* ... */ } }",
          "Crée class Paypal implements MoyenPaiement { payer(m){ /* ... */ } }",
          "Remplace la fonction par : function payer(moyen, montant) { moyen.payer(montant); }"
        ],
        indices: [
          "Rappelle-toi l'interface : et si chaque moyen de paiement savait se payer lui-même ?",
          "Crée une interface MoyenPaiement ; chaque moyen = une classe. La fonction appelle juste payer()."
        ],
        solution: `interface MoyenPaiement { payer(montant); }
class Carte  implements MoyenPaiement { payer(m){ /* ... */ } }
class Paypal implements MoyenPaiement { payer(m){ /* ... */ } }

function payer(moyen, montant) { moyen.payer(montant); }`,
        runTest: `payer({ payer(m){ console.log("Payé:", m); } }, 42);`
      },
      note: "O : on ajoute du comportement par de NOUVELLES classes, sans modifier le code existant (souvent via interface + polymorphisme).",
      checkpoint: ["solid-03", "solid-04"] },
    { id: "r2-3", titre: "L — Liskov", pourquoi: "Une sous-classe doit pouvoir remplacer son parent sans surprise.", lesson: ["solid", 3],
      note: "L : un « enfant » doit pouvoir remplacer son « parent » sans casser le comportement attendu.", checkpoint: ["solid-05", "solid-06", "solid-11"] },
    { id: "r2-4", titre: "I — Interface Segregation", pourquoi: "Des contrats petits et ciblés.", lesson: ["solid", 4],
      note: "I : ne pas forcer une classe à dépendre de méthodes qu'elle n'utilise pas → petites interfaces.", checkpoint: ["solid-07", "solid-08"] },
    {
      id: "r2-5", titre: "D — Dependency Inversion", pourquoi: "Le pont vers la Clean Architecture (injection de dépendance).", lesson: ["solid", 5],
      exo: {
        enonce: "Ce service crée lui-même sa connexion à la base de données.",
        probleme: "ServiceCommande fait new MySQLDatabase() en dur : il dépend du concret. Impossible de le tester avec un faux repo, impossible de changer de BDD sans modifier la classe.",
        mauvais: `class ServiceCommande {
  constructor() {
    this.db = new MySQLDatabase(); // ⚠️ dépendance concrète en dur
  }
}`,
        mission: "Corrige le constructor : reçois un repo injecté de l'extérieur au lieu de créer MySQLDatabase toi-même.",
        guide: [
          "Supprime new MySQLDatabase() du constructor.",
          "Ajoute un paramètre : constructor(repo)",
          "Stocke-le : this.repo = repo;",
          "Le service ne sait plus QUELLE base est utilisée — c'est injecté de l'extérieur (principe D)."
        ],
        indices: [
          "Le service ne devrait pas savoir QUELLE base précise il utilise.",
          "Fais-lui dépendre d'une interface (Repository) qu'on lui INJECTE de l'extérieur."
        ],
        solution: `class ServiceCommande {
  constructor(repo) {
    this.repo = repo;
  }
}`,
        runTest: `const repo = { save(d){ console.log("Repo mock OK"); } };
new ServiceCommande(repo);
console.log("Injection OK");`
      },
      note: "D : dépendre d'abstractions (interfaces injectées), jamais d'implémentations concrètes. Base de l'injection de dépendance.",
      checkpoint: ["solid-09", "solid-10", "solid-12"] },
  ]},

  /* ---------- CHAPITRE 3 : PATTERNS ---------- */
  { chapitre: "3 · Les Design Patterns", emoji: "🧩", steps: [
    { id: "r3-0", titre: "C'est quoi un pattern + les 3 familles", pourquoi: "Le cadre avant les patterns précis.", lesson: ["patterns", 0],
      note: "Pattern = solution réutilisable à un problème récurrent (GoF 1995). 3 familles : Creational, Structural, Behavioral.", checkpoint: ["pat-01", "pat-02", "pat-03"] },
    {
      id: "r3-1", titre: "Strategy", pourquoi: "Application directe de composition + interface + Open/Closed.", lesson: ["patterns", 1],
      exo: {
        enonce: "Cette commande calcule les frais de port avec des if sur le mode de livraison.",
        probleme: "Chaque nouveau mode (express, point relais…) = un if de plus dans fraisPort(). On ne peut pas changer la stratégie de calcul facilement au runtime.",
        mauvais: `class Commande {
  fraisPort(mode) {
    if (mode === "standard") return 5;
    if (mode === "express")  return 12;
    // nouveau mode = encore un if...
  }
}`,
        mission: "Corrige avec le pattern Strategy : interface Livraison, classes Standard/Express, et injection dans Commande.",
        guide: [
          "Crée interface Livraison { cout(); }",
          "Crée class Standard implements Livraison { cout(){ return 5; } }",
          "Crée class Express implements Livraison { cout(){ return 12; } }",
          "Commande reçoit la stratégie : constructor(livraison) { this.livraison = livraison; }",
          "fraisPort() devient : return this.livraison.cout(); — plus aucun if !"
        ],
        indices: [
          "Chaque mode de livraison = une « stratégie » de calcul interchangeable.",
          "Définis une interface Livraison { cout() } ; injecte la stratégie dans la commande."
        ],
        solution: `interface Livraison { cout(); }
class Standard implements Livraison { cout(){ return 5; } }
class Express  implements Livraison { cout(){ return 12; } }

class Commande {
  constructor(livraison) { this.livraison = livraison; }
  fraisPort() { return this.livraison.cout(); }
}`,
        runTest: `console.log("Frais express:", new Commande(new Express()).fraisPort());`
      },
      note: "Strategy : déléguer un algorithme interchangeable à des classes d'une même interface (composition).",
      checkpoint: ["pat-04", "pat-11"] },
    { id: "r3-2", titre: "Singleton", pourquoi: "Garantir une instance unique.", lesson: ["patterns", 2],
      note: "Singleton : une seule instance globale (constructeur privé + accès statique). À utiliser avec parcimonie.", checkpoint: ["pat-05"] },
    { id: "r3-3", titre: "Factory", pourquoi: "Découpler la création des classes concrètes.", lesson: ["patterns", 3],
      note: "Factory : centraliser la création d'objets et retourner une interface, pour ne pas dépendre du concret.", checkpoint: ["pat-06"] },
    { id: "r3-4", titre: "Decorator", pourquoi: "Ajouter des comportements en empilant.", lesson: ["patterns", 4],
      note: "Decorator : ajouter des comportements en encapsulant l'objet de façon récursive (sans le modifier).", checkpoint: ["pat-07"] },
    { id: "r3-5", titre: "MVC", pourquoi: "L'architecture des interfaces (sites, jeux, apps).", lesson: ["patterns", 5],
      note: "MVC : Model (données) · View (affichage) · Controller (interactions). Un pattern n'est PAS systématique.", checkpoint: ["pat-08", "pat-09", "pat-10"] },
  ]},

  /* ---------- CHAPITRE 4 : CLEAN ARCHITECTURE ---------- */
  { chapitre: "4 · La Clean Architecture", emoji: "🏛️", steps: [
    { id: "r4-0", titre: "Pourquoi la Clean Architecture", pourquoi: "Le « pourquoi » avant le « comment ».", lesson: ["clean", 0],
      note: "Clean Archi : code centré métier, indépendant des frameworks/BD → maintenable et testable. (R.C. Martin, 2012).", checkpoint: ["clean-01", "clean-10"] },
    { id: "r4-1", titre: "Les 4 couches", pourquoi: "La carte du système.", lesson: ["clean", 1],
      note: "4 couches : Entities (métier) → Use Cases → Adapters → External Interfaces (technique).", checkpoint: ["clean-02", "clean-08", "clean-11"] },
    { id: "r4-2", titre: "La règle de dépendance", pourquoi: "LE principe central — c'est le D de SOLID à l'échelle de l'archi.", lesson: ["clean", 2],
      note: "Règle de dépendance : tout pointe vers l'intérieur. Le métier ne dépend jamais de la technique.", checkpoint: ["clean-03", "clean-04", "clean-09"] },
    { id: "r4-3", titre: "DTO & Boundary", pourquoi: "Comment les données traversent les couches.", lesson: ["clean", 3],
      note: "DTO = objet sans logique qui transporte des données. Boundary = interface de passage entre couches.", checkpoint: ["clean-05", "clean-07"] },
    {
      id: "r4-4", titre: "Repository & injection de dépendance", pourquoi: "L'application concrète du D : appeler la BD proprement.", lesson: ["clean", 4],
      exo: {
        enonce: "Ce Use Case appelle MySQL directement depuis la couche métier.",
        probleme: "CreerUtilisateur fait new MySQL() : la couche interne (métier) dépend de la technique (BDD). En Clean Archi, c'est interdit — la règle de dépendance est violée.",
        mauvais: `class CreerUtilisateur {
  execute(data) {
    const db = new MySQL();     // ⚠️ couche interne → technique
    db.insert(data);
  }
}`,
        mission: "Corrige : définis une interface UserRepository, injecte-la au constructor, et appelle this.repo.save(data).",
        guide: [
          "Crée interface UserRepository { save(data); } (définie par la couche interne).",
          "Ajoute constructor(repo) { this.repo = repo; }",
          "Dans execute : remplace new MySQL() par this.repo.save(data);",
          "L'implémentation MySQL sera dans une classe externe qui implements UserRepository."
        ],
        indices: [
          "La couche interne doit DÉFINIR le contrat, la couche externe l'IMPLÉMENTE.",
          "Crée une interface UserRepository (interne) ; injecte une implémentation MySQL (externe)."
        ],
        solution: `interface UserRepository { save(data); }
class CreerUtilisateur {
  constructor(repo) { this.repo = repo; }
  execute(data) { this.repo.save(data); }
}
class MySQLUserRepository implements UserRepository { save(d){ /* SQL */ } }`,
        runTest: `const repo = { save(d){ console.log("SQL OK"); } };
new CreerUtilisateur(repo).execute({ name: "Hugo" });`
      },
      note: "Repository : la couche interne définit l'interface, l'externe l'implémente, on injecte → dépendance inversée + testable.",
      checkpoint: ["clean-06"] },
  ]},

  /* ---------- CHAPITRE 5 : CODE REVIEW ---------- */
  { chapitre: "5 · Réussir la Code Review", emoji: "🎯", steps: [
    { id: "r5-0", titre: "Le format et l'enjeu", pourquoi: "Savoir exactement ce qui t'attend le jour J.", lesson: ["boss", 0],
      note: "Oral individuel, code sous les yeux, déterminant (Bloc 3). Compétences C3.1 (qualité), C3.2 (outils), C3.3 (debug).", checkpoint: ["boss-03", "boss-09"] },
    { id: "r5-1", titre: "Justifier ses choix", pourquoi: "Le critère n°1 : prouver que tu as choisi, pas copié.", lesson: ["boss", 1],
      note: "Justifier en 3 temps : problème → solution → alternative écartée.", checkpoint: ["boss-05", "boss-01"] },
    { id: "r5-2", titre: "Débugger en direct", pourquoi: "La compétence C3.3, souvent demandée en live.", lesson: ["boss", 2],
      note: "Debug : Reproduire → Isoler → Corriger → VALIDER. Jamais corriger à l'aveugle.", checkpoint: ["boss-02"] },
    { id: "r5-3", titre: "Tests & validation (C3.2)", pourquoi: "Piège fréquent : citer des tests sans pouvoir les montrer.", lesson: ["boss", 4],
      note: "Unitaire = une unité isolée · Intégration = modules ensemble · E2E = parcours complet · Toujours les RELANCER devant l'évaluateur.", checkpoint: ["boss-06"] },
    { id: "r5-4", titre: "Vocabulaire, posture & synthèse", pourquoi: "La moitié de la note se joue dans la façon de parler.", lessons: [["boss", 3], ["boss", 5]],
      note: "Vocabulaire exact + posture ouverte + fil rouge couplage faible → interfaces → DIP → Repository → testabilité.", checkpoint: ["boss-04", "boss-07", "boss-08", "boss-10"] },
    { id: "r5-5", titre: "Maîtriser TON code (simulation oral)", pourquoi: "L'évaluateur navigue dans TON projet : tu dois t'y retrouver instantanément.", lesson: ["boss", 6],
      exo: {
        enonce: "À l'oral, l'évaluateur te demande où se trouve une fonctionnalité dans ton projet.",
        probleme: "Répondre « euh… c'est dans src quelque part » sans fichier précis, sans nom de fonction, sans principe utilisé = mauvaise note à l'oral.",
        mauvais: `# Mauvaise réponse à l'oral :
# « Euh… la connexion c'est dans src, je crois…
#  ou peut-être dans un controller… je sais plus trop. »`,
        mission: "Corrige : écris une réponse structurée pour TON projet (fichier exact, fonction, rôle, test).",
        guide: [
          "Ligne 1 — Fichier : chemin exact (ex. src/auth/LoginController.php).",
          "Ligne 2 — Fonction : nom + signature (ex. login(email, password)).",
          "Ligne 3 — Rôle : ce qu'elle fait + principe (Repository, injection, MVC…).",
          "Ligne 4 — Test : fichier de test que tu relancerais devant l'évaluateur."
        ],
        indices: [
          "Commence par le fichier, pas par « euh… c'est quelque part dans src ».",
          "Nomme le pattern ou principe utilisé (Repository, MVC, injection…)."
        ],
        solution: `# Bonne réponse à l'oral :
# Fichier : src/auth/LoginController.php
# Fonction : login(string $email, string $password): bool
# Rôle : valide via UserRepository (injection de dépendance — principe D)
# Test : phpunit tests/Auth/LoginControllerTest.php`,
        runnable: false
      },
      note: "Check-list finale : justifier chaque choix · savoir OÙ est chaque feature · montrer/relancer les tests · débugger en 4 temps · vocabulaire précis.",
      checkpoint: ["boss-01", "boss-05"] },
  ]},
];

window.ROADMAP = ROADMAP;

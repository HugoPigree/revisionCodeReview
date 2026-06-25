/* ============================================================
   BANQUE DE CONNAISSANCES — révision Code Review WEB3
   Sources : cours1 (POO/SOLID), cours2 (Design Patterns),
             clean_architecture_cour (Clean Archi)
   Types de cartes :
     - "qcm"  : 1 bonne réponse parmi options (answer = index)
     - "tf"   : vrai/faux (answer = true|false)
     - "flash": carte mémoire / "explique avec tes mots" (auto-évaluation)
   Chaque carte a une "explication" (feedback immédiat = méthode d'apprentissage).
   ============================================================ */

const WORLDS = [
  { id: "fond",     nom: "Fondations",        sous: "Ingénierie logicielle & POO", emoji: "🧱", couleur: "#5b8cff" },
  { id: "solid",    nom: "SOLID",             sous: "Les 5 principes de conception", emoji: "🪨", couleur: "#22c55e" },
  { id: "patterns", nom: "Design Patterns",   sous: "Solutions de conception réutilisables", emoji: "🧩", couleur: "#f59e0b" },
  { id: "clean",    nom: "Clean Architecture",sous: "Couches & règle de dépendance", emoji: "🏛️", couleur: "#a855f7" },
  { id: "boss",     nom: "Boss : Code Review",sous: "Simulation de l'oral déterminant", emoji: "🎯", couleur: "#ef4444" },
];

const CARDS = [

  /* ===================== MONDE 1 — FONDATIONS ===================== */
  {
    id: "fond-01", world: "fond", type: "qcm",
    q: "La « crise du logiciel » des années 70 est principalement due à…",
    options: [
      "Une augmentation de la puissance des machines et des logiciels de plus en plus complexes, avec des langages rudimentaires",
      "Le manque d'ordinateurs disponibles",
      "L'absence d'Internet",
      "Trop de frameworks concurrents"
    ],
    answer: 0,
    explication: "Plus de puissance + logiciels complexes + langages rudimentaires (Assembleur, Fortran, Cobol) → baisse de qualité, explosion des coûts, retards, fiabilité moindre. C'est ce qui a fait émerger l'ingénierie logicielle."
  },
  {
    id: "fond-02", world: "fond", type: "flash",
    q: "Donne la définition de l'ingénierie logicielle (esprit de la définition IEEE).",
    back: "« L'application d'une approche systématique, disciplinée et quantifiable au développement, à l'exploitation et à la maintenance du logiciel. » (IEEE) → Gérer la complexité, faciliter le travail en équipe, maîtriser les budgets, adopter méthodes et processus.",
    explication: "Mots-clés à ressortir à l'oral : systématique, disciplinée, quantifiable ; et l'objectif = maîtriser la complexité.",
    exemple: "Comme le bâtiment a ses normes, plans et contrôles pour ériger un immeuble sûr, l'ingénierie logicielle encadre la fabrication d'un logiciel."
  },
  {
    id: "fond-03", world: "fond", type: "qcm",
    q: "Parmi les 4 grands objectifs de la POO, lequel correspond à « un code facile à comprendre, modifier et améliorer sans introduire de régressions » ?",
    options: ["Extensibilité", "Maintenabilité", "Modularité", "Réutilisabilité"],
    answer: 1,
    explication: "Maintenabilité = comprendre/modifier/améliorer sans régression. Les 4 objectifs : Extensibilité, Adaptabilité/Réutilisabilité, Modularité, Maintenabilité.",
    exemple: "Une maison maintenable : on refait la peinture d'une pièce sans fissurer les murs des autres."
  },
  {
    id: "fond-04", world: "fond", type: "tf",
    q: "« Un logiciel ne s'use pas mais se détériore avec le temps. »",
    answer: true,
    explication: "Vrai. Causes : évolution des technologies, changement des besoins client, apparition de bugs. La maintenance peut représenter la majeure partie du temps de dev → à anticiper dès la conception."
  },
  {
    id: "fond-05", world: "fond", type: "qcm",
    q: "Quel élément est un SIGNE d'un code complexe ?",
    options: [
      "Un changement a de multiples impacts (effet domino)",
      "Le code a beaucoup de tests",
      "Le code utilise des interfaces",
      "Le code est documenté"
    ],
    answer: 0,
    explication: "Signes : difficile à modifier (impacts multiples), surcharge cognitive, « unknown unknown ». Causes : trop de dépendances, code obscur, incohérences, manque de doc, design fragile, dette technique."
  },
  {
    id: "fond-06", world: "fond", type: "flash",
    q: "Explique l'ENCAPSULATION avec tes propres mots.",
    back: "Regrouper les données et les méthodes qui les manipulent dans une même classe, ET limiter l'accès direct aux détails internes (visibilités). On définit comment l'objet doit être utilisé, indépendamment de son fonctionnement interne. C'est un des piliers de la POO.",
    explication: "À l'oral : « masque les détails inutiles, expose ce qui est important ». Le choix des visibilités (private/public/protected) est primordial."
  },
  {
    id: "fond-07", world: "fond", type: "flash",
    q: "Différence entre HÉRITAGE et COMPOSITION ?",
    back: "Héritage : définir une nouvelle classe À PARTIR d'une classe existante (la classe enfant possède méthodes/propriétés du parent) — relation « est un ». Composition : une classe UTILISE d'autres classes en ayant des instances en propriété — relation « a un / utilise ».",
    explication: "Règle pratique très appréciée en Code Review : « favoriser la composition plutôt que l'héritage » pour réduire le couplage."
  },
  {
    id: "fond-08", world: "fond", type: "qcm",
    q: "Quelle affirmation décrit un COUPLAGE FORT ?",
    options: [
      "Une modification d'une classe nécessite la modification de l'autre",
      "Les classes ne se connaissent pas",
      "Les classes communiquent via des interfaces",
      "Faible dépendance entre les classes"
    ],
    answer: 0,
    explication: "Couplage fort = modifier une classe oblige à modifier l'autre → code spaghetti (antipattern), difficile à isoler et tester. On vise le couplage faible."
  },
  {
    id: "fond-09", world: "fond", type: "flash",
    q: "Qu'est-ce que le POLYMORPHISME ? (grec : « plusieurs formes »)",
    back: "Baser son programme sur des types abstraits (interfaces / classes abstraites) plutôt que sur des classes concrètes. Fournir une interface commune à des classes de différents types. Permet d'interchanger les implémentations sans changer l'algorithme, et d'ajouter un comportement = ajouter une classe.",
    explication: "Le slogan GoF à citer : « program to interfaces, not implementations ». C'est le concept qui rend le code modulaire et flexible."
  },
  {
    id: "fond-10", world: "fond", type: "qcm",
    q: "Une INTERFACE en POO, c'est…",
    options: [
      "Une classe qu'on peut instancier directement",
      "Un « contrat » : un ensemble de signatures de méthodes que la classe qui l'implémente DOIT définir",
      "Une variable globale",
      "Un fichier de configuration"
    ],
    answer: 1,
    explication: "L'interface décrit un comportement à implémenter (signatures uniquement), ne peut pas être instanciée, définit un nouveau TYPE. Une classe qui implémente A est de type A. Plusieurs classes peuvent implémenter la même interface → famille de classes."
  },
  {
    id: "fond-11", world: "fond", type: "qcm",
    q: "Que signifie l'acronyme DRY ?",
    options: [
      "Don't Repeat Yourself",
      "Do Repeat Yourself",
      "Don't Read Yet",
      "Deploy, Run, Yield"
    ],
    answer: 0,
    explication: "DRY = Don't Repeat Yourself (ne pas dupliquer le code/la connaissance). Les 3 bonnes pratiques du cours : DRY, YAGNI (You Aren't Gonna Need It), KISS (Keep It Simple, Stupid).",
    exemple: "Renseigner son adresse une seule fois dans un formulaire qui la réutilise, au lieu de la retaper à chaque champ."
  },
  {
    id: "fond-12", world: "fond", type: "qcm",
    q: "« YAGNI » nous invite à…",
    options: [
      "Ajouter toutes les fonctionnalités possibles à l'avance",
      "Ne pas coder une fonctionnalité tant qu'elle n'est pas réellement nécessaire",
      "Répéter le code pour aller plus vite",
      "Toujours utiliser un design pattern"
    ],
    answer: 1,
    explication: "YAGNI = You Aren't Gonna Need It : ne pas anticiper des besoins hypothétiques. Couplé à KISS (rester simple) et DRY (ne pas dupliquer).",
    exemple: "Ne pas acheter une remorque aujourd'hui pour un déménagement hypothétique dans 5 ans."
  },
  {
    id: "fond-13", world: "fond", type: "qcm",
    q: "Tu écris une fonction qui accepte n'importe quel « Véhicule » (voiture, vélo, bus) sans se soucier du type précis. De quel concept s'agit-il ?",
    options: ["Abstraction", "Duplication", "Compilation", "Héritage multiple"],
    answer: 0,
    explication: "Abstraction = raisonner sur l'idée générale (« Véhicule ») en ignorant les détails de chaque type concret.",
    exemple: "Le panneau « véhicules interdits » concerne autos, motos et camions sans les nommer un par un."
  },
  {
    id: "fond-14", world: "fond", type: "qcm",
    q: "Une même méthode `dessiner()` appelée sur un Cercle, un Carré ou un Triangle produit à chaque fois le bon dessin, sans `if` sur le type. Quel concept ?",
    options: ["Polymorphisme", "Encapsulation", "Singleton", "Couplage fort"],
    answer: 0,
    explication: "Polymorphisme = le même appel (dessiner()) prend « plusieurs formes » selon l'objet réel, grâce à une interface/abstraction commune. Plus besoin de if/switch sur le type.",
    exemple: "Une télécommande universelle : le bouton ON agit correctement sur la TV, la box ou la hi-fi, sans bouton différent pour chacune."
  },

  /* ===================== MONDE 2 — SOLID =====================
     Chaque carte porte la LETTRE concernée (champ "lettre", affiché en badge). */
  {
    id: "solid-00", world: "solid", type: "qcm", lettre: "SOLID",
    q: "Que signifie l'acronyme SOLID, et qui l'a introduit ?",
    options: [
      "5 principes de conception de Robert C. Martin (~2000) : Single resp., Open/closed, Liskov, Interface segregation, Dependency inversion",
      "5 patterns du Gang of Four (1995)",
      "Les 5 couches de la Clean Architecture",
      "Une méthode de gestion de projet agile"
    ],
    answer: 0,
    explication: "SOLID = S (Single Responsibility), O (Open/Closed), L (Liskov Substitution), I (Interface Segregation), D (Dependency Inversion). Introduit par Robert C. Martin (~2000). À ne pas confondre avec le GoF (patterns, 1995) ni la Clean Architecture (2012).",
    exemple: "Comme « PESTEL » en économie, SOLID est un moyen mnémotechnique : chaque lettre = un principe à retenir."
  },
  {
    id: "solid-01", world: "solid", type: "flash", lettre: "S",
    q: "Lettre S — Énonce le principe et dis ce que veut dire le « S ».",
    back: "S = Single Responsibility Principle. « Il ne devrait jamais y avoir plus d'une raison de changer une classe. » → chaque classe a UNE seule responsabilité.",
    explication: "Pour l'oral : une classe = une seule raison de changer. Si tu la modifies pour 2 motifs différents (logique métier ET formatage), c'est une violation du S."
  },
  {
    id: "solid-02", world: "solid", type: "qcm", lettre: "S",
    q: "Une classe `Rapport` qui (1) calcule des données ET (2) gère leur impression PDF viole quelle lettre de SOLID ?",
    options: ["O (Open/Closed)", "S (Single Responsibility)", "L (Liskov)", "I (Interface Segregation)"],
    answer: 1,
    explication: "Le S (Single Responsibility) : deux raisons de changer (la règle de calcul vs le format d'impression) → on sépare en deux classes."
  },
  {
    id: "solid-03", world: "solid", type: "flash", lettre: "O",
    q: "Lettre O — Énonce le principe et dis ce que veut dire le « O ».",
    back: "O = Open/Closed Principle. « Les entités doivent être ouvertes à l'extension mais fermées à la modification. » → on ajoute du comportement sans modifier le code existant (via abstraction/polymorphisme).",
    explication: "Les patterns Strategy et Factory servent typiquement à respecter le O : ajouter une nouvelle classe plutôt que de modifier un gros switch."
  },
  {
    id: "solid-04", world: "solid", type: "qcm", lettre: "O",
    q: "Tu ajoutes un nouveau moyen de paiement et tu dois à chaque fois rallonger un gros `switch` existant. Quelle lettre de SOLID est bafouée ?",
    options: ["O (Open/Closed)", "L (Liskov)", "S (Single Responsibility)", "D (Dependency Inversion)"],
    answer: 0,
    explication: "Le O (Open/Closed) : on devrait pouvoir ÉTENDRE (ajouter une classe `PaiementX` implémentant une interface) sans MODIFIER le code existant. Le switch à rallonge est le symptôme classique."
  },
  {
    id: "solid-05", world: "solid", type: "flash", lettre: "L",
    q: "Lettre L — Énonce le principe et dis ce que veut dire le « L ».",
    back: "L = Liskov Substitution Principle. Une sous-classe doit pouvoir REMPLACER sa classe parente sans casser le comportement attendu (les fonctions qui utilisent la classe de base doivent fonctionner avec les classes dérivées sans le savoir).",
    explication: "Violation classique : `Carré extends Rectangle` qui casse `setWidth/setHeight`. Si la sous-classe surprend l'appelant, le L est violé."
  },
  {
    id: "solid-06", world: "solid", type: "qcm", lettre: "L",
    q: "Un `Manchot extends Oiseau` hérite de `voler()` mais lève une exception car un manchot ne vole pas. Quelle lettre de SOLID est violée ?",
    options: ["L (Liskov)", "I (Interface Segregation)", "S (Single Responsibility)", "O (Open/Closed)"],
    answer: 0,
    explication: "Le L (Liskov) : Manchot ne peut pas se substituer à Oiseau sans casser le contrat (voler). La hiérarchie d'héritage est mal pensée. (On peut aussi y voir un I : séparer l'interface `Volant`.)"
  },
  {
    id: "solid-07", world: "solid", type: "flash", lettre: "I",
    q: "Lettre I — Énonce le principe et dis ce que veut dire le « I ».",
    back: "I = Interface Segregation Principle. « Un client ne doit pas être forcé de dépendre d'une interface qu'il n'utilise pas. » → préférer plusieurs petites interfaces ciblées à une grosse interface fourre-tout.",
    explication: "Symptôme : une classe implémente une interface mais laisse des méthodes vides ou en `throw NotImplemented` car elles ne la concernent pas."
  },
  {
    id: "solid-08", world: "solid", type: "qcm", lettre: "I",
    q: "Une interface `Machine` impose `imprimer()`, `scanner()`, `faxer()`. Une simple imprimante doit laisser `scanner()` et `faxer()` vides. Quelle lettre de SOLID est violée ?",
    options: ["I (Interface Segregation)", "D (Dependency Inversion)", "L (Liskov)", "S (Single Responsibility)"],
    answer: 0,
    explication: "Le I (Interface Segregation) : on force un client à dépendre de méthodes inutiles. Solution : découper en `Imprimante`, `Scanner`, `Fax`."
  },
  {
    id: "solid-09", world: "solid", type: "flash", lettre: "D",
    q: "Lettre D — Énonce le principe et dis ce que veut dire le « D ».",
    back: "D = Dependency Inversion Principle. « Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau ; les deux dépendent d'abstractions. » → on dépend d'interfaces, pas d'implémentations concrètes.",
    explication: "Fondement de l'injection de dépendance et du pattern Repository (Clean Architecture). NB : le cours le cite parfois « Dependency Injection », mais le principe est l'INVERSION de dépendance."
  },
  {
    id: "solid-10", world: "solid", type: "qcm", lettre: "D",
    q: "Un `OrderService` qui fait `new MySQLDatabase()` directement à l'intérieur viole surtout quelle lettre de SOLID ?",
    options: [
      "D (Dependency Inversion)",
      "S (Single Responsibility)",
      "L (Liskov)",
      "Aucune, c'est une bonne pratique"
    ],
    answer: 0,
    explication: "Le D (Dependency Inversion) : le module de haut niveau dépend d'une implémentation concrète (MySQL) au lieu d'une abstraction (interface Repository injectée). Solution : injecter une interface."
  },
  {
    id: "solid-11", world: "solid", type: "tf", lettre: "L",
    q: "Le L (Liskov) autorise une sous-classe à changer le contrat attendu par la classe parente.",
    answer: false,
    explication: "Faux — c'est l'inverse. La sous-classe doit RESPECTER le contrat de la parente pour pouvoir la substituer sans surprise."
  },
  {
    id: "solid-12", world: "solid", type: "qcm", lettre: "D",
    q: "Quelle lettre de SOLID est la plus directement liée au polymorphisme et à « program to interfaces » ?",
    options: ["S (Single Responsibility)", "D (Dependency Inversion)", "I (Interface Segregation)", "O (Open/Closed)"],
    answer: 1,
    explication: "Le D (Dependency Inversion) : dépendre d'abstractions. Le polymorphisme est le mécanisme technique qui permet de le respecter (le O en bénéficie aussi)."
  },
  {
    id: "solid-13", world: "solid", type: "qcm", lettre: "SOLID",
    q: "Dans l'acronyme SOLID, dans quel ordre se lisent les principes ?",
    options: [
      "Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion",
      "Singleton, Observer, Liskov, Inversion, DRY",
      "Simple, Ouvert, Logique, Interface, Dépendance",
      "Structure, Objet, Logique, Implémentation, Données"
    ],
    answer: 0,
    explication: "S-O-L-I-D : Single Responsibility · Open/Closed · Liskov Substitution · Interface Segregation · Dependency Inversion. Savoir réciter l'acronyme dans l'ordre est un réflexe attendu à l'oral."
  },

  /* ===================== MONDE 3 — DESIGN PATTERNS ===================== */
  {
    id: "pat-01", world: "patterns", type: "flash",
    q: "Qu'est-ce qu'un design pattern ?",
    back: "Une architecture/solution RÉUTILISABLE qui répond à un problème de conception RÉCURRENT. Décrit par : Contexte/Problématique → Solution → Architecture de code. Ce n'est pas un algorithme, mais une direction adaptable au contexte.",
    explication: "Origine : concept d'architecture (C. Alexander, 1979), démocratisé en programmation par le Gang of Four (1995). Avantage : ne pas réinventer la roue + faciliter la communication entre devs.",
    exemple: "Comme une recette de cuisine éprouvée : une solution type qu'on réutilise et adapte au lieu de tout réinventer."
  },
  {
    id: "pat-02", world: "patterns", type: "qcm",
    q: "Les 23 design patterns du GoF se répartissent en 3 catégories. Lesquelles ?",
    options: [
      "Creational, Structural, Behavioral",
      "Frontend, Backend, Database",
      "Simple, Moyen, Complexe",
      "Public, Private, Protected"
    ],
    answer: 0,
    explication: "Creational (création d'objets), Structural (composition de classes/objets), Behavioral (interactions et responsabilités).",
    exemple: "Dans une cuisine : fabriquer les plats (Creational), dresser l'assiette (Structural), coordonner la brigade (Behavioral)."
  },
  {
    id: "pat-03", world: "patterns", type: "qcm",
    q: "Dans quelle famille classe-t-on Factory, Singleton, Builder et Prototype ?",
    options: ["Behavioral", "Structural", "Creational", "Functional"],
    answer: 2,
    explication: "Creational (patterns de création). Structural : Decorator, Facade, Adapter, Bridge, Composite, Proxy. Behavioral : Strategy, Observer, Iterator, Template Method, Command, State, Visitor."
  },
  {
    id: "pat-04", world: "patterns", type: "qcm",
    q: "Problème : « Comment modifier un algorithme dynamiquement au runtime ? » (ex : calcul de frais de port). Quel pattern ?",
    options: ["Singleton", "Strategy", "Decorator", "Factory"],
    answer: 1,
    explication: "STRATEGY : on utilise la composition pour déléguer une partie de l'algo à une autre classe ; chaque variation = une classe dédiée regroupée par une interface (famille). On peut alors changer la stratégie au runtime."
  },
  {
    id: "pat-05", world: "patterns", type: "qcm",
    q: "Problème : « S'assurer qu'une instance est unique dans tout le projet » (ex : connexion BD, config). Quel pattern ?",
    options: ["Factory", "Strategy", "Singleton", "Decorator"],
    answer: 2,
    explication: "SINGLETON : constructeur `private` + méthode statique qui retourne l'unique instance → un seul point d'accès global."
  },
  {
    id: "pat-06", world: "patterns", type: "qcm",
    q: "Problème : « Rendre un système indépendant de ses classes concrètes / ajouter des classes sans modifier le code qui les utilise. » Quel pattern ?",
    options: ["Factory", "Singleton", "Observer", "Decorator"],
    answer: 0,
    explication: "FACTORY : on délègue l'instanciation à une classe dédiée dont la méthode retourne une INTERFACE → on évite le tight coupling aux classes concrètes (et on respecte l'OCP)."
  },
  {
    id: "pat-07", world: "patterns", type: "qcm",
    q: "Problème : « Ajouter dynamiquement de nouveaux comportements à un objet, de façon récursive, tout en respectant SOLID. » Quel pattern ?",
    options: ["Strategy", "Decorator", "Factory", "Singleton"],
    answer: 1,
    explication: "DECORATOR : chaque comportement = une classe spécifique qui encapsule (wrap) dynamiquement un objet, de manière récursive. Respecte l'OCP (extension sans modification)."
  },
  {
    id: "pat-08", world: "patterns", type: "flash",
    q: "Explique le pattern MVC : ses 3 parties et leur rôle.",
    back: "Model : toute la logique des données. View : tout l'affichage. Controller : la gestion des interactions utilisateur. → découpe une interface graphique pour afficher des données, permettre l'interaction, et mettre à jour les données.",
    explication: "La plupart des frameworks web sont basés sur MVC. Exemples d'usage : site web, jeu vidéo, application desktop."
  },
  {
    id: "pat-09", world: "patterns", type: "tf",
    q: "Un design pattern définit un algorithme précis qu'il faut suivre à la lettre.",
    answer: false,
    explication: "Faux. Un pattern définit une ARCHITECTURE, pas un algorithme. C'est une direction adaptable au contexte, pas une recette figée."
  },
  {
    id: "pat-10", world: "patterns", type: "tf",
    q: "Il faut utiliser les design patterns systématiquement, partout où c'est possible.",
    answer: false,
    explication: "Faux. Un pattern répond à une problématique PRÉCISE. L'appliquer sans besoin réel = sur-ingénierie (contraire de KISS/YAGNI)."
  },
  {
    id: "pat-11", world: "patterns", type: "qcm",
    q: "Quel pattern utilise typiquement la COMPOSITION pour déléguer une variation d'algorithme à une classe interchangeable ?",
    options: ["Singleton", "Strategy", "Factory", "MVC"],
    answer: 1,
    explication: "Strategy repose sur la composition (l'objet contient une référence vers une stratégie) + une interface commune pour interchanger les variantes."
  },

  /* ===================== MONDE 4 — CLEAN ARCHITECTURE ===================== */
  {
    id: "clean-01", world: "clean", type: "qcm",
    q: "La Clean Architecture organise le code en couches indépendantes centrées autour de…",
    options: [
      "La base de données",
      "L'interface utilisateur",
      "La logique métier (le domaine)",
      "Le framework choisi"
    ],
    answer: 2,
    explication: "Conception centrée sur la logique métier. Buts : réduire le couplage, faciliter les tests, dépendance MINIMALE aux frameworks et outils externes (BD, libs…). Théorisée par R.C. Martin (2012).",
    exemple: "Un restaurant centré sur ses recettes : on peut changer la déco (interface) ou le fournisseur (base de données) sans toucher à la cuisine (métier)."
  },
  {
    id: "clean-02", world: "clean", type: "flash",
    q: "Cite les 4 couches de la Clean Architecture, de l'intérieur vers l'extérieur, avec leur rôle.",
    back: "1) Entities (Domain) : structures + règles métier de base. 2) Use Cases : logique métier spécifique à l'application (orchestration des règles). 3) Adapters (controllers/presenters) : convertissent les données entre use cases et le monde extérieur. 4) External Interfaces : détails techniques (BD, UI, framework, API tierces).",
    explication: "Ordre = du cœur vers l'extérieur. Plus on va vers l'intérieur, plus c'est métier et stable ; plus on va vers l'extérieur, plus c'est technique et volatile."
  },
  {
    id: "clean-03", world: "clean", type: "qcm",
    q: "La RÈGLE DE DÉPENDANCE en Clean Architecture stipule que…",
    options: [
      "Les couches internes dépendent des couches externes",
      "Les dépendances pointent vers l'INTÉRIEUR : les couches externes dépendent des internes, jamais l'inverse",
      "Toutes les couches dépendent de la base de données",
      "Il n'y a aucune règle de dépendance"
    ],
    answer: 1,
    explication: "Les dépendances circulent UNIQUEMENT vers l'intérieur. Le cœur métier ne dépend ni de l'UI, ni de la BD, ni du framework. Une modif des couches externes ne doit pas affecter les couches internes."
  },
  {
    id: "clean-04", world: "clean", type: "tf",
    q: "En Clean Architecture, la couche Use Case peut dépendre directement de la classe concrète MySQL de la couche externe.",
    answer: false,
    explication: "Faux : ça violerait la règle de dépendance. On inverse la dépendance via une INTERFACE (pattern Repository) + injection de dépendance : la couche interne définit l'interface, la couche externe l'implémente."
  },
  {
    id: "clean-05", world: "clean", type: "flash",
    q: "Qu'est-ce qu'un DTO (Data Transfer Object) et pourquoi l'utiliser ?",
    back: "Objet simple SANS méthode, qui sert uniquement à transporter des données entre les couches. On évite de faire « remonter » les entités du domaine dans les couches supérieures, pour ne pas trop coupler l'UI/les outils aux données du domaine. Permet aussi d'adopter le format le plus pratique.",
    explication: "Les DTO transitent par les boundary (interfaces définissant ce qui entre/sort d'une couche). À l'oral : « DTO = transport, sans logique »."
  },
  {
    id: "clean-06", world: "clean", type: "qcm",
    q: "Le pattern REPOSITORY sert à…",
    options: [
      "Appeler la BD directement depuis le Use Case",
      "Inverser la dépendance vers la BD via une interface, pour respecter la règle de dépendance",
      "Stocker des fichiers sur le disque",
      "Remplacer le pattern MVC"
    ],
    answer: 1,
    explication: "Un appel direct à la BD depuis un Use Case violerait la règle de dépendance. Le Repository expose une INTERFACE (définie dans la couche interne) ; on utilise l'injection de dépendance + le polymorphisme pour une relation flexible avec le stockage."
  },
  {
    id: "clean-07", world: "clean", type: "qcm",
    q: "Qu'est-ce qu'une BOUNDARY en Clean Architecture ?",
    options: [
      "Une interface définissant quelles données entrent/sortent à travers les couches",
      "Le serveur de production",
      "Une variable globale partagée",
      "Le nom de la base de données"
    ],
    answer: 0,
    explication: "Les boundary sont les interfaces par lesquelles les données traversent les couches, garantissant que les dépendances pointent vers l'intérieur. Les DTO transitent par ces boundary."
  },
  {
    id: "clean-08", world: "clean", type: "qcm",
    q: "Quel est le rôle de la couche ADAPTER (controllers / presenters) ?",
    options: [
      "Contenir les règles métier de base",
      "Faire le lien entre les use cases et les couches externes en adaptant les données aux formats nécessaires",
      "Stocker physiquement les données",
      "Définir les entités du domaine"
    ],
    answer: 1,
    explication: "Adapter = pont entre use cases et monde externe : adapte les données au format attendu par l'UI ou d'autres outils (controllers en entrée, presenters en sortie)."
  },
  {
    id: "clean-09", world: "clean", type: "tf",
    q: "Un changement dans l'infrastructure (BD, framework) ne doit avoir aucun impact sur les couches internes.",
    answer: true,
    explication: "Vrai — c'est tout l'intérêt : indépendance aux outils. On peut changer de BD ou d'UI sans toucher au cœur métier, ce qui rend aussi les tests plus simples."
  },
  {
    id: "clean-10", world: "clean", type: "qcm",
    q: "Quel est un INCONVÉNIENT reconnu de la Clean Architecture ?",
    options: [
      "Le code n'est pas testable",
      "Architecture complexe : beaucoup de classes + courbe d'apprentissage",
      "Le code est fortement couplé au framework",
      "Impossible de faire évoluer le code"
    ],
    answer: 1,
    explication: "Inconvénients : beaucoup de classes, courbe d'apprentissage. Avantages : flexible, testable, indépendant des frameworks/outils, évolutif. Sache présenter les deux côtés à l'oral."
  },
  {
    id: "clean-11", world: "clean", type: "flash",
    q: "Cite le principe « Separation of Concerns » appliqué à la Clean Architecture.",
    back: "Chaque couche ne s'occupe que d'une partie du système (séparation des responsabilités). Couplé à : règle de dépendance vers l'intérieur, communication par abstractions (interfaces) pour faciliter les tests, et indépendance aux outils.",
    explication: "C'est le SRP (Single Responsibility) appliqué à l'échelle de l'architecture, pas seulement de la classe.",
    exemple: "Comme dans une entreprise : la comptabilité, le commercial et la logistique ont chacun leur rôle, sans empiéter."
  },

  /* ===================== BOSS — CODE REVIEW (transversal) ===================== */
  {
    id: "boss-01", world: "boss", type: "flash",
    q: "[Posture] L'évaluateur critique un choix dans ton code. Quelle est la bonne attitude ?",
    back: "Accepter la remarque sans se braquer, expliquer le contexte/contrainte du choix, et proposer une amélioration. La posture face à la critique COMPTE dans la note (montrer sa capacité de progression).",
    explication: "Piège cité dans la fiche : « se braquer face aux critiques ». L'ouverture à l'amélioration continue est un critère de C3.1."
  },
  {
    id: "boss-02", world: "boss", type: "flash",
    q: "[C3.3 Debug] Décris ta méthode pour traiter un bug en direct.",
    back: "1) Reproduire le bug (cas minimal). 2) Isoler la cause (logs, debugger, bissection, lire la stack). 3) Corriger. 4) Valider la correction (relancer le test / le cas qui échouait + non-régression).",
    explication: "C3.3 attend : identifier → isoler → corriger → VALIDER. Ne jamais corriger « à l'aveugle » sans prouver que c'est résolu."
  },
  {
    id: "boss-03", world: "boss", type: "qcm",
    q: "L'épreuve Code Review est décrite comme…",
    options: [
      "Un oral de groupe sans enjeu",
      "Une épreuve DÉTERMINANTE, individuelle, qui valide le Bloc 3",
      "Un QCM écrit",
      "Optionnelle"
    ],
    answer: 1,
    explication: "Oral technique INDIVIDUEL, code sous les yeux, ~20-30 min. L'évaluateur navigue dans ton code, pose des questions, peut demander une modif en direct. Détermine la validation du B3."
  },
  {
    id: "boss-04", world: "boss", type: "flash",
    q: "[C3.1 Vocabulaire] Pourquoi éviter « le truc qui… » à l'oral ?",
    back: "Le vocabulaire technique précis (encapsulation, injection de dépendance, polymorphisme, interface, couplage, use case, repository, DTO…) est un critère noté. Le flou (« le truc qui… ») est un piège explicite qui fait baisser la note.",
    explication: "Entraîne-toi à nommer exactement : pattern, couche, principe SOLID, type de test."
  },
  {
    id: "boss-05", world: "boss", type: "flash",
    q: "[C3.1 Justification] On te demande « pourquoi as-tu utilisé ce pattern ici ? ». Structure de réponse ?",
    back: "1) Le PROBLÈME que tu avais (contexte). 2) Pourquoi ce pattern y répond (sa raison d'être). 3) L'alternative écartée et pourquoi. → Tu prouves que tu as choisi, pas copié.",
    explication: "Check-list de la fiche : « Je peux justifier chaque choix d'architecture, pattern et librairie. » Le jury cherche à repérer le code copié/généré sans compréhension."
  },
  {
    id: "boss-06", world: "boss", type: "qcm",
    q: "Quels types de tests peux-tu citer dans ta stratégie de validation (post-mortem) ?",
    options: [
      "Unitaires, intégration, end-to-end (E2E), manuels",
      "Uniquement les tests manuels",
      "Aucun, les tests sont inutiles",
      "Seulement les tests de compilation"
    ],
    answer: 0,
    explication: "Cite-les ET sache les MONTRER/relancer (piège : « citer des tests sans pouvoir en montrer la mise en œuvre »). Unitaire = une unité isolée ; intégration = plusieurs modules ensemble ; E2E = parcours complet."
  },
  {
    id: "boss-07", world: "boss", type: "qcm",
    q: "Pour un post-mortem réussi (C2.2), il faut surtout…",
    options: [
      "Présenter le projet comme une vitrine parfaite",
      "Rester sur les symptômes des bugs",
      "Identifier les causes RACINES, mesurer l'impact, montrer les ajustements et proposer des améliorations réalisables",
      "Laisser une seule personne parler"
    ],
    answer: 2,
    explication: "« Validée » = causes racines identifiées, impact mesuré, tests pertinents, ajustements démontrés et défendus. Pièges : rester sur les symptômes, ne pas assumer les erreurs, un seul membre qui parle."
  },
  {
    id: "boss-08", world: "boss", type: "flash",
    q: "[Synthèse] Relie : couplage faible, interfaces, DIP, Repository, testabilité.",
    back: "Dépendre d'interfaces (DIP) → couplage faible → on peut injecter une implémentation (Repository) ou un mock → donc code facilement TESTABLE et indépendant des outils. C'est le fil rouge POO → SOLID → Clean Architecture.",
    explication: "Si tu sais dérouler cette chaîne logique à l'oral, tu démontres une vraie compréhension transversale (très valorisé)."
  },
  {
    id: "boss-09", world: "boss", type: "qcm",
    q: "« Code lisible, structuré, conforme aux standards et aux specs ; vocabulaire précis ; ouvert à l'amélioration » est le repère « Validée » de quelle compétence ?",
    options: ["C2.1", "C3.1", "C3.2", "C3.3"],
    answer: 1,
    explication: "C3.1 (programmer en respectant les standards de qualité). C3.2 = maîtrise du framework/outils ; C3.3 = correction de bugs/optimisation."
  },
  {
    id: "boss-10", world: "boss", type: "flash",
    q: "[Check-list finale] Cite les 5 points de la check-list express avant l'épreuve Code Review.",
    back: "1) Justifier chaque choix d'archi/pattern/lib. 2) Savoir OÙ se trouve chaque fonctionnalité dans le code. 3) Montrer et relancer la stratégie de tests. 4) Reproduire/isoler/corriger un bug en direct. 5) Utiliser le vocabulaire technique précis du stack.",
    explication: "Si tu coches ces 5 points sur ton projet flipper, tu es prêt. (On reliera ces points à ton code réel quand tu me le donneras.)"
  },
];

// Exposé en global pour un usage simple en file:// (pas de modules)
window.WORLDS = WORLDS;
window.CARDS = CARDS;

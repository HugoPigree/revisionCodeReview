/* ============================================================
   COURS — contenu pédagogique structuré
   Méthodes appliquées (recherche en sciences cognitives) :
   - Chunking / microlearning : 1 idée par section
   - Exemples concrets + analogies : ancrer l'abstrait
   - Élaboration : "pourquoi" + connexions entre notions
   - Dual coding : schémas ASCII / emojis en appui du texte
   - Point clé (cle) : la phrase à ressortir à l'oral
   Chaque cours se termine par un rappel actif (retrieval) automatique.

   Structure : LESSONS[worldId] = { intro, sections:[{h, html, cle}] }
   ============================================================ */

const LESSONS = {

  /* ===================== FONDATIONS ===================== */
  fond: {
    intro: "Le socle : pourquoi on s'embête à « bien » coder, et les concepts POO qui rendent un code souple. Tout le reste (SOLID, patterns, clean archi) découle de ces idées.",
    sections: [
      {
        h: "Pourquoi l'ingénierie logicielle existe",
        html: `
          <p>Dans les années 70, c'est la <strong>« crise du logiciel »</strong> : les machines deviennent puissantes, les logiciels énormes, mais les langages restent rudimentaires (Assembleur, Fortran, Cobol). Résultat : <strong>qualité en baisse, coûts qui explosent, retards, bugs</strong>.</p>
          <p>D'où l'<strong>ingénierie logicielle</strong> : « l'application d'une approche <em>systématique, disciplinée et quantifiable</em> » au développement et à la <strong>maintenance</strong> (déf. IEEE). But : <strong>maîtriser la complexité</strong> et travailler en équipe sans tout casser.</p>
          <p>🔌 <em>Analogie :</em> sans plan ni normes, construire un immeuble de 40 étages comme on bricole une cabane → ça s'effondre. Le code, c'est pareil.</p>`,
        cle: "L'ingénierie logicielle = méthode systématique pour maîtriser la complexité et la maintenance."
      },
      {
        h: "Les 4 objectifs d'un bon code",
        html: `
          <ul>
            <li><strong>Extensibilité</strong> : ajouter des fonctionnalités facilement.</li>
            <li><strong>Réutilisabilité / Adaptabilité</strong> : réutiliser du code dans plusieurs contextes.</li>
            <li><strong>Modularité</strong> : des briques indépendantes, interchangeables.</li>
            <li><strong>Maintenabilité</strong> : comprendre, modifier, améliorer <em>sans introduire de régression</em>.</li>
          </ul>
          <p>⚠️ « Un logiciel ne s'use pas, mais se <strong>détériore</strong> » : techno qui évolue, besoins qui changent, bugs qui apparaissent. La <strong>maintenance peut être la majeure partie</strong> du temps de dev → on l'anticipe dès la conception.</p>`,
        cle: "Extensibilité, réutilisabilité, modularité, maintenabilité — la maintenabilité est le nerf de la guerre."
      },
      {
        h: "Encapsulation",
        html: `
          <p>L'<strong>encapsulation</strong> = regrouper les données et les méthodes qui les manipulent dans une classe, ET <strong>limiter l'accès</strong> aux détails internes via les visibilités (<code>private</code>, <code>public</code>…).</p>
          <p>🚗 <em>Analogie :</em> une voiture expose un volant et des pédales (interface publique) ; tu n'as pas accès à l'injection moteur (privé). Tu sais l'<em>utiliser</em> sans connaître son fonctionnement interne.</p>
          <pre><code>class CompteBancaire {
  private float solde;            // caché
  public void deposer(float m) { // exposé, contrôlé
    if (m > 0) this.solde += m;
  }
}</code></pre>
          <p>Le choix des visibilités est <strong>primordial</strong> : il définit comment l'objet doit être utilisé.</p>`,
        cle: "Encapsulation = masquer les détails internes, exposer une interface contrôlée."
      },
      {
        h: "Héritage vs Composition",
        html: `
          <p><strong>Héritage</strong> (« est un ») : une classe dérive d'une autre et hérite de ses méthodes/propriétés. <code>Chien extends Animal</code>.</p>
          <p><strong>Composition</strong> (« a un / utilise ») : une classe contient des instances d'autres classes. <code>Voiture</code> a un <code>Moteur</code>.</p>
          <p>👉 Règle d'or très appréciée en Code Review : <strong>« privilégier la composition à l'héritage »</strong>. L'héritage crée un couplage fort (changer le parent casse les enfants) ; la composition est plus flexible.</p>`,
        cle: "Héritage = « est un » (rigide) ; Composition = « utilise » (flexible). Préférer la composition."
      },
      {
        h: "Couplage fort / couplage faible",
        html: `
          <p>Le <strong>couplage</strong> mesure l'interdépendance entre deux classes.</p>
          <ul>
            <li><strong>Couplage fort</strong> 🔗 : modifier une classe oblige à modifier l'autre → « code spaghetti », difficile à isoler et à <strong>tester</strong>.</li>
            <li><strong>Couplage faible</strong> 🪢 : faible dépendance → on change une partie sans casser le reste.</li>
          </ul>
          <p>💡 <em>Élaboration :</em> tout l'objectif de SOLID et de la Clean Architecture est de <strong>réduire le couplage</strong>. Garde ce fil rouge en tête.</p>`,
        cle: "Couplage fort = effet domino. On vise le couplage faible pour tester et faire évoluer."
      },
      {
        h: "Abstraction, polymorphisme & interfaces",
        html: `
          <p><strong>Abstraction</strong> : retirer les détails pour ne garder que l'essentiel d'un concept.</p>
          <p><strong>Interface</strong> : un <strong>contrat</strong> = un ensemble de signatures de méthodes. Une classe qui l'<code>implements</code> DOIT toutes les définir. On ne peut pas instancier une interface ; elle définit un <strong>type</strong>.</p>
          <p><strong>Polymorphisme</strong> (« plusieurs formes ») : baser le code sur des types abstraits plutôt que concrets, pour <strong>interchanger</strong> les implémentations sans changer l'algorithme.</p>
          <pre><code>interface MoyenPaiement { void payer(float m); }
class Carte implements MoyenPaiement { ... }
class Paypal implements MoyenPaiement { ... }
// le code dépend de MoyenPaiement, pas de Carte/Paypal</code></pre>
          <p>📣 Le slogan GoF : <strong>« Program to interfaces, not implementations »</strong>.</p>`,
        cle: "Polymorphisme = coder contre des abstractions (interfaces) pour interchanger les implémentations."
      },
      {
        h: "DRY, YAGNI, KISS",
        html: `
          <ul>
            <li><strong>DRY</strong> — <em>Don't Repeat Yourself</em> : pas de duplication de logique.</li>
            <li><strong>YAGNI</strong> — <em>You Aren't Gonna Need It</em> : ne code pas un besoin hypothétique.</li>
            <li><strong>KISS</strong> — <em>Keep It Simple, Stupid</em> : la solution la plus simple qui marche.</li>
          </ul>
          <p>💡 Ces trois principes <strong>équilibrent</strong> les patterns : un pattern inutile viole KISS et YAGNI. À l'oral, savoir dire « je n'ai PAS mis de pattern ici car ce serait de la sur-ingénierie » est un excellent signal.</p>`,
        cle: "DRY (pas de duplication), YAGNI (pas d'anticipation inutile), KISS (rester simple)."
      },
    ]
  },

  /* ===================== SOLID ===================== */
  solid: {
    intro: "5 principes de Robert C. Martin (~2000) pour un code maintenable et faiblement couplé. Le moyen mnémo : S-O-L-I-D. Pour chaque lettre : la définition + un symptôme de violation.",
    sections: [
      {
        h: "Vue d'ensemble : S · O · L · I · D",
        html: `
          <p>SOLID = 5 principes de conception orientée objet, introduits par <strong>Robert C. Martin (« Uncle Bob »), ~2000</strong> :</p>
          <ul>
            <li><strong>S</strong> — Single Responsibility Principle</li>
            <li><strong>O</strong> — Open/Closed Principle</li>
            <li><strong>L</strong> — Liskov Substitution Principle</li>
            <li><strong>I</strong> — Interface Segregation Principle</li>
            <li><strong>D</strong> — Dependency Inversion Principle</li>
          </ul>
          <p>💡 Tous poursuivent le même but : <strong>réduire le couplage</strong> et rendre le code <strong>extensible et testable</strong>.</p>`,
        cle: "SOLID = 5 principes (R.C. Martin, 2000) pour un code faiblement couplé, extensible et testable."
      },
      {
        h: "S — Single Responsibility Principle",
        html: `
          <p><strong>« Une classe ne devrait avoir qu'une seule raison de changer. »</strong> → une seule responsabilité.</p>
          <p>🚩 <em>Symptôme de violation :</em> une classe <code>Rapport</code> qui <em>calcule</em> les données ET gère leur <em>impression PDF</em> → deux raisons de changer (la règle de calcul, le format). On sépare en deux classes.</p>
          <p>🔗 C'est le SRP qui motive aussi le « Separation of Concerns » de la Clean Architecture.</p>`,
        cle: "S = Single Responsibility : une classe = une seule raison de changer."
      },
      {
        h: "O — Open/Closed Principle",
        html: `
          <p><strong>« Ouvert à l'extension, fermé à la modification. »</strong> → on ajoute du comportement sans toucher au code existant.</p>
          <p>🚩 <em>Symptôme :</em> un gros <code>switch</code> qu'on rallonge à chaque nouveau cas (nouveau moyen de paiement, nouveau type…).</p>
          <p>✅ <em>Solution :</em> abstraction + polymorphisme. Les patterns <strong>Strategy</strong> et <strong>Factory</strong> servent typiquement à respecter l'OCP : ajouter une classe au lieu de modifier le code.</p>`,
        cle: "O = Open/Closed : étendre par de nouvelles classes, sans modifier l'existant."
      },
      {
        h: "L — Liskov Substitution Principle",
        html: `
          <p><strong>« Une sous-classe doit pouvoir remplacer sa classe parente sans casser le comportement attendu. »</strong></p>
          <p>🚩 <em>Symptôme classique :</em> <code>Carré extends Rectangle</code>. Si <code>setWidth</code> modifie aussi la hauteur, un code qui manipulait un Rectangle est <strong>surpris</strong> → Liskov violé.</p>
          <p>💡 Règle : une sous-classe <strong>respecte le contrat</strong> du parent, elle ne le contredit pas.</p>`,
        cle: "L = Liskov : une sous-classe doit pouvoir se substituer au parent sans surprise."
      },
      {
        h: "I — Interface Segregation Principle",
        html: `
          <p><strong>« Un client ne doit pas dépendre d'une interface qu'il n'utilise pas. »</strong> → plusieurs petites interfaces spécifiques plutôt qu'une grosse interface fourre-tout.</p>
          <p>🚩 <em>Symptôme :</em> une classe implémente une interface mais laisse des méthodes <strong>vides</strong> ou en <code>throw NotImplemented</code> parce qu'elles ne la concernent pas.</p>
          <p>🍽️ <em>Analogie :</em> un menu géant où chacun ne commande que 2 plats → mieux vaut des menus dédiés.</p>`,
        cle: "I = Interface Segregation : des interfaces petites et ciblées, pas de fourre-tout."
      },
      {
        h: "D — Dependency Inversion Principle",
        html: `
          <p><strong>« Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. Les deux dépendent d'abstractions. »</strong></p>
          <p>🚩 <em>Symptôme :</em> un <code>OrderService</code> qui fait <code>new MySQLDatabase()</code> en dur.</p>
          <p>✅ <em>Solution :</em> on dépend d'une <strong>interface</strong> (ex. <code>Repository</code>) <strong>injectée</strong> de l'extérieur. C'est le fondement de l'injection de dépendance et du pattern Repository (Clean Architecture).</p>
          <pre><code>class OrderService {
  constructor(private repo: Repository) {} // abstraction injectée
}</code></pre>`,
        cle: "D = Dependency Inversion : dépendre d'abstractions (interfaces injectées), pas d'implémentations concrètes."
      },
    ]
  },

  /* ===================== DESIGN PATTERNS ===================== */
  patterns: {
    intro: "Un pattern = une solution éprouvée à un problème de conception RÉCURRENT. Ce n'est pas un algorithme, mais une architecture réutilisable. On voit les 5 patterns du cours et quand les (ne pas) utiliser.",
    sections: [
      {
        h: "Qu'est-ce qu'un design pattern ?",
        html: `
          <p>Concept né en architecture (C. Alexander, 1979), démocratisé en programmation par le <strong>Gang of Four (GoF), 1995</strong>. Un pattern se décrit par : <strong>Contexte/Problème → Solution → Architecture</strong>.</p>
          <p>Les 23 patterns du GoF se répartissent en <strong>3 familles</strong> :</p>
          <ul>
            <li><strong>Creational</strong> (création d'objets) : Factory, Singleton, Builder, Prototype</li>
            <li><strong>Structural</strong> (composition) : Decorator, Facade, Adapter, Bridge, Composite, Proxy</li>
            <li><strong>Behavioral</strong> (interactions) : Strategy, Observer, Iterator, Template Method, Command, State, Visitor</li>
          </ul>`,
        cle: "Pattern = solution réutilisable à un problème récurrent (GoF 1995), en 3 familles : Creational / Structural / Behavioral."
      },
      {
        h: "Strategy (Behavioral)",
        html: `
          <p><strong>Problème :</strong> changer un algorithme <em>au runtime</em> (ex. calcul de frais de port selon le transporteur).</p>
          <p><strong>Solution :</strong> la <strong>composition</strong> — déléguer la partie variable à une classe dédiée. Chaque variante implémente une <strong>interface</strong> commune (la famille), et on injecte la stratégie voulue.</p>
          <pre><code>interface Livraison { float cout(Panier p); }
class Express implements Livraison { ... }
class Standard implements Livraison { ... }
commande.setLivraison(new Express()); // interchangeable</code></pre>
          <p>🔗 Strategy = la mise en pratique directe de l'OCP et du polymorphisme.</p>`,
        cle: "Strategy : déléguer un algorithme interchangeable à des classes d'une même interface (composition)."
      },
      {
        h: "Singleton (Creational)",
        html: `
          <p><strong>Problème :</strong> garantir une <strong>instance unique</strong> dans tout le projet (connexion BD, configuration).</p>
          <p><strong>Solution :</strong> constructeur <code>private</code> + une méthode statique qui retourne l'unique instance.</p>
          <pre><code>class Config {
  private static instance;
  private constructor() {}
  static get() { return this.instance ??= new Config(); }
}</code></pre>
          <p>⚠️ À l'oral, sache nuancer : le Singleton crée un état global et peut compliquer les tests — à utiliser avec parcimonie.</p>`,
        cle: "Singleton : une seule instance globale via constructeur privé + accès statique."
      },
      {
        h: "Factory (Creational)",
        html: `
          <p><strong>Problème :</strong> rendre le système indépendant de ses <strong>classes concrètes</strong> ; ajouter de nouveaux types sans modifier le code client (éviter le <em>tight coupling</em>).</p>
          <p><strong>Solution :</strong> déléguer l'instanciation à une classe/méthode dédiée qui retourne une <strong>interface</strong>.</p>
          <pre><code>class TransportFactory {
  static create(type): Transport { // retourne l'interface
    if (type === "camion") return new Camion();
    if (type === "bateau") return new Bateau();
  }
}</code></pre>
          <p>🔗 Factory aide à respecter l'OCP et le DIP.</p>`,
        cle: "Factory : centraliser la création d'objets et retourner une interface, pour découpler des classes concrètes."
      },
      {
        h: "Decorator (Structural)",
        html: `
          <p><strong>Problème :</strong> ajouter <em>dynamiquement</em> des comportements à un objet, de façon récursive, sans casser SOLID.</p>
          <p><strong>Solution :</strong> chaque comportement = une classe qui <strong>encapsule (wrap)</strong> l'objet et lui ajoute sa touche.</p>
          <pre><code>new LaitDecorator(new SucreDecorator(new Cafe()));
// Café + sucre + lait, empilable à l'infini</code></pre>
          <p>☕ <em>Analogie :</em> on « emballe » un café avec des options successives. Respecte l'OCP (extension sans modification).</p>`,
        cle: "Decorator : empiler des comportements en encapsulant l'objet de façon récursive."
      },
      {
        h: "MVC + quand NE PAS utiliser de pattern",
        html: `
          <p><strong>MVC</strong> découpe une interface graphique en 3 :</p>
          <ul>
            <li><strong>Model</strong> : la logique des données.</li>
            <li><strong>View</strong> : l'affichage.</li>
            <li><strong>Controller</strong> : la gestion des interactions utilisateur.</li>
          </ul>
          <p>La plupart des frameworks web sont basés dessus.</p>
          <p>⚠️ <strong>Important :</strong> un pattern n'est pas un algorithme et <strong>ne s'utilise pas systématiquement</strong>. Il répond à un problème précis ; l'appliquer sans besoin = sur-ingénierie (contre KISS/YAGNI).</p>`,
        cle: "MVC = Model (données) / View (affichage) / Controller (interactions). Un pattern répond à un besoin précis, pas systématique."
      },
    ]
  },

  /* ===================== CLEAN ARCHITECTURE ===================== */
  clean: {
    intro: "Une architecture en couches (R.C. Martin, 2012) centrée sur la logique métier, indépendante des frameworks et de la BD. La règle clé : les dépendances pointent toujours vers l'intérieur.",
    sections: [
      {
        h: "Pourquoi la Clean Architecture",
        html: `
          <p>Le code change pour plein de raisons : nouvelle règle métier, changement de BD, refonte d'UI, passage en micro-services… L'idée : <strong>isoler ce qui change souvent (technique) de ce qui change peu (métier)</strong>.</p>
          <p>Bénéfices :</p>
          <ul>
            <li><strong>Maintenabilité</strong> : modifier avec un risque minimal.</li>
            <li><strong>Indépendance UI / BD</strong> : changer l'un sans toucher au métier.</li>
            <li><strong>Testabilité</strong> : couches isolées = tests simples.</li>
          </ul>`,
        cle: "Clean Architecture = conception centrée métier, indépendante des frameworks/BD, pour maintenir et tester facilement."
      },
      {
        h: "Les 4 couches",
        html: `
          <p>De l'intérieur (stable, métier) vers l'extérieur (volatile, technique) :</p>
          <pre><code>┌─────────────────────────────────────┐
│ External Interfaces (BD, UI, API)   │  ← détails techniques
│  ┌───────────────────────────────┐  │
│  │ Adapters (controllers/present.)│  │  ← conversion de données
│  │  ┌─────────────────────────┐  │  │
│  │  │ Use Cases (logique appli)│  │  │  ← orchestration métier
│  │  │   ┌─────────────────┐   │  │  │
│  │  │   │ Entities/Domain │   │  │  │  ← règles métier de base
│  │  │   └─────────────────┘   │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘</code></pre>
          <ul>
            <li><strong>Entities (Domain)</strong> : structures + règles métier de base.</li>
            <li><strong>Use Cases</strong> : logique applicative (un scénario que l'utilisateur veut réaliser).</li>
            <li><strong>Adapters</strong> : controllers/presenters qui adaptent les données.</li>
            <li><strong>External Interfaces</strong> : BD, UI, framework, API tierces.</li>
          </ul>`,
        cle: "4 couches : Entities (métier) → Use Cases → Adapters → External Interfaces (technique)."
      },
      {
        h: "La règle de dépendance",
        html: `
          <p><strong>Les dépendances pointent UNIQUEMENT vers l'intérieur.</strong> Le cœur métier ne connaît ni l'UI, ni la BD, ni le framework.</p>
          <p>➡️ Une couche externe peut dépendre d'une couche interne, <strong>jamais l'inverse</strong>. Modifier la BD ou l'UI ne doit <strong>pas</strong> impacter les use cases ni les entités.</p>
          <p>💡 C'est exactement le <strong>Dependency Inversion Principle</strong> (le D de SOLID) appliqué à l'échelle de l'architecture.</p>`,
        cle: "Règle de dépendance : tout pointe vers l'intérieur. Le métier ne dépend jamais de la technique."
      },
      {
        h: "Boundary & DTO",
        html: `
          <p>Les données traversent les couches via des <strong>boundary</strong> : des <strong>interfaces</strong> qui définissent ce qui entre et sort. Elles garantissent que les dépendances restent dirigées vers l'intérieur.</p>
          <p>On transporte les données avec des <strong>DTO (Data Transfer Object)</strong> : des objets <strong>simples, sans méthode</strong>, dont le seul rôle est de transporter des données.</p>
          <p>🎯 <em>Pourquoi :</em> éviter de faire « remonter » les entités du domaine dans l'UI (sinon l'UI devient couplée au métier). Le DTO adopte le format le plus pratique pour chaque couche.</p>`,
        cle: "Boundary = interface de passage entre couches ; DTO = objet sans logique qui transporte les données."
      },
      {
        h: "Repository & injection de dépendance",
        html: `
          <p>Un Use Case a souvent besoin de la BD. Mais l'appeler <strong>directement</strong> violerait la règle de dépendance.</p>
          <p><strong>Solution :</strong> le pattern <strong>Repository</strong>. La couche interne définit une <strong>interface</strong> <code>Repository</code> ; la couche externe l'implémente (ex. <code>MySQLRepository</code>). On <strong>injecte</strong> l'implémentation → on inverse la dépendance.</p>
          <pre><code>// Use Case (interne) : dépend de l'interface
interface UserRepository { User findById(id); }
class GetUser { constructor(repo: UserRepository) {} }

// Externe : implémente l'interface
class SqlUserRepository implements UserRepository { ... }</code></pre>
          <p>Grâce au <strong>polymorphisme</strong>, on peut remplacer la vraie BD par un mock en test.</p>`,
        cle: "Repository : la couche interne définit l'interface, l'externe l'implémente, on injecte → dépendance inversée + testable."
      },
      {
        h: "Avantages & inconvénients (à défendre à l'oral)",
        html: `
          <p>✅ <strong>Avantages :</strong> code flexible, facilement testable, indépendant des frameworks/outils, évolutif.</p>
          <p>⚠️ <strong>Inconvénients :</strong> architecture complexe (beaucoup de classes), courbe d'apprentissage.</p>
          <p>💬 En Code Review, savoir présenter <strong>les deux côtés</strong> montre du recul : « j'ai choisi cette archi pour la testabilité et l'évolutivité, en assumant le surcoût en nombre de classes. »</p>`,
        cle: "Clean Archi : + flexible/testable/évolutive, − beaucoup de classes/courbe d'apprentissage. Sache défendre l'arbitrage."
      },
    ]
  },

  /* ===================== BOSS : MÉTHODE CODE REVIEW ===================== */
  boss: {
    intro: "Pas une notion, mais la MÉTHODE pour réussir l'oral déterminant. Comment expliquer ton code, justifier tes choix, débugger en direct et garder la bonne posture.",
    sections: [
      {
        h: "Le format et l'enjeu",
        html: `
          <p>La Code Review est une <strong>épreuve déterminante</strong>, <strong>individuelle</strong>, ~20-30 min, <strong>code sous les yeux</strong>. L'évaluateur navigue dans TON code, pose des questions, peut demander une <strong>modification en direct</strong>.</p>
          <p>Elle valide le Bloc 3 via 3 compétences : <strong>C3.1</strong> (qualité/lisibilité), <strong>C3.2</strong> (maîtrise des outils), <strong>C3.3</strong> (debug/correction).</p>`,
        cle: "Oral individuel, code sous les yeux, déterminant : tu dois prouver que tu maîtrises VRAIMENT ton code."
      },
      {
        h: "Justifier un choix (C3.1)",
        html: `
          <p>Quand on te demande « pourquoi ce pattern / cette archi / cette lib ? », réponds en 3 temps :</p>
          <ol>
            <li>Le <strong>problème</strong> que tu avais.</li>
            <li>Pourquoi cette solution y répond (sa raison d'être).</li>
            <li>L'<strong>alternative écartée</strong> et pourquoi.</li>
          </ol>
          <p>👉 Tu prouves que tu as <strong>choisi</strong>, pas copié. C'est exactement ce que l'épreuve cherche à détecter.</p>`,
        cle: "Justifie un choix en 3 temps : problème → solution → alternative écartée."
      },
      {
        h: "Débugger en direct (C3.3)",
        html: `
          <p>Méthode à dérouler à voix haute :</p>
          <ol>
            <li><strong>Reproduire</strong> le bug (cas minimal).</li>
            <li><strong>Isoler</strong> la cause (logs, debugger, lecture de la stack, bissection).</li>
            <li><strong>Corriger</strong>.</li>
            <li><strong>Valider</strong> : relancer le cas qui échouait + vérifier la non-régression.</li>
          </ol>
          <p>⚠️ Ne jamais corriger « à l'aveugle » : la <strong>validation</strong> fait la différence entre « En cours » et « Validée ».</p>`,
        cle: "Debug : Reproduire → Isoler → Corriger → Valider. La validation est non négociable."
      },
      {
        h: "Vocabulaire & posture",
        html: `
          <p><strong>Vocabulaire précis</strong> : dis « injection de dépendance », « polymorphisme », « use case », « DTO »… jamais « le truc qui… » (piège explicite).</p>
          <p><strong>Posture face à la critique</strong> : accepte la remarque, explique ton contexte, propose une amélioration. Se braquer fait <strong>baisser la note</strong> ; l'ouverture à l'amélioration est notée.</p>
          <p><strong>Connais ton code</strong> : sache où se trouve chaque fonctionnalité et relance ta stratégie de tests.</p>`,
        cle: "Vocabulaire exact + posture ouverte + connaître son code par cœur = la moitié de la note."
      },
      {
        h: "Stratégie de tests (C3.2)",
        html: `
          <p>À l'oral, on te demande souvent <strong>comment tu valides ton code</strong>. Tu dois citer ET <strong>montrer</strong> ta stratégie de tests.</p>
          <ul>
            <li><strong>Tests unitaires</strong> : une fonction/classe isolée (souvent avec un mock).</li>
            <li><strong>Tests d'intégration</strong> : plusieurs modules qui collaborent (ex. controller + repository).</li>
            <li><strong>Tests end-to-end (E2E)</strong> : parcours utilisateur complet (ex. « je me connecte puis j'ajoute au panier »).</li>
            <li><strong>Tests manuels</strong> : utiles en complément, mais ne remplacent pas les tests automatisés.</li>
          </ul>
          <p>⚠️ Piège cité dans la fiche : <strong>citer des tests sans pouvoir en montrer la mise en œuvre</strong>. Prépare la commande pour les relancer (<code>npm test</code>, <code>phpunit</code>, <code>pytest</code>…).</p>
          <p>💡 Relie aux principes vus : grâce au <strong>DIP</strong> et au <strong>Repository</strong>, tu peux injecter un mock en test — c'est la preuve que ton architecture est bonne.</p>`,
        cle: "Cite unitaire / intégration / E2E ET montre comment les relancer devant l'évaluateur."
      },
      {
        h: "Post-mortem & causes racines (C2.2)",
        html: `
          <p>Même si la Code Review est individuelle, la logique du <strong>post-mortem</strong> revient souvent : analyser ce qui s'est passé sans rester sur les symptômes.</p>
          <p>Pour une analyse « Validée » :</p>
          <ol>
            <li>Identifier les <strong>causes racines</strong> (pas seulement « ça bug »).</li>
            <li><strong>Mesurer l'impact</strong> (utilisateurs touchés, données perdues, temps perdu…).</li>
            <li>Montrer les <strong>ajustements</strong> concrets (correctif + test qui le prouve).</li>
            <li>Proposer des <strong>améliorations réalisables</strong> (pas du blabla).</li>
          </ol>
          <p>⚠️ Pièges : rester sur les symptômes, ne pas assumer ses erreurs, laisser un seul membre parler en groupe.</p>`,
        cle: "Post-mortem réussi = causes racines + impact mesuré + correctifs démontrés + améliorations concrètes."
      },
      {
        h: "Simulation : naviguer et modifier ton code",
        html: `
          <p>Format typique : l'évaluateur ouvre <strong>ton dépôt</strong>, te demande d'expliquer un fichier, parfois de <strong>modifier une ligne en direct</strong> (changer un nom, corriger un bug, ajouter un test).</p>
          <p>Entraîne-toi à répondre en 4 points :</p>
          <ol>
            <li><strong>Où</strong> : chemin du fichier + rôle de la couche (Entity, Use Case, Controller…).</li>
            <li><strong>Quoi</strong> : la responsabilité de la classe/fonction (principe S).</li>
            <li><strong>Pourquoi</strong> : le problème résolu + alternative écartée.</li>
            <li><strong>Comment prouver</strong> : quel test relancer pour valider.</li>
          </ol>
          <p>💬 Si on te demande une modif live : annonce ta méthode debug (Reproduire → Isoler → Corriger → <strong>Valider</strong>), fais la modif, puis <strong>relance le test</strong>.</p>
          <p>🔗 Fil rouge à dérouler si on te le demande : couplage faible → interfaces → DIP → Repository → testabilité.</p>`,
        cle: "À l'oral : localiser vite, justifier, modifier proprement, prouver avec un test."
      },
    ]
  },
};

/* ============================================================
   FICHES — référence dense, chaque notion avec définition simple
   + EXEMPLE CONCRET du quotidien (accessible à un non-développeur).
   Structure : FICHES[worldId] = { tables: [{ titre, lignes:[{ t, d, ex }] }] }
     t  = terme (colonne gauche, toujours visible)
     d  = définition simple (masquable en "mode révision")
     ex = exemple concret (masquable aussi)
   ============================================================ */
const FICHES = {
  fond: {
    tables: [
      {
        titre: "Concepts de la programmation orientée objet (POO)",
        lignes: [
          { t: "Encapsulation", d: "Cacher les rouages internes d'un objet et n'exposer que ce qui est utile à l'utilisateur.", ex: "Une voiture : tu utilises le volant et les pédales, sans toucher au moteur." },
          { t: "Héritage", d: "Créer une catégorie à partir d'une autre : elle récupère tout ce que l'autre sait faire (« est un »).", ex: "Un Chien « hérite » d'Animal : il sait déjà manger et dormir, et ajoute aboyer." },
          { t: "Composition", d: "Une chose est construite en assemblant d'autres choses (« a un / utilise »). Plus souple que l'héritage.", ex: "Une voiture « a un » moteur, des roues, un volant qu'elle utilise." },
          { t: "Couplage faible", d: "Deux parties dépendent peu l'une de l'autre : on peut changer l'une sans casser l'autre.", ex: "Une ampoule et une douille : tu changes l'ampoule sans refaire l'électricité." },
          { t: "Abstraction", d: "Ne garder que l'idée générale d'une chose, en oubliant les détails.", ex: "Le mot « véhicule » désigne l'idée commune à une voiture, un vélo, un bus." },
          { t: "Polymorphisme", d: "Traiter des choses différentes de la même manière grâce à un point commun.", ex: "Une télécommande universelle : « ON » allume la TV, la box ou la hi-fi pareil." },
          { t: "Interface", d: "Un contrat : la liste des actions à fournir, sans dire comment les faire.", ex: "Un contrat de livraison impose « livrer » ; Colissimo et Chronopost le font à leur façon." },
        ]
      },
      {
        titre: "Bonnes pratiques & objectifs d'un bon code",
        lignes: [
          { t: "DRY", d: "« Don't Repeat Yourself » : ne pas écrire deux fois la même chose ; la mettre à un seul endroit.", ex: "Une recette de sauce écrite une fois, à laquelle tous les plats renvoient." },
          { t: "YAGNI", d: "« You Aren't Gonna Need It » : ne pas coder ce dont on n'a pas besoin maintenant.", ex: "Ne pas ajouter une piscine « au cas où » quand on construit un garage." },
          { t: "KISS", d: "« Keep It Simple, Stupid » : choisir la solution la plus simple qui marche.", ex: "Pour traverser la rue, on marche — pas besoin de construire un pont." },
          { t: "Les 4 objectifs", d: "Extensibilité · Réutilisabilité · Modularité · Maintenabilité.", ex: "Une maison bien conçue : agrandissable, plans réutilisables, pièces remplaçables, facile à entretenir." },
        ]
      }
    ]
  },
  solid: {
    tables: [
      {
        titre: "Les 5 principes SOLID (Robert C. Martin, ~2000)",
        lignes: [
          { t: "S — Single Responsibility", d: "Une classe ne doit avoir qu'UNE seule raison de changer (une seule responsabilité).", ex: "Un comptable ne fait pas aussi le ménage : sinon on le « modifie » pour 2 raisons différentes." },
          { t: "O — Open/Closed", d: "Ouvert à l'extension, fermé à la modification : ajouter du neuf sans toucher à l'existant.", ex: "Une multiprise : tu branches un appareil de plus, tu ne refais pas l'électricité." },
          { t: "L — Liskov", d: "Un « enfant » doit pouvoir remplacer son « parent » sans créer de surprise.", ex: "Si une recette dit « un oiseau », un manchot ne doit pas tout casser parce qu'il ne vole pas." },
          { t: "I — Interface Segregation", d: "Ne pas forcer une classe à dépendre d'actions qu'elle n'utilise pas : préférer de petits contrats.", ex: "Des menus séparés plutôt qu'un menu géant unique imposé à tous." },
          { t: "D — Dependency Inversion", d: "Dépendre d'un contrat (interface) plutôt que d'un outil précis.", ex: "Une prise standard : ton chargeur marche partout, il ne dépend pas d'une centrale précise." },
        ]
      }
    ]
  },
  patterns: {
    tables: [
      {
        titre: "Les patterns vus en cours",
        lignes: [
          { t: "Strategy", d: "Changer la « façon de faire » d'un programme pendant qu'il tourne, en branchant une autre méthode.", ex: "Un GPS : tu choisis « le plus rapide » ou « sans péage » — même trajet, stratégie différente." },
          { t: "Singleton", d: "Garantir qu'il n'existe qu'un seul exemplaire d'un objet dans tout le programme.", ex: "Le président d'un pays : il n'y en a qu'un, tout le monde s'adresse au même." },
          { t: "Factory", d: "Confier la création des objets à une « usine » dédiée, pour ne pas dépendre des types précis.", ex: "Un distributeur : tu demandes « une boisson », il te la fabrique sans que tu voies l'intérieur." },
          { t: "Decorator", d: "Ajouter des options à un objet en l'emballant, sans le modifier, autant de fois que voulu.", ex: "Un café : + lait, puis + sucre, puis + crème — chaque couche emballe la précédente." },
          { t: "MVC", d: "Séparer une appli en 3 : les données (Model), l'affichage (View), la gestion des actions (Controller).", ex: "Un restaurant : la cuisine (données), la salle (affichage), le serveur (qui fait le lien)." },
        ]
      },
      {
        titre: "Les 3 familles de patterns (Gang of Four)",
        lignes: [
          { t: "Creational", d: "Patterns qui gèrent la création des objets.", ex: "Factory, Singleton, Builder, Prototype." },
          { t: "Structural", d: "Patterns qui organisent l'assemblage des objets entre eux.", ex: "Decorator, Facade, Adapter, Bridge, Composite, Proxy." },
          { t: "Behavioral", d: "Patterns qui gèrent la communication et les rôles entre objets.", ex: "Strategy, Observer, Iterator, Template Method, Command, State, Visitor." },
        ]
      }
    ]
  },
  clean: {
    tables: [
      {
        titre: "Les 4 couches (du cœur vers l'extérieur)",
        lignes: [
          { t: "Entities / Domain", d: "Le cœur métier : les règles vraies quel que soit l'outil utilisé.", ex: "« Un compte bancaire ne peut pas être négatif » reste vrai sur appli comme sur papier." },
          { t: "Use Cases", d: "Les scénarios d'utilisation : ce que l'utilisateur veut accomplir, étape par étape.", ex: "« Virer de l'argent » : vérifier le solde, débiter un compte, créditer l'autre." },
          { t: "Adapters", d: "Les traducteurs entre le cœur métier et le monde extérieur (écran, web).", ex: "Un interprète qui traduit la demande du client en langage compris par la cuisine." },
          { t: "External Interfaces", d: "Les outils concrets : base de données, interface, framework, services externes.", ex: "L'écran tactile, la base MySQL, le bouton du site web." },
        ]
      },
      {
        titre: "Notions clés de la Clean Architecture",
        lignes: [
          { t: "Règle de dépendance", d: "La technique peut connaître le métier, jamais l'inverse : tout « pointe vers le cœur ».", ex: "Le chef décide du plat ; le four obéit. Le four n'impose pas la recette." },
          { t: "DTO", d: "Un objet « boîte de transport » : il contient des données, aucune logique.", ex: "Un colis : il transporte un contenu d'un point A à un point B, sans rien décider." },
          { t: "Boundary", d: "Une porte d'entrée/sortie entre deux couches, définie par un contrat (interface).", ex: "Le guichet d'une banque : un point de passage précis entre toi et le coffre." },
          { t: "Repository", d: "Un intermédiaire qui range et retrouve les données, sans que le métier sache où elles sont.", ex: "Un bibliothécaire : tu demandes un livre, il sait où le trouver ; toi non." },
        ]
      }
    ]
  },
  boss: {
    tables: [
      {
        titre: "Check-list à maîtriser pour l'oral",
        lignes: [
          { t: "Justifier un choix", d: "Pour chaque choix : expliquer le problème, la solution, et l'alternative écartée.", ex: "« J'ai pris Strategy car j'avais 3 modes de calcul ; sinon un gros if/else dur à étendre. »" },
          { t: "Localiser", d: "Savoir retrouver instantanément où est chaque fonctionnalité dans le code.", ex: "« La connexion est dans auth/login.js, ligne 40. »" },
          { t: "Tester", d: "Montrer et relancer ses tests devant l'évaluateur.", ex: "« Je lance les tests : voici les 12 qui passent au vert. »" },
          { t: "Débugger", d: "Méthode en 4 temps : Reproduire → Isoler → Corriger → Valider.", ex: "Bouton qui ne marche pas : je reproduis, je trouve la ligne, je corrige, je relance pour vérifier." },
          { t: "Vocabulaire", d: "Employer les termes exacts, jamais « le truc qui… ».", ex: "Dire « j'injecte une dépendance » plutôt que « je passe le machin dans l'autre machin »." },
        ]
      },
      {
        titre: "Compétences notées (Bloc 3)",
        lignes: [
          { t: "C3.1 — Qualité", d: "Code lisible, structuré, conforme, bien expliqué.", ex: "Des noms clairs : calculerTotal() plutôt que f1()." },
          { t: "C3.2 — Outils", d: "Maîtrise du framework et du langage, utilisés correctement.", ex: "Utiliser les routes du framework comme prévu, pas un bricolage." },
          { t: "C3.3 — Correction", d: "Savoir identifier, corriger et valider un bug.", ex: "Trouver pourquoi le bouton bug, corriger, puis prouver que c'est réglé." },
        ]
      }
    ]
  },
};

/* ============================================================
   GLOSSAIRE — vocabulaire de base de la programmation,
   expliqué pour quelqu'un d'extérieur au domaine.
   Chaque entrée : { t: terme, d: définition simple, ex: exemple }
   ============================================================ */
const GLOSSAIRE = [
  { t: "Programme / Application", d: "Une suite d'instructions que l'ordinateur exécute pour accomplir une tâche.", ex: "Une recette que le cuisinier (l'ordinateur) suit à la lettre." },
  { t: "Code (source)", d: "Le texte écrit par le développeur dans un langage de programmation.", ex: "Les lignes écrites en PHP, JavaScript ou Python." },
  { t: "Langage de programmation", d: "La langue utilisée pour écrire le code (avec sa grammaire).", ex: "PHP, JavaScript, Python — comme le français ou l'anglais pour parler." },
  { t: "Variable", d: "Une étiquette qui retient une valeur réutilisable.", ex: "age = 25 : l'étiquette « age » retient le nombre 25.",
    code: "age = 25        # la variable age retient 25\nnom = \"Sam\"     # la variable nom retient \"Sam\"" },
  { t: "Fonction / Méthode", d: "Un bloc de code réutilisable qui fait une action. Dans un objet, on l'appelle « méthode ».", ex: "calculerTotal() additionne les prix quand on l'appelle.",
    code: "def additionner(a, b):   # une FONCTION\n    return a + b\n\nadditionner(2, 3)   # renvoie 5" },
  { t: "Paramètre / Argument", d: "Une information qu'on donne à une fonction pour qu'elle travaille.", ex: "payer(50) : 50 est le paramètre (le montant à payer).",
    code: "def payer(montant):     # montant = paramètre\n    print(\"Je paie\", montant)\n\npayer(50)   # 50 = argument fourni" },
  { t: "Classe", d: "Un plan/modèle qui décrit un type d'objet : ses données et ses actions.", ex: "Le plan « Chien » décrit qu'un chien a un nom et peut aboyer.",
    code: "# Une CLASSE = un plan/modèle\nclass Chien:\n    def __init__(self, nom):   # constructeur\n        self.nom = nom          # attribut\n    def aboyer(self):           # méthode\n        print(self.nom, \"fait Wouf!\")" },
  { t: "Objet / Instance", d: "Un exemplaire concret fabriqué à partir d'une classe.", ex: "Rex est un objet (une instance) de la classe Chien.",
    code: "# Un OBJET = un exemplaire créé depuis la classe\nrex = Chien(\"Rex\")   # rex est un objet (instance de Chien)\nrex.aboyer()          # affiche : Rex fait Wouf!" },
  { t: "Attribut / Propriété", d: "Une donnée que possède un objet.", ex: "Le nom, la couleur, l'âge d'un chien.",
    code: "rex = Chien(\"Rex\")\nprint(rex.nom)   # \"Rex\"  →  nom est un attribut de rex" },
  { t: "Instancier", d: "Créer un objet à partir d'une classe.", ex: "Fabriquer un chien précis à partir du plan « Chien ».",
    code: "rex = Chien(\"Rex\")   # on INSTANCIE : on crée un objet" },
  { t: "Type", d: "La nature d'une donnée : nombre, texte, objet…", ex: "25 est un nombre ; « Bonjour » est un texte.",
    code: "25         # un entier (int)\n3.14       # un nombre à virgule (float)\n\"Bonjour\"  # du texte (str)\nTrue       # un booléen (vrai/faux)" },
  { t: "Dépendance", d: "Quand un morceau de code a besoin d'un autre pour fonctionner.", ex: "Un service de commande dépend d'une base de données pour enregistrer." },
  { t: "Injection de dépendance", d: "Fournir à un objet ce dont il a besoin depuis l'extérieur, au lieu qu'il le crée lui-même.", ex: "On donne le moteur tout prêt à la voiture, plutôt qu'elle le fabrique seule." },
  { t: "Runtime (exécution)", d: "Le moment où le programme est en train de tourner (≠ moment où on l'écrit).", ex: "Quand l'appli tourne et que l'utilisateur clique sur un bouton." },
  { t: "Framework", d: "Une boîte à outils / structure toute prête pour développer plus vite.", ex: "Symfony, React : ils donnent une ossature au projet." },
  { t: "Base de données (BD)", d: "Un endroit organisé où le programme stocke ses informations durablement.", ex: "La liste des clients, conservée pour la retrouver le lendemain." },
  { t: "API", d: "Un moyen pour deux programmes de se parler et d'échanger des données.", ex: "Une appli météo demande la température à l'API d'un service météo." },
  { t: "Test unitaire", d: "Un petit programme qui vérifie automatiquement qu'un bout de code fonctionne.", ex: "Vérifier que additionner(2, 3) renvoie bien 5." },
  { t: "Mock (objet simulé)", d: "Un faux objet qui imite un vrai, pour tester sans dépendre du vrai.", ex: "Une fausse base de données utilisée seulement pendant un test." },
  { t: "Bug", d: "Une erreur dans le code qui produit un comportement non voulu.", ex: "Un bouton « Envoyer » qui n'envoie rien." },
];

/* ============================================================
   CODE_TERMS — les mots-clés qui apparaissent dans les blocs de
   code, expliqués en français simple. Détectés automatiquement
   sous chaque code pour ne JAMAIS laisser un débutant bloqué.
   { token: à chercher dans le code, label: affichage, def }
   ============================================================ */
const CODE_TERMS = [
  { token: "class", label: "class", def: "mot-clé qui définit une CLASSE = un plan/modèle d'objet (ses données et ses actions)." },
  { token: "interface", label: "interface", def: "un CONTRAT : la liste des actions qu'une classe devra fournir, sans dire comment." },
  { token: "implements", label: "implements", def: "indique qu'une classe APPLIQUE une interface (elle remplit le contrat)." },
  { token: "extends", label: "extends", def: "indique qu'une classe HÉRITE d'une autre (elle récupère ses capacités)." },
  { token: "constructor", label: "constructor", def: "fonction spéciale appelée automatiquement à la création de l'objet (avec new)." },
  { token: "new", label: "new", def: "crée un nouvel OBJET (un exemplaire) à partir d'une classe." },
  { token: "this", label: "this", def: "« cet objet-ci » : fait référence à l'objet courant et à ses données." },
  { token: "private", label: "private", def: "VISIBILITÉ : accessible uniquement à l'intérieur de la classe (caché de l'extérieur)." },
  { token: "public", label: "public", def: "VISIBILITÉ : accessible depuis l'extérieur de la classe." },
  { token: "return", label: "return", def: "renvoie un résultat depuis une fonction/méthode (et arrête son exécution)." },
  { token: "function", label: "function", def: "définit une FONCTION = un bloc d'actions réutilisable." },
  { token: "for", label: "for", def: "une BOUCLE : répète des instructions plusieurs fois." },
  { token: "if", label: "if", def: "exécute du code SEULEMENT si une condition est vraie." },
  { token: "const", label: "const / let", def: "déclarent une VARIABLE : une étiquette qui retient une valeur." },
  { token: "let", label: "let", def: "déclare une variable (valeur modifiable)." },
  { token: "void", label: "void", def: "indique qu'une fonction ne renvoie RIEN." },
  { token: "float", label: "float / int", def: "des TYPES de nombres : float = à virgule, int = entier." },
  { token: "def", label: "def", def: "(Python) définit une FONCTION ou une méthode." },
  { token: "self", label: "self", def: "(Python) « cet objet-ci » : équivaut à this." },
  { token: "__init__", label: "__init__", def: "(Python) le CONSTRUCTEUR : exécuté automatiquement à la création de l'objet." },
  { token: "print", label: "print()", def: "(Python) AFFICHE quelque chose à l'écran." },
  { token: "//", label: "// ou # …", def: "un COMMENTAIRE : ignoré par l'ordinateur, juste là pour expliquer aux humains." },
  { token: ".()", label: "objet.methode()", def: "APPEL DE MÉTHODE : on demande à un objet d'exécuter une de ses actions." },
];

window.LESSONS = LESSONS;
window.FICHES = FICHES;
window.GLOSSAIRE = GLOSSAIRE;
window.CODE_TERMS = CODE_TERMS;

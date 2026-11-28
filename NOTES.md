# Crossing Heroes — notes de passation

Document de reprise du projet pour une nouvelle discussion avec Claude. Il résume l'état de l'app, les règles telles qu'elles sont codées, les choix de design et la marche à suivre pour la mettre à jour.

État au 28 novembre 2026 (fin de la première discussion).

**Pour reprendre dans une nouvelle discussion :** donner à Claude le lien du dépôt `https://github.com/StFrantic82/CrossingHeroes` et lui demander de lire `NOTES.md` en entier avant toute modification. La section 12 résume l'état et ce qui reste ouvert.

---

## 1. Où se trouve l'app

| Version | Adresse | Particularités |
|---|---|---|
| App Claude (artefact) | https://claude.ai/artifact/S7jPgocu7jdVfQB72qtCES (slug `cb650db8-0c1b-4add-afbd-b431b3a0a3af`, titre « Crossing Heroes ») | Publiée à partir de plusieurs fichiers (page, scripts, dossier `a/`). |
| GitHub Pages | https://stfrantic82.github.io/CrossingHeroes/ (dépôt `StFrantic82/CrossingHeroes`, branche `main`, racine) | Lien à partager. L'historique des parties reste dans le navigateur de chaque joueur. |

**Publier une mise à jour, à chaque modification :**
1. Cloner le dépôt et modifier les fichiers de la racine (`index.html`, `app.js`, `engine.js`, `i18n.js`, `sim-worker.js`) ou les images de `a/`.
2. Tester : `node src/sim.js 200 3` (simulation sans navigateur), puis les tests navigateur du dossier `tests/` (section 12).
3. Publier sur l'artefact Claude (`publish_files` avec le slug, la dernière version et les fichiers modifiés, en mode `patch`).
   - Si l'artefact est partagé en public, Claude ne peut pas le modifier : repasser le partage sur « Only you », publier, puis remettre le partage.
   - Avant de publier, augmenter le numéro de version `?v=` des scripts dans `index.html` (et dans `app.js` / `sim-worker.js`), sinon les navigateurs gardent l'ancienne version en cache jusqu'à 10 minutes.
4. Commit et push sur `main`. GitHub Pages se met à jour en environ une minute.
   - Pour pousser, l'application GitHub « Claude » doit être installée sur le compte StFrantic82, avec accès au dépôt.

---

## 2. Préférences de l'auteur (à respecter)

- **Langue :** l'auteur écrit en français. L'app existe en **français, anglais et italien** (sélecteur FR/EN/IT sur l'accueil). Toute nouvelle interface doit être traduite dans les trois langues (`i18n.js`).
- **Noms des cartes :** les noms français viennent des fichiers envoyés par l'auteur, les noms italiens sont ceux imprimés sur les cartes. Les noms anglais viennent du livret quand il les cite, sinon ce sont des traductions de Claude, à vérifier.
- **Icônes plutôt que texte** dans les récapitulatifs, infobulles et la chronique : Compétences, dieux, Gloire, laurier PV, pièces d'or, cartes bonus, Objets.
- **Style graphique :** poterie grecque, comme les cartes. Fond noir de vernis, panneaux en terre cuite, frises à méandres, titres en Cinzel et logo en Bungee.
- **Effets :** reflet doré animé sur les zones dorées des versos d'Épreuves réussies, et créatures de la couverture qui ondulent sur l'accueil.
- **Méthode de travail :** tester (simulation et navigateur) avant de publier, et ne rien changer aux règles sans validation.

---

## 3. Architecture du code

Pas d'étape de construction : les fichiers de la racine sont servis tels quels.

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page et tout le CSS (accueil, statistiques, jeu, modales). |
| `engine.js` | Moteur : données des 48 Épreuves, 25 types de Compétences, 16 Objets, 5 Héros ; actions de jeu ; score ; IA ; simulation et agrégation des statistiques. Fonctionne aussi dans Node (`require('./engine.js')`). |
| `i18n.js` | Textes FR/EN/IT (`I18N`) et noms traduits des cartes (`NAMES`). |
| `app.js` | Interface : accueil, rendu du plateau, clics, tours de l'IA, loupe, modales, historique, onglet Statistiques. |
| `sim-worker.js` | Simulation en arrière-plan pour l'onglet Statistiques. |
| `mp.js` | Partie en ligne : salon, réseau pair-à-pair, diffusion de l'état (voir section 6). |
| `a/` | Images en WebP : `t{n}a`/`t{n}b` (Épreuve recto/verso), `s{n}` (Compétences), `i{n}` (Objets), `h_*` (Héros), `ic_*` (icônes de Compétence), `g_*` (dieux), `m{n}.png` (masques des zones dorées), `cover*`, `aid_*` (aide de jeu), `laurel.png`, `glory.png`. |
| `src/trials.txt` | Relevé des 48 Épreuves : nom, requis, dieu, bonus, score. |
| `src/skills.txt` | Relevé des 70 Compétences (25 modèles). |
| `src/sim.js` | Statistiques en ligne de commande : `node src/sim.js [parties] [joueurs|mix]`. |

**Codes utilisés dans les données :** compétences `S` Force, `C` Ruse, `E` Endurance, `W` Sagesse, `L` Chance ; dieux `POS`, `ATH`, `APO`, `HER`. Score d'une Épreuve : `flat` (PV fixes), `item` (doublé avec l'Objet), `god` (PV × Épreuves de ce dieu), `glory` (PV × Gloire).

**Événements de la chronique :** le moteur émet des objets (`{k:'face', p, t, g}`, etc.) que `app.js` met en forme dans la langue choisie avec les icônes.

---

## 4. Règles telles qu'elles sont codées

- 2 à 5 joueurs, 8 tours chacun. Héros distribués au hasard, premier joueur tiré au sort, 1 or au départ.
- **Marché :** 4 Épreuves, présentoir de 2 × 5 Compétences (chaque Épreuve touche 2 colonnes), 4 Objets.
- **A · Muses :** 1 or pour renouveler une rangée (Épreuves, rangée de Compétences 1 ou 2, Objets), autant de fois que voulu.
- **B · Destin :** l'Épreuve se pose sur une case libre autour du Héros, puis on gagne son bonus. Les Compétences se prennent dans les 2 colonnes sous l'Épreuve et se posent sur n'importe quel bord libre déjà débloqué. S'il manque un bord ou une carte, on en prend moins. Si au moins 2 colonnes sont vides après la prise, le présentoir est entièrement rempli et le joueur gagne 1 or.
- **Réussite :** une Épreuve est réussie si les Compétences de sa ligne et de sa colonne (4 cartes au maximum) couvrent ses symboles requis. Les cartes doubles comptent pour 2 symboles.
- **Zeus :** à chaque série de 4 Épreuves réussies de 4 dieux différents, un Objet gratuit.
- **C · Combat :** achat d'un Objet au maximum. La Torche de Prométhée donne aussitôt 1 Compétence visible, à poser sur un bord libre.
- **Score :** Épreuves réussies ; 2 PV par symbole du Héros ; Gloire 1/3/6/10/15 (5 et plus) ; Objets. Égalité : le plus d'or l'emporte.
- **Choix validés par l'auteur :** « X PV par Épreuve d'un dieu » compte la carte elle-même, réussie ou non ; « X PV par Gloire » n'a pas de plafond.

---

## 5. IA et équilibrage

- L'IA évalue chaque coup par simulation : score actuel, valeur probable des Épreuves inachevées selon les symboles manquants et les bords libres, or restant.
- Elle achète un Objet seulement s'il rapporte assez et n'invoque les Muses que si aucune Épreuve ne lui convient (rare en pratique).
- Repères à 3 joueurs (30 parties) : score moyen 84,5, vainqueur 96,1, écart 11 PV. Points moyens : Épreuves 48, Héros 11, Gloire 5,5, Objets 20.

---

## 6. Partie en ligne (`mp.js`, 21 novembre)

- Sur l'accueil, deux boutons côte à côte : « Partie solo » (joueurs de la liste, humains et IA sur le même écran ; par défaut toi contre 1 IA) et « Partie en ligne ».
- Un joueur crée un salon (code de 4 lettres, lien `#join-CODE`). De 2 à 5 joueurs ; l'hôte peut ajouter ou retirer des IA, puis lance la partie.
- Réseau pair-à-pair avec PeerJS 1.5.4 (unpkg, sinon jsdelivr), identifiant `crossingheroes-mp-CODE`, comme pour Ragnarok. Fonctionne sur GitHub Pages (et localhost) ; l'artefact Claude bloque WebRTC et affiche le lien GitHub Pages.
- L'hôte fait tourner la seule vraie partie `G` et les IA. Les autres envoient leurs actions (`act(fn, ...args)` avec `fn` parmi `muses`, `placeTrial`, `takeSkill`, `zeusPick`, `buy`, `pass`) ; l'hôte vérifie que c'est bien leur tour et diffuse l'état (pioches réduites à leur taille) et la chronique (événements bruts, mis en forme dans la langue de chacun).
- La sélection en cours (carte choisie avant de la poser) reste locale à chaque joueur. Reconnexion avec le même onglet (jeton en sessionStorage).
- Test local sans Internet : ajouter `?mptest=1` à l'URL (BroadcastChannel entre onglets du même navigateur).

---

## 7. Statistiques

- « Δ victoire » (Épreuves et Objets) : taux de victoire des joueurs concernés moins le taux attendu (1 / nombre de joueurs de leur partie), en points. Tri par défaut sur cette colonne.
- Les simulations se cumulent (case « Cumuler », cochée par défaut) et sont gardées dans le navigateur (`localStorage` `ch_agg`) ; bouton « Réinitialiser ». Fusion par `C.mergeAgg` (somme des compteurs).

## 8. Extension Guerre de Troie (21 novembre)

- Option « Extension Guerre de Troie » sur l'accueil (solo, mémorisée), dans le salon en ligne (choix de l'hôte) et dans le simulateur (Non / Oui / Mixte).
- 12 Épreuves de Troie (ids 101 à 112, `TROY_TRIALS`, dieu `TROY`), ajoutées à la pioche. Elles ne comptent ni pour Zeus ni pour les Objets des dieux. Relevé dans `src/troy_trials.txt`.
- Nouveaux scores : `items` (PV × Objets possédés) et `god` avec `TROY` (PV × Épreuves de Troie, réussies ou non).
- Héros : 1 PV par symbole au recto ; après 2 Épreuves de Troie réussies, le Héros se retourne (`flipped`) : 3 PV par symbole et Gloire 1/4/9/16/25 (`GLORY_TROY`).
- Pouvoirs (actifs dès le recto, `power(p, héros)`) :
  - Ulysse (Ruse) : 1 fois par tour, 1 or → joker définitif sur une Épreuve de sa grille (`joker`, bouton en phase A ou C).
  - Ajax (Endurance) : le symbole des Compétences qui portent une Gloire devient un joker, uniquement pour réussir les Épreuves de leur ligne ou colonne (comme toute Compétence) ; les PV du Héros comptent le symbole imprimé.
  - Diomède (Chance) : 1 renouvellement de rangée gratuit par tour (n'est pas compté dans les Muses).
  - Achille (Force) : tous les Objets coûtent 2 or (`itemCost`).
  - Ménélas (Sagesse) : 1 or par Compétence prise hors des 2 colonnes de l'Épreuve, autant de fois que voulu.
- Visuels : les 24 faces des Épreuves de Troie ont été retravaillées (palette réduite en aplats, crème/or du jeu, grain) par `src/troy_style.py` ; images `a/t101a…t112b`, masques dorés `a/m101…m112`, Héros `a/ht_<héros>_1|2`.
- IA de l'extension (réglages demandés par l'auteur) :
  - Ajax : bonus par Compétence avec Gloire posée (≈ 3,8 par partie contre 2 pour les autres Héros).
  - Diomède : simule chaque renouvellement gratuit (2 tirages), préfère les rangées de Compétences (≈ 6,5 par partie) pour trouver la bonne carte ou priver un adversaire (`denyValue`, Ajax visé par les cartes Gloire) ; les Épreuves plus rarement (≈ 1,3) ; les Objets s'il a au moins 2 or et qu'un meilleur Objet est probable. Le renouvellement gratuit (1 par tour, n'importe quelle rangée : Épreuves, Compétences ou Objets) s'ajoute aux Muses normales à 1 or.
  - Ménélas : paie 1 or seulement si la carte lui rapporte nettement plus (marge 1,2 PV), avec un bonus de contre-draft et le calcul de l'or du remplissage du présentoir (≈ 2,8 achats par partie).
  - Achille : achète un Objet plus facilement (seuil abaissé), ≈ 3,7 Objets par partie.
  - Ulysse : préfère les Épreuves à 4-5 symboles et compte sur un joker par tour restant pour les Épreuves auxquelles il ne manque qu'un symbole (≈ 3,4 jokers par partie). Joker aussi utilisé par l'IA dans l'app.
  - Toutes les IA comptent désormais l'or gagné quand leur prise vide une 2e colonne du présentoir.
- Équilibrage après ces réglages (400 parties à 3) : Ajax 63 %, Achille 36 %, Diomède 32 %, Ménélas 17 %, Ulysse 16 %.
- Équilibrage initial (600 parties IA à 3 joueurs, extension) : Ajax 54 % de victoires (96 PV), Achille 39 % (92), Diomède 29 % (85), Ulysse 23 % (82), Ménélas 23 % (80) ; attendu 33 %. Ajax paraît trop fort, Ulysse et Ménélas un peu faibles (l'IA les joue peut-être moins bien qu'un humain).

## 9. IA : contre des Épreuves fortes chez l'adversaire (23 novembre)

- Constat : les Épreuves « × Gloire » sont les plus liées à la victoire (+24 pt de Δ victoire), car elles s'ajoutent à la Gloire déjà accumulée (Gloire ≥ 5 + Épreuve × Gloire réussie : +32 pt ; Gloire ≥ 5 sans : +7 pt).
- `trialThreat(G, pi, tid)` estime la valeur d'une Épreuve pour les adversaires (Gloire actuelle et à venir pour les « × Gloire », facilité selon le nombre de symboles ; adversaire suivant pondéré 1, les autres 0,6).
- Contre-draft : en choisissant son Épreuve, l'IA ajoute 0,4 × la menace qu'elle retire de la rangée (`DENY_W`).
- Muses : si une Épreuve de la rangée vaut ≥ 6 pour un adversaire et que l'IA a ≥ 2 or, elle renouvelle la rangée d'Épreuves (1 fois par tour) ; Diomède en tient compte dans son renouvellement gratuit.
- Effet (600 parties, jeu de base) : Δ victoire des Épreuves × Gloire 23,7 → 18,8 pt ; Muses ≈ 0,5 par joueur et par partie (0 avant) ; score moyen inchangé (≈ 85).

## 10. Tutoriel (25 novembre)

- Bouton « 🎓 Tutoriel » sur l'accueil (`tutorial.js`, textes FR/EN/IT dans `TUT_TXT`). Lance une partie du jeu de base contre 1 IA (Ariane), le joueur commence toujours.
- 14 étapes affichées en bulle, placée automatiquement dans le coin qui ne recouvre pas les zones expliquées (sinon à la meilleure hauteur libre, recalculée au défilement et au redimensionnement ; la loupe passe alors à gauche) ; la page défile vers la zone expliquée si elle est hors de l'écran selon la situation : intro, Héros, phase A/B (choisir puis placer une Épreuve), prise et pose des Compétences, première Épreuve réussie, phase C, tour de l'IA, Gloire, remplissage du présentoir (+1 or), Zeus, conseils, fin. Les éléments concernés sont mis en surbrillance.
- Les étapes d'action se valident en faisant l'action ; les étapes d'explication avec « Compris ». « Quitter le tutoriel » laisse la partie continuer normalement.

## 11. Pistes

- Agrandissement des cartes au toucher sur mobile (la loupe ne marche qu'au survol).
- Étapes du tutoriel pour l'extension Guerre de Troie (retournement, pouvoirs).
- Image d'aperçu (vignette) de l'artefact Claude : à choisir depuis le menu Partager, ou à fabriquer (`<link rel="artifact-thumbnail">`).

## 12. État à la fin de la première discussion (28 novembre) et décisions en attente

**Fait et en ligne (GitHub Pages et artefact Claude, version des scripts `?v=12`, tutoriel `?v=13`) :**
jeu de base complet (2–5 joueurs, solo sur un écran avec IA, 1 adversaire par défaut), partie en ligne pair-à-pair, FR/EN/IT, style poterie grecque, couverture animée, reflet doré, onglet Statistiques (simulations cumulables, Δ victoire, surbrillance et loupe à gauche), historique des parties, extension Guerre de Troie (Épreuves retravaillées, Héros recto verso, pouvoirs, IA spécifique), IA de contre-draft, tutoriel en 14 étapes avec bulle auto-placée.

**Questions ouvertes (aucune règle changée sans l'accord de l'auteur) :**
- Équilibrage de l'extension (IA, 3 joueurs) : Ajax ≈ 55–60 % de victoires, Ulysse et Ménélas ≈ 16–22 %. L'auteur ne veut pas affaiblir Ajax ; il a seulement fait régler l'IA. Simulation « pouvoirs d'Ulysse et Ménélas gratuits » (800 parties, copie à part, non appliquée) : Ajax 38 %, Ménélas 46 %, Ulysse 37 %, Achille 24 %, Diomède 22 %. Piste proposée, non testée : Ménélas avec 1 choix gratuit par tour puis 1 or.
- Les Épreuves « × Gloire » restent les plus liées à la victoire (≈ +19 pt) malgré le contre-draft de l'IA ; c'est une force réelle de ces cartes, pas un défaut de l'IA.
- Visuels Troie retravaillés automatiquement (`src/troy_style.py`) : l'auteur n'a pas encore donné son avis sur le résultat.

**Tests (dossier `tests/`)** — lancer un serveur local dans le dossier du dépôt : `python3 -m http.server 8766`, puis :
- `python3 tests/solo_ui.py` : partie solo complète + simulation dans l'onglet Statistiques (Playwright).
- `python3 tests/online_ui.py` et `tests/online_troy_ui.py` : partie en ligne hôte + invité + IA dans deux onglets (mode `?mptest=1`), avec ou sans l'extension.
- `python3 tests/troy_ui.py` : une partie avec chacun des 5 Héros de Troie.
- `python3 tests/tutorial_ui.py` : tutoriel complet sur 4 tailles d'écran, vérifie que la bulle ne recouvre aucune zone expliquée.
- `python3 tests/stats_cumul.py` : cumul et réinitialisation des simulations.
- `node tests/troy_heroes.js` : comportement et taux de victoire des Héros de Troie (400 parties).
- `node tests/glory_trials.js [engine.js] [parties] [0|1]` : Δ victoire par type de score d'Épreuve.
- Les scripts Python enregistrent leurs captures dans `/home/claude/` : adapter le chemin si besoin.

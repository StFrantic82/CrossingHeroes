# Crossing Heroes — notes de passation

Document de reprise du projet pour une nouvelle discussion avec Claude. Il résume l'état de l'app, les règles telles qu'elles sont codées, les choix de design et la marche à suivre pour la mettre à jour.

État au 21 novembre 2026.

---

## 1. Où se trouve l'app

| Version | Adresse | Particularités |
|---|---|---|
| App Claude (artefact) | https://claude.ai/artifact/S7jPgocu7jdVfQB72qtCES (slug `cb650db8-0c1b-4add-afbd-b431b3a0a3af`, titre « Crossing Heroes ») | Publiée à partir de plusieurs fichiers (page, scripts, dossier `a/`). |
| GitHub Pages | https://stfrantic82.github.io/CrossingHeroes/ (dépôt `StFrantic82/CrossingHeroes`, branche `main`, racine) | Lien à partager. L'historique des parties reste dans le navigateur de chaque joueur. |

**Publier une mise à jour, à chaque modification :**
1. Cloner le dépôt et modifier les fichiers de la racine (`index.html`, `app.js`, `engine.js`, `i18n.js`, `sim-worker.js`) ou les images de `a/`.
2. Tester : `node src/sim.js 200 3` (simulation sans navigateur), puis une partie dans le navigateur.
3. Publier sur l'artefact Claude (`publish_files` avec le slug, la dernière version et les fichiers modifiés, en mode `patch`).
   - Si l'artefact est partagé en public, Claude ne peut pas le modifier : repasser le partage sur « Only you », publier, puis remettre le partage.
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

## 6. Pistes

- Multijoueur en ligne, chaque joueur sur son appareil.
- IA qui utilise mieux les Muses.
- Agrandissement des cartes au toucher sur mobile.

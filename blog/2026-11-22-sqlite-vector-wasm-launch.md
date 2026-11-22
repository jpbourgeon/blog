---
title: "SQLite et recherche vectorielle dans le navigateur, sans changer d'API"
description: "Une distribution ciblée de SQLite et SQLite-Vector pour le navigateur : usage, intégration, garanties et empreinte mesurée."
slug: sqlite-vector-wasm-launch
date: 2026-11-22
unlisted: true
tags: [sqlite, wasm, local-first, vector-search]
rationale: .42p/design/article_sqlite-vector-wasm-launch/rationale.md
---

Une application peut conserver des données dans le navigateur et néanmoins perdre une part de son utilité dès que le serveur devient inaccessible. Stocker localement ne suffit pas : il faut encore pouvoir interroger ces données, filtrer des enregistrements, rechercher du texte ou retrouver des éléments proches.

[sqlite-vector-wasm](https://github.com/at-rama/sqlite-vector-wasm) réunit SQLite, FTS5 et [SQLite-Vector](https://github.com/sqliteai/sqlite-vector) dans une distribution WebAssembly destinée au navigateur. Le parti pris est simple : **ajouter la recherche vectorielle à SQLite sans remplacer ses API**, tout en livrant une intégration que chaque application n'a pas à reconstruire.

## 1. Chercher les voisins d'une couleur

Imaginons la palette locale d'une application de dessin. Chaque couleur est un triplet RGB ; nous cherchons celles qui sont numériquement les plus proches de `[220, 50, 60]`.

Après avoir installé `@at-rama/sqlite-vector-wasm` et servi les fichiers du runtime sous `/sqlite/`, on peut utiliser directement l'API OO1 de SQLite :

```js
import sqlite3InitModule from '/sqlite/sqlite3.mjs';

const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.DB(':memory:');

try {
  db.exec('CREATE TABLE palette(name TEXT, rgb BLOB)');
  db.exec(`
    INSERT INTO palette(name, rgb) VALUES
      ('Corail', vector_as_f32('[230,57,70]')),
      ('Rouge profond', vector_as_f32('[214,40,40]')),
      ('Bleu acier', vector_as_f32('[69,123,157]'))
  `);

  // Associe la colonne existante à des vecteurs Float32 de dimension 3.
  db.exec("SELECT vector_init('palette', 'rgb', 'type=FLOAT32,dimension=3,distance=L2')");

  const neighbors = db.selectObjects(`
    SELECT p.name, n.distance
    FROM vector_full_scan('palette', 'rgb', '[220,50,60]', 3) AS n
    JOIN palette AS p ON p.rowid = n.rowid
    ORDER BY n.distance
  `);
  console.log(neighbors);
} finally {
  db.close();
}
```

| Rang | Couleur | RGB | Distance L2 approximative |
| ---: | --- | --- | ---: |
| 1 | Corail | `[230,57,70]` | 15,78 |
| 2 | Rouge profond | `[214,40,40]` | 23,15 |
| 3 | Bleu acier | `[69,123,157]` | 193,75 |

Trois opérations constituent l'essentiel : `vector_as_f32()` encode les valeurs, `vector_init()` décrit la colonne vectorielle pour la connexion en cours, et `vector_full_scan()` calcule les voisins. Il n'y a ni nouveau langage de requête ni abstraction JavaScript propriétaire à apprendre.

## 2. Une seule base, plusieurs façons d'interroger

SQLite répond déjà aux questions structurées avec SQL et aux recherches textuelles avec FTS5. La recherche vectorielle ajoute une autre primitive : classer des valeurs numériques par proximité. Pour une recherche sémantique, ces valeurs peuvent être des embeddings calculés par l'application.

La combinaison ouvre des usages embarqués concrets : consulter des fiches d'intervention sans réseau, retrouver un passage dans une documentation téléchargée, ou explorer un catalogue local. Chaque cas peut combiner des filtres SQL, du plein texte et des voisins vectoriels, dans une base familière aux développeurs.

## 3. Pourquoi cette distribution ?

SQLite dispose de plusieurs voies pour la recherche vectorielle : [sqlite-vec](https://github.com/asg017/sqlite-vec) propose une extension dédiée, tandis que [SQLite.ai](https://github.com/sqliteai/sqlite-wasm) distribue un WASM enrichi de plusieurs composants.

Le choix de cette distribution est [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), qui prend en charge notamment les vecteurs Float32 et les vecteurs binaires natifs avec distance de Hamming. Ce sont des capacités utiles pour manipuler aussi bien des représentations numériques continues que des signatures binaires.

**La valeur de sqlite-vector-wasm est dans la composition** : SQLite, SQLite-Vector et les composants WASM du navigateur, préintégrés et qualifiés. Cette sélection écarte SQLite-Sync et SQLite-Memory pour concentrer la maintenance sur les fonctions utiles à ce runtime.

## 4. Rester au plus près de SQLite

Le contrat d'usage demeure celui de SQLite WASM : son API C accessible depuis JavaScript et son interface OO1. Aucun ORM, nouvelle façade de requête ou dialecte SQL n'est ajouté. Le code d'ouverture utilise ainsi `sqlite3.oo1.DB`, `db.exec` et `db.selectObjects`, exactement dans l'esprit de l'interface existante.

À la construction, SQLite-Vector est lié statiquement au runtime et ses fonctions sont enregistrées automatiquement sur chaque connexion. Le développeur n'a pas à charger manuellement une extension dans le navigateur. Il doit en revanche déclarer avec `vector_init()` les colonnes vectorielles utilisées par **chaque connexion** ; lors de la réouverture d'une base persistante, cette déclaration est à renouveler, sans recréer les données.

Cette proximité avec les API natives limite la surface d'intégration spécifique au projet. Le paquet fournit les chargeurs, le WASM et les fichiers compagnons des Workers et du stockage. Pour une nouvelle application, un **Worker dédié** évite d'exécuter les requêtes synchrones sur le thread principal.

Pour les projets Vite, une [recette de production documentée](https://at-rama.github.io/sqlite-vector-wasm/usage/#vite-production-build) montre comment intégrer le chargeur et faire émettre les fichiers compagnons. Le stockage persistant s'appuie sur les VFS OPFS de SQLite.

## 5. Construire, qualifier, puis maintenir

Livrer un WASM qui démarre ne suffit pas à qualifier une distribution. Il faut savoir **ce qui a été construit**, **ce qui a été empaqueté** et **ce qui fonctionne dans l'archive effectivement livrée**.

Le processus de publication de sqlite-vector-wasm part de versions amont et d'empreintes enregistrées. La compilation conserve les interfaces SQLite retenues et intègre SQLite-Vector sans patcher ses sources pour les besoins du paquet. L'assemblage vérifie l'inventaire des fichiers et leurs empreintes, puis produit une archive avec son manifeste de runtime et les textes de licence. Le code et la documentation propres au projet sont sous **Apache-2.0** ; SQLite est dans le **domaine public**, SQLite-Vector est sous **Apache-2.0**, les en-têtes FP16 sous **MIT**. Le runtime Emscripten et ses bibliothèques incorporées conservent leurs licences et notices respectives, notamment MIT, Illinois/NCSA et les conditions applicables aux composants LLVM et musl. Ces textes sont livrés dans `licenses/` avec les origines enregistrées ; la licence du projet ne remplace pas celles des composants. Ces enregistrements permettent de retracer la composition et de reconstruire une distribution fonctionnellement vérifiable.

La qualification porte sur **l'archive finale**, extraite et exécutée dans un vrai navigateur. Elle contrôle les interfaces C/OO1, les surfaces de chargement, FTS5, la recherche Float32/L2 et les vecteurs binaires/Hamming. Pour les distances, les résultats attendus proviennent d'un calcul indépendant de l'extension, et non d'une seconde requête qui pourrait reproduire la même erreur.

La persistance fait l'objet d'un scénario plus exigeant qu'un simple `COMMIT` réussi : écrire des données ordinaires et vectorielles, fermer proprement la connexion, terminer le Worker, démarrer un nouveau Worker à la même origine et rouvrir les données. Les VFS OPFS retenus sont exercés avec leurs prérequis observés. Le test vérifie ainsi la **reprise après arrêt ordonné du runtime**, jusque dans les données vectorielles.

Le suivi des projets amont identifie des compositions candidates. **Le choix de la composition et sa fusion dans `main` sont humains** : cette fusion déclenche la construction et la qualification de l'archive définitive, puis, si tous les contrôles passent, sa publication automatique sur npm et GitHub. Une qualification préalable sur la PR ne remplace pas celle de l'archive issue de la fusion.

La **release 0.4.0** fournit un exemple concret des preuves conservées : l'archive distribuée, `publication.json` (manifeste de publication et provenance), `attestation.json` (attestation GitHub portant sur l'archive et la révision source) et `delivery.json` (reçu des opérations de livraison). La concordance du **SHA-256 de l'archive npm** avec le manifeste et les métadonnées GitHub a été vérifiée lors de la relecture. Ce reçu trace une livraison réussie ; ce n'est ni une attestation indépendante ni une approbation humaine. Le [contrat de publication](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/publication.md) précise la portée de ces pièces.

## 6. Quel coût pour cette composition ?

Une distribution intégrée a un coût en octets. Pour l'apprécier sans confondre des méthodes de compression différentes, un [relevé reproductible](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/runtime-footprint.md) a été effectué le **2 novembre 2026** sur trois paires « chargeur ESM + WASM ».

Le chargeur JavaScript est compacté selon le même protocole sans optimisation sémantique ni renommage ; le WASM reste inchangé. Chaque fichier est ensuite compressé séparément en gzip, puis les deux tailles sont additionnées.

| Distribution mesurée | Version npm | Chargeur + WASM, gzip normalisé |
| --- | --- | ---: |
| SQLite WASM officiel | `3.54.1-build1` | **483 824 octets** |
| sqlite-vector-wasm | `0.3.2` | **517 404 octets** |
| SQLite.ai WASM | `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` | **583 616 octets** |

Dans ce relevé, la paire ciblée est **6,9 % plus volumineuse** que celle de SQLite officiel et **11,3 % moins volumineuse** que celle de SQLite.ai. Les versions et fonctions embarquées diffèrent entre ces trois compositions. L'intérêt du choix ciblé apparaît dans cet équilibre : des capacités intégrées, une empreinte contenue et un ensemble maîtrisable à maintenir.

## 7. Essayer

Le paquet est disponible sur [npm](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm), avec son [code source](https://github.com/at-rama/sqlite-vector-wasm), un [guide d'utilisation](https://at-rama.github.io/sqlite-vector-wasm/usage/) et une [démonstration navigateur](https://at-rama.github.io/sqlite-vector-wasm/demo/).

Pour commencer, une table en mémoire et quelques vecteurs suffisent. Le guide accompagne ensuite l'intégration dans un Worker, le stockage persistant et les builds Vite.

**Périmètre et limites.** L'exemple RGB/L2 illustre une distance numérique, pas la perception humaine des couleurs ; sa base en mémoire ne démontre pas la persistance. La distribution cible le navigateur et fournit des primitives de requête : embeddings, synchronisation, résolution des conflits et recherche hybride relèvent de l'application. OPFS dépend des prérequis du VFS et de l'hébergement (contexte sécurisé, Worker et, selon le mode, isolation ou initialisation spécifique). Les tests de reprise concernent un arrêt ordonné, pas un crash. Enfin, les mesures du §6 comparent des paires chargeur/WASM de versions et périmètres différents : elles n'isolent pas le coût des extensions, les transferts HTTP ni les performances.

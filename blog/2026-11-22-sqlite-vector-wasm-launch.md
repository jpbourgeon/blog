---
title: "SQLite et recherche vectorielle dans le navigateur, sans changer d'API"
description: "Une distribution ciblée de SQLite et SQLite-Vector pour le navigateur : usage, intégration, garanties et empreinte mesurée."
slug: sqlite-vector-wasm-launch
date: 2026-11-22
draft: true
tags: [sqlite, wasm, local-first, vector-search]
rationale: article_sqlite-vector-wasm-launch
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

Cet exemple est volontairement pédagogique. La distance euclidienne en RGB ne reproduit pas fidèlement la perception des couleurs. La base est en mémoire : l'exemple démontre la recherche de proximité, **pas** la persistance, la synchronisation ou une application local-first complète.

## 2. Une seule base, plusieurs façons d'interroger

SQLite répond déjà aux questions structurées avec SQL et aux recherches textuelles avec FTS5. La recherche vectorielle ajoute une autre primitive : classer des valeurs numériques par proximité. Pour une recherche sémantique, ces valeurs peuvent représenter des embeddings fournis par l'application ; le runtime ne produit pas ces embeddings à sa place.

La combinaison ouvre des usages embarqués concrets : consulter des fiches d'intervention sans réseau, retrouver un passage dans une documentation téléchargée, ou explorer un catalogue dont la synchronisation est assurée ailleurs. Chaque cas peut combiner des filtres SQL, du plein texte et des voisins vectoriels. La réplication, la résolution des conflits et le classement hybride restent des responsabilités distinctes.

Le bénéfice ne tient donc pas à une promesse de « base intelligente ». Il tient à la disponibilité de primitives complémentaires, utilisables sur les données locales avec l'outillage habituel de SQLite.

## 3. Pourquoi cette distribution ?

La recherche vectorielle autour de SQLite n'est pas nouvelle. [sqlite-vec](https://github.com/asg017/sqlite-vec) est une autre approche de cet espace ; [SQLite.ai](https://github.com/sqliteai/sqlite-wasm) propose déjà un WASM plus largement enrichi.

Le choix de cette distribution est [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), qui prend en charge notamment les vecteurs Float32 et les vecteurs binaires natifs avec distance de Hamming. Ce sont des capacités utiles pour manipuler aussi bien des représentations numériques continues que des signatures binaires.

La différence recherchée n'est ni l'exclusivité de ces fonctions ni une meilleure performance supposée. C'est **la disponibilité d'une composition ciblée, préintégrée et qualifiée** : SQLite, SQLite-Vector et les composants WASM nécessaires au navigateur, sans devoir assembler et entretenir cette combinaison dans chaque projet. Les fonctions SQLite-Sync et SQLite-Memory ne sont pas incluses ; ce périmètre réduit aussi ce que la distribution doit suivre et vérifier.

## 4. Rester au plus près de SQLite

Le contrat d'usage demeure celui de SQLite WASM : son API C accessible depuis JavaScript et son interface OO1. Aucun ORM, nouvelle façade de requête ou dialecte SQL n'est ajouté. Le code d'ouverture utilise ainsi `sqlite3.oo1.DB`, `db.exec` et `db.selectObjects`, exactement dans l'esprit de l'interface existante.

À la construction, SQLite-Vector est lié statiquement au runtime et ses fonctions sont enregistrées automatiquement sur chaque connexion. Le développeur n'a pas à charger manuellement une extension dans le navigateur. Il doit en revanche déclarer avec `vector_init()` les colonnes vectorielles utilisées par **chaque connexion** ; lors de la réouverture d'une base persistante, cette déclaration est à renouveler, sans recréer les données.

Cette proximité avec les API natives limite la surface d'intégration spécifique au projet. Elle n'efface pas les contraintes du navigateur. Le paquet fournit notamment les chargeurs, le WASM et les fichiers compagnons des Workers et du stockage. Pour une nouvelle application, un **Worker dédié** évite d'exécuter les requêtes synchrones sur le fil d'interface.

La persistance OPFS repose sur les VFS de SQLite et sur leurs prérequis : contexte sécurisé, exécution en Worker, parfois isolation cross-origin, Web Locks ou initialisation explicite selon le VFS. Le bundler doit également produire les fichiers compagnons et conserver leurs URL cohérentes. La [recette Vite documentée](https://at-rama.github.io/sqlite-vector-wasm/usage/#vite-production-build) correspond à une combinaison testée, non à une compatibilité universelle. Cette distribution cible le **navigateur**, pas Node.js, WASI ou un exécutable natif.

## 5. Construire, qualifier, puis maintenir

Livrer un WASM qui démarre ne suffit pas à qualifier une distribution. Il faut savoir **ce qui a été construit**, **ce qui a été empaqueté** et **ce qui fonctionne dans l'archive effectivement livrée**.

Le processus part de versions amont et d'empreintes enregistrées. La compilation conserve les interfaces SQLite retenues et intègre SQLite-Vector sans patcher ses sources pour les besoins du paquet. L'assemblage vérifie l'inventaire des fichiers et leurs empreintes, puis produit une archive avec son manifeste de runtime et les notices de licence. Ces enregistrements permettent de retracer la composition et de reconstruire une distribution fonctionnellement vérifiable ; ils ne prétendent pas garantir des octets identiques à chaque reconstruction.

La qualification porte sur **l'archive finale**, extraite et exécutée dans un vrai navigateur. Elle contrôle les interfaces C/OO1, les surfaces de chargement, FTS5, la recherche Float32/L2 et les vecteurs binaires/Hamming. Pour les distances, les résultats attendus proviennent d'un calcul indépendant de l'extension, et non d'une seconde requête qui pourrait reproduire la même erreur.

La persistance fait l'objet d'un scénario plus exigeant qu'un simple `COMMIT` réussi : écrire des données ordinaires et vectorielles, fermer proprement la connexion, terminer le Worker, démarrer un nouveau Worker à la même origine et rouvrir les données. Les VFS OPFS retenus sont exercés avec leurs prérequis observés. Ce test établit une reprise **après arrêt ordonné du runtime**, pas une garantie générale contre les crashs ou pour tous les navigateurs.

Enfin, les évolutions amont sont suivies pour identifier des compositions candidates. Leur sélection et la décision de publier restent humaines, après qualification. **C'est une discipline de maintenance, pas une promesse de support illimité ni de mise à jour autonome.** Le [contrat de publication](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/publication.md) relie la révision intégrée, l'archive acceptée et ses éléments de provenance.

## 6. Quel coût pour cette composition ?

Une distribution intégrée a un coût en octets. Pour l'apprécier sans confondre des méthodes de compression différentes, un [relevé reproductible](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/runtime-footprint.md) a été effectué le **2 novembre 2026** sur trois paires « chargeur ESM + WASM ».

Le chargeur JavaScript est compacté selon le même protocole sans optimisation sémantique ni renommage ; le WASM reste inchangé. Chaque fichier est ensuite compressé séparément en gzip, puis les deux tailles sont additionnées.

| Distribution mesurée | Version npm | Chargeur + WASM, gzip normalisé |
| --- | --- | ---: |
| SQLite WASM officiel | `3.54.1-build1` | **483 824 octets** |
| sqlite-vector-wasm | `0.3.2` | **517 404 octets** |
| SQLite.ai WASM | `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` | **583 616 octets** |

Dans ce relevé, la paire ciblée est **6,9 % plus volumineuse** que celle de SQLite officiel et **11,3 % moins volumineuse** que celle de SQLite.ai. Mais les versions de SQLite, les fonctions embarquées, les chargeurs et les frontières d'empaquetage ne sont pas identiques. Il serait incorrect d'en déduire le coût marginal de SQLite-Vector, de SQLite-Sync ou de SQLite-Memory — ou d'attribuer à leur seule présence les écarts observés.

Ces tailles ne représentent ni un téléchargement HTTP mesuré, ni la mémoire utilisée, ni la performance des requêtes, ni le poids complet d'une application. Elles caractérisent trois **distributions effectivement observées à une date donnée**. Le compromis est ailleurs : disposer des capacités nécessaires dans une composition suivie et qualifiée, sans embarquer par principe toutes les extensions possibles.

## 7. Essayer

Le paquet est disponible sur [npm](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm), avec son [code source](https://github.com/at-rama/sqlite-vector-wasm), un [guide d'utilisation](https://at-rama.github.io/sqlite-vector-wasm/usage/) et une [démonstration navigateur](https://at-rama.github.io/sqlite-vector-wasm/demo/).

Pour commencer, une table en mémoire et quelques vecteurs suffisent. Si l'application demande ensuite un stockage persistant, des Workers ou un bundler, les conditions et exemples correspondants sont documentés séparément : ce sont des choix d'intégration à vérifier dans son environnement, non des capacités à présumer.

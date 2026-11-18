# Figures dans les articles MDX

## Schémas Mermaid

Dans un article Markdown ou MDX :

````mermaid
flowchart LR
    A[Source] --> B[Validation] --> C[Publication]
````

## Graphiques Recharts

Dans un fichier `.mdx`, importer les composants réutilisables :

```mdx
import {BarChart, LineChart, PieChart} from '@site/src/components/charts';

const data = [
  {name: 'A', value: 180},
  {name: 'B', value: 310},
  {name: 'C', value: 490},
];

<BarChart data={data} unit="Ko" />
<LineChart data={data} />
<PieChart data={data} />
```

Les données sont des couples `{name, value}`, avec `value` numérique.
`height` peut ajuster la hauteur en pixels (défaut : 300).
Le tableau de données reste disponible dans le HTML statique lorsque le graphique interactif n'est pas rendu.
Les graphiques sont des illustrations : commenter la provenance des mesures et leurs conditions dans l'article.

# KnowledgeHub

Plateforme modulaire de construction de connaissances personnelles, permettant à Anthony et à d'autres utilisateurs de créer et de partager leurs propres bases de connaissances, intégrant des fonctionnalités d'IA pour améliorer la recherche et l'apprentissage.

## Fonctionnalités

- **Gestion de connaissances** : Créez, modifiez et organisez vos hubs de connaissances.
- **GraphQL API** : Interface moderne et flexible pour interagir avec vos données.
- **Support Multi-utilisateurs** : Collaborez ou gérez vos connaissances personnelles en toute sécurité.
- **Intégration MongoDB** : Stockage robuste et scalable.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
MONGODB_URI=mongodb://localhost:27017/knowledgehub
PORT=4000
SECRET_KEY=votre_cle_secrete
```

## Lancement

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## API GraphQL

L'endpoint GraphQL est disponible par défaut sur `/graphql`.

## Tests

```bash
npm test
```

## Contributing

Merci de contribuer au projet ! Veuillez lire le fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations.
# Test

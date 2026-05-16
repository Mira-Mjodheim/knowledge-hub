```javascript
const { MongoClient } = require('mongodb');
const KnowledgeResolver = require('../../src/resolvers/KnowledgeResolver');
const KnowledgeService = require('../../src/services/KnowledgeService');
const { connectDB } = require('../../src/db/mongo');
const Knowledge = require('../../src/models/Knowledge');

describe('KnowledgeResolver', () => {
  let db;
  let knowledgeResolver;
  let knowledgeService;

  beforeAll(async () => {
    db = await connectDB();
    knowledgeService = new KnowledgeService(db);
    knowledgeResolver = new KnowledgeResolver(knowledgeService);
  });

  afterAll(async () => {
    await db.close();
  });

  describe('Query', () => {
    describe('knowledge', () => {
      it('devrait retourner un knowledge', async () => {
        const knowledge = await knowledgeService.createKnowledge({
          title: 'Test Knowledge',
          content: 'This is a test knowledge',
        });

        const result = await knowledgeResolver.Knowledge(null, { id: knowledge._id });
        expect(result).toEqual(knowledge);
      });

      it('devrait retourner null si le knowledge n existe pas', async () => {
        const result = await knowledgeResolver.Knowledge(null, { id: 'non-existent-id' });
        expect(result).toBeNull();
      });
    });

    describe('knowledges', () => {
      it('devrait retourner une liste de knowledges', async () => {
        await knowledgeService.createKnowledge({
          title: 'Test Knowledge 1',
          content: 'This is a test knowledge 1',
        });

        await knowledgeService.createKnowledge({
          title: 'Test Knowledge 2',
          content: 'This is a test knowledge 2',
        });

        const result = await knowledgeResolver.Knowledges();
        expect(result.length).toBe(2);
      });
    });
  });

  describe('Mutation', () => {
    describe('createKnowledge', () => {
      it('devrait créer un nouveau knowledge', async () => {
        const knowledge = {
          title: 'Nouveau Knowledge',
          content: 'Ceci est un nouveau knowledge',
        };

        const result = await knowledgeResolver.createKnowledge(null, { knowledge });
        expect(result).toHaveProperty('title', knowledge.title);
        expect(result).toHaveProperty('content', knowledge.content);
      });
    });

    describe('updateKnowledge', () => {
      it('devrait mettre à jour un knowledge existant', async () => {
        const existingKnowledge = await knowledgeService.createKnowledge({
          title: 'Knowledge existant',
          content: 'Ceci est un knowledge existant',
        });

        const updatedKnowledge = {
          title: 'Knowledge mis à jour',
          content: 'Ceci est un knowledge mis à jour',
        };

        const result = await knowledgeResolver.updateKnowledge(null, { id: existingKnowledge._id, knowledge: updatedKnowledge });
        expect(result).toHaveProperty('title', updatedKnowledge.title);
        expect(result).toHaveProperty('content', updatedKnowledge.content);
      });
    });

    describe('deleteKnowledge', () => {
      it('devrait supprimer un knowledge', async () => {
        const knowledge = await knowledgeService.createKnowledge({
          title: 'Knowledge à supprimer',
          content: 'Ceci est un knowledge à supprimer',
        });

        await knowledgeResolver.deleteKnowledge(null, { id: knowledge._id });
        const result = await knowledgeService.getKnowledge(knowledge._id);
        expect(result).toBeNull();
      });
    });
  });
});
```
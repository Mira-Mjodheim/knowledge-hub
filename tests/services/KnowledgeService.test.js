```javascript
const { KnowledgeService } = require('../../src/services/KnowledgeService');
const { Knowledge } = require('../../src/models/Knowledge');
const { MongoClient } = require('mongodb');
const { connectDB } = require('../../src/db/mongo');

describe('KnowledgeService', () => {
  let knowledgeService;
  let client;
  let db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URI);
    db = client.db();
    await connectDB(db);
    knowledgeService = new KnowledgeService(db);
  });

  afterAll(async () => {
    await client.close();
  });

  describe('createKnowledge', () => {
    it('devrait créer une nouvelle connaissance', async () => {
      const knowledge = {
        title: 'Nouvelle connaissance',
        description: 'Description de la nouvelle connaissance',
      };
      const result = await knowledgeService.createKnowledge(knowledge);
      expect(result).toHaveProperty('title', 'Nouvelle connaissance');
      expect(result).toHaveProperty('description', 'Description de la nouvelle connaissance');
    });

    it('devrait lever une erreur si le titre est manquant', async () => {
      const knowledge = {
        description: 'Description de la nouvelle connaissance',
      };
      await expect(knowledgeService.createKnowledge(knowledge)).rejects.toThrow();
    });
  });

  describe('getKnowledge', () => {
    it('devrait récupérer une connaissance par son ID', async () => {
      const knowledge = await Knowledge.create({
        title: 'Connaissance existante',
        description: 'Description de la connaissance existante',
      });
      const result = await knowledgeService.getKnowledge(knowledge._id);
      expect(result).toHaveProperty('title', 'Connaissance existante');
      expect(result).toHaveProperty('description', 'Description de la connaissance existante');
    });

    it('devrait lever une erreur si la connaissance n\'existe pas', async () => {
      await expect(knowledgeService.getKnowledge('')).rejects.toThrow();
    });
  });

  describe('updateKnowledge', () => {
    it('devrait mettre à jour une connaissance existante', async () => {
      const knowledge = await Knowledge.create({
        title: 'Connaissance existante',
        description: 'Description de la connaissance existante',
      });
      const updatedKnowledge = {
        title: 'Connaissance mise à jour',
      };
      const result = await knowledgeService.updateKnowledge(knowledge._id, updatedKnowledge);
      expect(result).toHaveProperty('title', 'Connaissance mise à jour');
    });

    it('devrait lever une erreur si la connaissance n\'existe pas', async () => {
      const updatedKnowledge = {
        title: 'Connaissance mise à jour',
      };
      await expect(knowledgeService.updateKnowledge('', updatedKnowledge)).rejects.toThrow();
    });
  });

  describe('deleteKnowledge', () => {
    it('devrait supprimer une connaissance existante', async () => {
      const knowledge = await Knowledge.create({
        title: 'Connaissance existante',
        description: 'Description de la connaissance existante',
      });
      await knowledgeService.deleteKnowledge(knowledge._id);
      await expect(Knowledge.findById(knowledge._id)).resolves.toBeNull();
    });

    it('devrait lever une erreur si la connaissance n\'existe pas', async () => {
      await expect(knowledgeService.deleteKnowledge('')).rejects.toThrow();
    });
  });
});
```
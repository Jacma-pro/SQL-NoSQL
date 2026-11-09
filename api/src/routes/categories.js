// GET /api/categories : catégories de chambres et leur tarif.
// Utilisé par l'accueil public (cartes « Nos chambres »).
import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows, sql } = await query(
    `SELECT id_categorie, libelle, description, tarif_nuit
       FROM categorie
      ORDER BY tarif_nuit`
  );
  res.json({ data: rows, sql });
});

export default router;

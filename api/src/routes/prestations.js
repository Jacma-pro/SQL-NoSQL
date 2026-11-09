// GET /api/prestations : prestations proposées pendant le séjour et leur prix.
// Utilisé par la fiche chambre publique (section « À votre rythme »).
import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows, sql } = await query(
    `SELECT id_prestation, libelle, prix_unitaire
       FROM prestation
      ORDER BY id_prestation`
  );
  res.json({ data: rows, sql });
});

export default router;

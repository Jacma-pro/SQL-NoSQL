// GET /api/sante : vérifie que l'API arrive à joindre la base.
import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { rows, sql } = await query('SELECT now() AS heure_base');
    res.json({ data: { statut: 'ok', heure_base: rows[0].heure_base }, sql });
  } catch (err) {
    // 503 = service indisponible : l'API tourne mais la base ne répond pas.
    console.error('Base injoignable :', err.message);
    res.status(503).json({ erreur: 'Base de données injoignable' });
  }
});

export default router;

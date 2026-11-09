// Routes de lecture des hôtels et de leurs chambres.
// Chaque réponse a la forme { data, sql } : sql = requête paramétrée + valeurs.
import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/hotels : liste des hôtels
router.get('/', async (req, res) => {
  const { rows, sql } = await query(
    'SELECT id_hotel, nom, adresse FROM hotel ORDER BY nom'
  );
  res.json({ data: rows, sql });
});

// GET /api/hotels/:id/chambres : chambres d'un hôtel avec leur catégorie
router.get('/:id/chambres', async (req, res) => {
  // Validation : uniquement des chiffres (refuse "1e2", " 3", "-1", "abc"…).
  if (!/^\d+$/.test(req.params.id) || Number(req.params.id) === 0) {
    return res.status(400).json({ erreur: "L'identifiant d'hôtel doit être un entier positif" });
  }
  const idHotel = Number(req.params.id);

  // $1 est remplacé par le serveur PostgreSQL, pas par du JavaScript :
  // la valeur ne peut donc jamais être interprétée comme du SQL.
  const { rows, sql } = await query(
    `SELECT c.numero, c.etage, c.etat, cat.libelle AS categorie
       FROM chambre c
       JOIN categorie cat ON cat.id_categorie = c.id_categorie
      WHERE c.id_hotel = $1
      ORDER BY c.numero`,
    [idHotel]
  );
  res.json({ data: rows, sql });
});

export default router;

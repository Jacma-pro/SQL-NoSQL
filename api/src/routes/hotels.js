// Routes de lecture des hôtels et de leurs chambres.
// Chaque réponse a la forme { data, sql } : sql = requête paramétrée + valeurs.
import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/hotels : liste des hôtels, avec le nombre de chambres libres ce soir.
//
// Une chambre est « disponible » si elle n'est pas en maintenance et
// qu'aucun séjour non annulé ne couvre la nuit d'aujourd'hui
// (date_debut <= aujourd'hui < date_fin : le jour de départ, la chambre est libre).
// En phase 3, ce calcul sera remplacé par la fonction SQL chambres_libres().
router.get('/', async (req, res) => {
  const { rows, sql } = await query(
    `SELECT h.id_hotel, h.nom, h.adresse,
            COUNT(c.numero) FILTER (
              WHERE c.etat <> 'maintenance'
                AND NOT EXISTS (
                  SELECT 1
                    FROM sejour s
                   WHERE s.numero_chambre = c.numero
                     AND s.statut <> 'annule'
                     AND s.date_debut <= CURRENT_DATE
                     AND s.date_fin > CURRENT_DATE
                )
            )::int AS chambres_disponibles
       FROM hotel h
       LEFT JOIN chambre c ON c.id_hotel = h.id_hotel
      GROUP BY h.id_hotel
      ORDER BY h.id_hotel`
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

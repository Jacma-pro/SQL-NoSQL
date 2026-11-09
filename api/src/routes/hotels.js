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

// Une date "AAAA-MM-JJ" qui existe vraiment (refuse "2026-02-30", "demain"…).
function estDateValide(texte) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const date = new Date(`${texte}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(texte);
}

// GET /api/hotels/:id/disponibilites?arrivee=AAAA-MM-JJ&depart=AAAA-MM-JJ
// Catégories ayant au moins une chambre libre sur toute la période, avec le
// nombre de chambres libres. Utilisé par l'écran public « Résultats ».
//
// Deux séjours se chevauchent si l'un commence avant que l'autre se termine :
//   s.date_debut < depart  ET  s.date_fin > arrivee
// (le jour de départ d'un client, la chambre peut accueillir le suivant).
// En phase 3, ce calcul sera remplacé par la fonction SQL chambres_libres().
router.get('/:id/disponibilites', async (req, res) => {
  const { arrivee, depart } = req.query;
  if (!/^\d+$/.test(req.params.id) || Number(req.params.id) === 0) {
    return res.status(400).json({ erreur: "L'identifiant d'hôtel doit être un entier positif" });
  }
  if (!estDateValide(arrivee) || !estDateValide(depart)) {
    return res.status(400).json({ erreur: 'Les dates doivent être au format AAAA-MM-JJ' });
  }
  // Même règle que la contrainte CHECK (date_fin > date_debut) de la table sejour.
  if (depart <= arrivee) {
    return res.status(400).json({ erreur: "La date de départ doit être après la date d'arrivée" });
  }

  const { rows, sql } = await query(
    `SELECT cat.id_categorie, cat.libelle, cat.description, cat.tarif_nuit,
            COUNT(*)::int AS chambres_libres
       FROM chambre c
       JOIN categorie cat ON cat.id_categorie = c.id_categorie
      WHERE c.id_hotel = $1
        AND c.etat <> 'maintenance'
        AND NOT EXISTS (
          SELECT 1
            FROM sejour s
           WHERE s.numero_chambre = c.numero
             AND s.statut <> 'annule'
             AND s.date_debut < $3
             AND s.date_fin > $2
        )
      GROUP BY cat.id_categorie
      ORDER BY cat.tarif_nuit`,
    [Number(req.params.id), arrivee, depart]
  );
  res.json({ data: rows, sql });
});

export default router;

-- =============================================================================
-- 02_seed.sql — Jeu de données de test
-- Projet « Hôtel » — application de réception
-- =============================================================================
--
-- À exécuter APRÈS 01_schema.sql, sur une base vide.
--
-- Contenu : 2 hôtels, 4 catégories, 20 chambres, 11 employés, 11 clients
--           (dont 1 en soft delete), 20 séjours (passés / en cours / futurs /
--           annulés), 6 prestations, des consommations, des paiements et
--           des interventions de ménage et de maintenance.
--
-- Deux choix d'écriture, expliqués une fois ici :
--
--  1. Les dates sont RELATIVES (CURRENT_DATE + n) et non écrites en dur.
--     Le tableau de bord doit afficher « arrivées et départs du jour » :
--     avec des dates figées, l'écran serait vide dès le lendemain du seed.
--     Ici, le jeu de test reste cohérent quel que soit le jour où on le rejoue.
--
--  2. Les numéros de chambre sont écrits entre apostrophes ('101' et non 101).
--     Un littéral entre apostrophes est de type « inconnu » pour PostgreSQL :
--     il s'adapte aussi bien à une colonne VARCHAR qu'à une colonne INTEGER.
--     L'inverse n'est pas vrai. Le seed passe donc quel que soit le type
--     retenu dans 01_schema.sql.
--
-- Tout est dans une transaction : en cas d'erreur, rien n'est inséré.
-- =============================================================================

SET client_encoding = 'UTF8';

BEGIN;


-- -----------------------------------------------------------------------------
-- 1. CATÉGORIES
-- -----------------------------------------------------------------------------
-- type_salle_eau : 'complete' (baignoire) ou 'simple' (douche), cf. TP 1.
-- -----------------------------------------------------------------------------

INSERT INTO categorie (id, libelle, type_salle_eau, tarif_nuit) VALUES
  (1, 'Simple',      'simple',   75.00),
  (2, 'Confort',     'complete', 110.00),
  (3, 'Supérieure',  'complete', 150.00),
  (4, 'Suite',       'complete', 240.00);


-- -----------------------------------------------------------------------------
-- 2. HÔTELS  (directeur_id laissé à NULL pour l'instant)
-- -----------------------------------------------------------------------------
-- hotel.directeur_id pointe vers employe, et employe.hotel_id pointe vers hotel :
-- les deux tables se référencent mutuellement. On casse le cercle en trois temps
-- -> hôtels sans directeur, puis employés, puis UPDATE pour nommer les directeurs.
-- -----------------------------------------------------------------------------

INSERT INTO hotel (id, nom, adresse, directeur_id) VALUES
  (1, 'Hôtel du Parc',    '12 avenue Félix Viallet, 38000 Grenoble', NULL),
  (2, 'Hôtel Belledonne', '4 place Monge, 73000 Chambéry',           NULL);


-- -----------------------------------------------------------------------------
-- 3. EMPLOYÉS
-- -----------------------------------------------------------------------------
-- responsable_id référence employe(id) : c'est l'auto-jointure qui servira à
-- l'organigramme de la page Direction. Les directrices (1 et 8) n'ont pas de
-- responsable, d'où le NULL.
-- -----------------------------------------------------------------------------

INSERT INTO employe (id, nom, prenom, poste, salaire, hotel_id, responsable_id) VALUES
  -- Hôtel du Parc
  (1,  'Marchand', 'Claire',  'Directrice',           4200.00, 1, NULL),
  (2,  'Dubois',   'Marc',    'Réceptionniste',       2100.00, 1, 1),
  (3,  'Perrin',   'Sofia',   'Réceptionniste',       2050.00, 1, 1),
  (4,  'Nguyen',   'Linh',    'Gouvernante',          2400.00, 1, 1),
  (5,  'Lopez',    'Ana',     'Femme de chambre',     1850.00, 1, 4),
  (6,  'Traoré',   'Idriss',  'Valet de chambre',     1850.00, 1, 4),
  (7,  'Benali',   'Karim',   'Agent de maintenance', 2200.00, 1, 1),
  -- Hôtel Belledonne
  (8,  'Rossi',    'Elena',   'Directrice',           4000.00, 2, NULL),
  (9,  'Garnier',  'Hugo',    'Réceptionniste',       2050.00, 2, 8),
  (10, 'Faure',    'Lucie',   'Femme de chambre',     1850.00, 2, 8),
  (11, 'Moreau',   'Thomas',  'Agent de maintenance', 2150.00, 2, 8);


-- Chaque hôtel est dirigé par un de ses employés (énoncé du TP 1).
UPDATE hotel SET directeur_id = 1 WHERE id = 1;
UPDATE hotel SET directeur_id = 8 WHERE id = 2;


-- -----------------------------------------------------------------------------
-- 4. CHAMBRES
-- -----------------------------------------------------------------------------
-- `numero` est la clé primaire : il doit donc être unique sur TOUTE la base,
-- pas seulement dans un hôtel. Convention retenue :
--   - Hôtel du Parc    : étage + rang      -> 101..104, 201..204, 301..304
--   - Hôtel Belledonne : 2 + étage + rang  -> 2101..2104, 2201..2204
--     (le « 2 » de tête est le code de l'établissement, pas l'étage)
--
-- etat : 'propre', 'sale' ou 'maintenance'.
-- Les chambres 102 et 2103 sont sales (ménage à faire, cf. section 11),
-- les chambres 301 et 2204 sont en maintenance.
-- -----------------------------------------------------------------------------

INSERT INTO chambre (numero, etage, etat, categorie_id, hotel_id) VALUES
  -- Hôtel du Parc — étage 1
  ('101', 1, 'propre',      1, 1),
  ('102', 1, 'sale',        1, 1),
  ('103', 1, 'propre',      2, 1),
  ('104', 1, 'propre',      2, 1),
  -- Hôtel du Parc — étage 2
  ('201', 2, 'propre',      2, 1),
  ('202', 2, 'propre',      2, 1),
  ('203', 2, 'propre',      3, 1),
  ('204', 2, 'propre',      3, 1),
  -- Hôtel du Parc — étage 3
  ('301', 3, 'maintenance', 3, 1),
  ('302', 3, 'propre',      3, 1),
  ('303', 3, 'propre',      4, 1),
  ('304', 3, 'propre',      4, 1),
  -- Hôtel Belledonne — étage 1
  ('2101', 1, 'propre',      1, 2),
  ('2102', 1, 'propre',      1, 2),
  ('2103', 1, 'sale',        2, 2),
  ('2104', 1, 'propre',      2, 2),
  -- Hôtel Belledonne — étage 2
  ('2201', 2, 'propre',      2, 2),
  ('2202', 2, 'propre',      3, 2),
  ('2203', 2, 'propre',      3, 2),
  ('2204', 2, 'maintenance', 4, 2);


-- -----------------------------------------------------------------------------
-- 5. CLIENTS
-- -----------------------------------------------------------------------------
-- supprime_le NULL = fiche active. Le client 11 est un doublon « supprimé »
-- il y a 30 jours : il sert à démontrer le soft delete (la ligne reste en base,
-- les écrans doivent la masquer avec WHERE supprime_le IS NULL).
-- Les e-mails sont tous distincts, à cause du UNIQUE (email).
-- Domaine example.com : réservé par la RFC 2606, aucune adresse réelle.
-- -----------------------------------------------------------------------------

INSERT INTO client (id, nom, prenom, email, telephone, supprime_le) VALUES
  (1,  'Lefèvre',  'Camille', 'camille.lefevre@example.com',  '0612345678', NULL),
  (2,  'Moreau',   'Julien',  'julien.moreau@example.com',    '0623456789', NULL),
  (3,  'Da Silva', 'Inès',    'ines.dasilva@example.com',     '0634567890', NULL),
  (4,  'Bernard',  'Thomas',  'thomas.bernard@example.com',   '0645678901', NULL),
  (5,  'Kowalski', 'Anna',    'anna.kowalski@example.com',    '0656789012', NULL),
  (6,  'Hassani',  'Youssef', 'youssef.hassani@example.com',  '0667890123', NULL),
  (7,  'Petit',    'Chloé',   'chloe.petit@example.com',      '0678901234', NULL),
  (8,  'Roux',     'Gabriel', 'gabriel.roux@example.com',     '0689012345', NULL),
  (9,  'Lemoine',  'Sarah',   'sarah.lemoine@example.com',    '0690123456', NULL),
  (10, 'Girard',   'Pierre',  'pierre.girard@example.com',    '0601234567', NULL),
  -- Fiche en doublon, supprimée logiquement
  (11, 'Lefevre',  'Camille', 'c.lefevre.ancien@example.com', '0612345678', CURRENT_DATE - 30);


-- -----------------------------------------------------------------------------
-- 6. SÉJOURS
-- -----------------------------------------------------------------------------
-- statut : 'reservé', 'en cours', 'terminé', 'annulé'.
--
-- Aucune chambre n'a deux séjours qui se chevauchent : le trigger
-- anti-chevauchement de la phase 3 doit accepter ce jeu de données tel quel.
--
-- Répartition voulue pour que tous les écrans aient de la matière :
--   - 7 séjours terminés   -> historique client, CA, factures soldées
--   - 5 séjours en cours   -> plan des chambres occupées
--   - 1 départ aujourd'hui (séjour 12) et 2 arrivées aujourd'hui (13 et 14)
--     -> encadré « arrivées / départs du jour » du tableau de bord
--   - 4 réservations futures -> planning
--   - 2 séjours annulés
--   - chambres 2203 et 2204 sans aucun séjour -> toujours libres, pratique
--     pour tester chambres_libres()
-- -----------------------------------------------------------------------------

INSERT INTO sejour (id, client_id, chambre_numero, date_debut, date_fin, statut) VALUES
  -- Séjours terminés
  (1,  1,  '101',  CURRENT_DATE - 40, CURRENT_DATE - 37, 'terminé'),
  (2,  2,  '102',  CURRENT_DATE - 30, CURRENT_DATE - 28, 'terminé'),
  (3,  3,  '201',  CURRENT_DATE - 25, CURRENT_DATE - 20, 'terminé'),
  (4,  1,  '301',  CURRENT_DATE - 15, CURRENT_DATE - 12, 'terminé'),
  (5,  4,  '202',  CURRENT_DATE - 10, CURRENT_DATE - 8,  'terminé'),
  (6,  5,  '2101', CURRENT_DATE - 20, CURRENT_DATE - 18, 'terminé'),
  (7,  6,  '2201', CURRENT_DATE - 9,  CURRENT_DATE - 6,  'terminé'),

  -- Séjours en cours
  (8,  2,  '103',  CURRENT_DATE - 2,  CURRENT_DATE + 2,  'en cours'),
  (9,  7,  '203',  CURRENT_DATE - 1,  CURRENT_DATE + 3,  'en cours'),
  (10, 8,  '302',  CURRENT_DATE - 3,  CURRENT_DATE + 1,  'en cours'),
  (11, 5,  '2102', CURRENT_DATE - 1,  CURRENT_DATE + 4,  'en cours'),
  -- Départ aujourd'hui : facture soldée, le check-out doit pouvoir passer
  (12, 9,  '104',  CURRENT_DATE - 4,  CURRENT_DATE,      'en cours'),

  -- Arrivées aujourd'hui : réservées, check-in à faire depuis le tableau de bord
  (13, 10, '204',  CURRENT_DATE,      CURRENT_DATE + 3,  'reservé'),
  (14, 3,  '2202', CURRENT_DATE,      CURRENT_DATE + 2,  'reservé'),

  -- Réservations futures
  (15, 4,  '101',  CURRENT_DATE + 5,  CURRENT_DATE + 9,  'reservé'),
  (16, 6,  '303',  CURRENT_DATE + 7,  CURRENT_DATE + 10, 'reservé'),
  (17, 7,  '2103', CURRENT_DATE + 12, CURRENT_DATE + 15, 'reservé'),
  (18, 1,  '304',  CURRENT_DATE + 20, CURRENT_DATE + 22, 'reservé'),

  -- Séjours annulés
  (19, 8,  '102',  CURRENT_DATE + 3,  CURRENT_DATE + 6,  'annulé'),
  (20, 9,  '2104', CURRENT_DATE - 5,  CURRENT_DATE - 3,  'annulé');


-- -----------------------------------------------------------------------------
-- 7. PRESTATIONS
-- -----------------------------------------------------------------------------

INSERT INTO prestation (id, libelle, prix_unitaire) VALUES
  (1, 'Petit-déjeuner',    14.00),
  (2, 'Spa',               35.00),
  (3, 'Parking',           12.00),
  (4, 'Blanchisserie',      9.50),
  (5, 'Minibar',            6.00),
  (6, 'Navette aéroport',  28.00);


-- -----------------------------------------------------------------------------
-- 8. CONSOMMATIONS
-- -----------------------------------------------------------------------------
-- Un même couple (sejour_id, prestation_id) n'apparaît jamais deux fois :
-- la quantité regroupe le total du séjour (4 petits-déjeuners = 2 personnes
-- sur 2 matins). Le seed reste valide que la clé primaire composée soit
-- (sejour_id, prestation_id) ou (sejour_id, prestation_id, date_conso).
-- -----------------------------------------------------------------------------

INSERT INTO consommer (sejour_id, prestation_id, date_conso, quantite) VALUES
  -- Séjours terminés
  (1,  1, CURRENT_DATE - 39, 3),   -- 3 petits-déjeuners
  (2,  3, CURRENT_DATE - 30, 2),   -- 2 nuits de parking
  (3,  1, CURRENT_DATE - 24, 10),
  (3,  2, CURRENT_DATE - 22, 2),
  (4,  5, CURRENT_DATE - 14, 4),
  (6,  1, CURRENT_DATE - 19, 2),
  (7,  6, CURRENT_DATE - 9,  2),
  -- Séjours en cours
  (8,  1, CURRENT_DATE - 1,  4),
  (9,  2, CURRENT_DATE,      1),
  (10, 3, CURRENT_DATE - 3,  4),
  (11, 4, CURRENT_DATE,      1),
  (12, 1, CURRENT_DATE - 3,  8);


-- -----------------------------------------------------------------------------
-- 9. PAIEMENTS
-- -----------------------------------------------------------------------------
-- mode : 'CB', 'espèces' ou 'virement'.
--
-- Montants cohérents avec v_facture_sejour (nuits x tarif + prestations) :
--   - séjours terminés  -> soldés, reste à payer = 0
--   - séjours en cours  -> arrhes seulement, sauf le séjour 12 qui part
--                          aujourd'hui et doit être soldé pour le check-out
--   - réservations      -> arrhes de 30 %, ou rien
--   - séjours annulés   -> aucun paiement
--
-- Le séjour 3 porte deux paiements (arrhes puis solde) pour vérifier que la
-- facture sait additionner plusieurs règlements.
-- -----------------------------------------------------------------------------

INSERT INTO paiement (id, sejour_id, montant, mode, date_paiement) VALUES
  -- Terminés, soldés
  (1,  1,  267.00, 'CB',       CURRENT_DATE - 37),  -- 3 x 75 + 3 x 14
  (2,  2,  174.00, 'espèces',  CURRENT_DATE - 28),  -- 2 x 75 + 2 x 12
  (3,  3,  300.00, 'virement', CURRENT_DATE - 30),  -- arrhes
  (4,  3,  460.00, 'CB',       CURRENT_DATE - 20),  -- solde (total 760)
  (5,  4,  474.00, 'CB',       CURRENT_DATE - 12),  -- 3 x 150 + 4 x 6
  (6,  5,  220.00, 'CB',       CURRENT_DATE - 8),   -- 2 x 110
  (7,  6,  178.00, 'CB',       CURRENT_DATE - 18),  -- 2 x 75 + 2 x 14
  (8,  7,  386.00, 'virement', CURRENT_DATE - 6),   -- 3 x 110 + 2 x 28

  -- En cours, arrhes
  (9,  8,  150.00, 'CB',       CURRENT_DATE - 2),
  (10, 9,  200.00, 'virement', CURRENT_DATE - 1),
  (11, 10, 300.00, 'CB',       CURRENT_DATE - 3),
  (12, 11, 100.00, 'espèces',  CURRENT_DATE - 1),
  -- Départ aujourd'hui : soldé (4 x 110 + 8 x 14)
  (13, 12, 552.00, 'CB',       CURRENT_DATE),

  -- Réservations, arrhes de 30 %
  (14, 13, 135.00, 'CB',       CURRENT_DATE - 6),   -- 30 % de 450
  (15, 15,  90.00, 'virement', CURRENT_DATE - 2),   -- 30 % de 300
  (16, 16, 216.00, 'CB',       CURRENT_DATE - 1),   -- 30 % de 720
  (17, 18, 144.00, 'CB',       CURRENT_DATE);       -- 30 % de 480


-- -----------------------------------------------------------------------------
-- 10. INTERVENTIONS
-- -----------------------------------------------------------------------------
-- type : 'ménage' ou 'maintenance'. statut : 'à faire' ou 'terminée'.
--
-- Les interventions « à faire » alimentent l'écran mobile des femmes de chambre.
-- Elles correspondent aux chambres marquées 'sale' ou 'maintenance' en section 4.
-- Les interventions « terminée » portent sur des chambres déjà remises en
-- 'propre' : le trigger de la phase 3 restera donc cohérent avec ces données.
-- -----------------------------------------------------------------------------

INSERT INTO intervention (id, chambre_numero, employe_id, type, date_intervention, statut) VALUES
  -- À faire
  (1, '102',  5,  'ménage',      CURRENT_DATE,      'à faire'),
  (2, '2103', 10, 'ménage',      CURRENT_DATE,      'à faire'),
  (3, '301',  7,  'maintenance', CURRENT_DATE - 1,  'à faire'),
  (4, '2204', 11, 'maintenance', CURRENT_DATE - 2,  'à faire'),
  -- Terminées
  (5, '202',  6,  'ménage',      CURRENT_DATE - 8,  'terminée'),
  (6, '201',  5,  'ménage',      CURRENT_DATE - 20, 'terminée'),
  (7, '2101', 10, 'ménage',      CURRENT_DATE - 18, 'terminée');


-- -----------------------------------------------------------------------------
-- 11. REMISE À NIVEAU DES SÉQUENCES
-- -----------------------------------------------------------------------------
-- Les id ont été écrits en dur ci-dessus. Si les colonnes sont en SERIAL ou en
-- IDENTITY, leur compteur est resté à 1 : le premier INSERT fait par l'API
-- tenterait alors de réutiliser l'id 1 et planterait sur la clé primaire.
-- On recale donc chaque compteur sur MAX(id) + 1.
--
-- pg_get_serial_sequence renvoie NULL si la colonne n'a pas de séquence
-- (clé saisie à la main) : dans ce cas la table est simplement ignorée.
-- -----------------------------------------------------------------------------

DO $$
DECLARE
  nom_table text;
  nom_sequence text;
BEGIN
  FOREACH nom_table IN ARRAY ARRAY[
    'categorie', 'hotel', 'employe', 'client',
    'sejour', 'prestation', 'paiement', 'intervention'
  ] LOOP
    nom_sequence := pg_get_serial_sequence(nom_table, 'id');
    IF nom_sequence IS NOT NULL THEN
      EXECUTE format(
        'SELECT setval(%L, COALESCE((SELECT MAX(id) FROM %I), 0) + 1, false)',
        nom_sequence, nom_table
      );
    END IF;
  END LOOP;
END $$;


COMMIT;


-- =============================================================================
-- VÉRIFICATIONS (à lancer à la main après le seed)
-- =============================================================================
--
-- Compte des lignes par table :
--
--   SELECT 'categorie' AS table, COUNT(*) FROM categorie
--   UNION ALL SELECT 'hotel',        COUNT(*) FROM hotel
--   UNION ALL SELECT 'employe',      COUNT(*) FROM employe
--   UNION ALL SELECT 'chambre',      COUNT(*) FROM chambre
--   UNION ALL SELECT 'client',       COUNT(*) FROM client
--   UNION ALL SELECT 'sejour',       COUNT(*) FROM sejour
--   UNION ALL SELECT 'prestation',   COUNT(*) FROM prestation
--   UNION ALL SELECT 'consommer',    COUNT(*) FROM consommer
--   UNION ALL SELECT 'paiement',     COUNT(*) FROM paiement
--   UNION ALL SELECT 'intervention', COUNT(*) FROM intervention;
--
--   -> 4, 2, 11, 20, 11, 20, 6, 12, 17, 7
--
-- Arrivées et départs du jour (encadré du tableau de bord) :
--
--   SELECT id, chambre_numero, statut, date_debut, date_fin
--   FROM sejour
--   WHERE date_debut = CURRENT_DATE OR date_fin = CURRENT_DATE
--   ORDER BY date_debut;
--
--   -> séjours 12 (départ), 13 et 14 (arrivées)
--
-- Aucun chevauchement sur une même chambre (doit renvoyer 0 ligne) :
--
--   SELECT a.id, b.id, a.chambre_numero
--   FROM sejour a
--   JOIN sejour b
--     ON a.chambre_numero = b.chambre_numero
--    AND a.id < b.id
--    AND a.date_debut < b.date_fin
--    AND b.date_debut < a.date_fin
--   WHERE a.statut <> 'annulé' AND b.statut <> 'annulé';
--
-- Test du trigger anti-chevauchement (phase 3) — doit être REFUSÉ :
-- la chambre 103 est déjà occupée par le séjour 8 jusqu'à CURRENT_DATE + 2.
--
--   INSERT INTO sejour (client_id, chambre_numero, date_debut, date_fin, statut)
--   VALUES (4, '103', CURRENT_DATE, CURRENT_DATE + 1, 'reservé');
--
-- =============================================================================

- Le mode projet consiste à faire coexister, aux côtés des cours traditionnels, un travail transversal à différents enseignements, généralement réalisé en groupe.
- Réaliser un projet par groupe, en binôme ou en trinôme maximum, pendant les cours.
- Choisir un sujet en accord avec d’autres projets liés à la partie « Grand Projet Applicatif ».
- Développer une solution SQL et NoSQL.
- Développer une API.
- Concevoir une application web.
- Concevoir une application mobile.
- Proposer une carte blanche locale.
- Éventuellement, choisir un sujet selon une élection personnelle ou particulière.
- Utiliser un SGBDR, puis effectuer une migration vers un autre SGBDR.

---

# Plan du projet : « Hôtel » — application de réception

## Ce qu'on retient des consignes (PDF du module)

- **Grand Projet Applicatif** : le PDF ne le détaille pas. À demander au prof à la prochaine séance pour savoir si le sujet doit être lié à un autre projet. En attendant, on part sur l'hôtel du TP 1.
- **Dates des séances** : 26/10, 09/11, 17/12, 18/12 (en autonomie), 27/01. Le projet compte pour 14 h, avec une évaluation individuelle.
- **Notions à montrer dans le projet** (pages 7 à 14 du PDF) : MCD/MLD/MPD, clés et contraintes, DQL/DML/DDL, jointures, `GROUP BY`/`HAVING`/`CASE`, pagination, sous-requêtes, vues, procédures stockées, fonctions, triggers, index, transactions, soft delete, injection SQL, droits par profil, sauvegarde/restauration, NoSQL de type document, migration d'un SGBDR vers un autre.

## Le concept

Une application de **réception d'hôtel**. L'utilisateur ne tape jamais de SQL : il clique sur des actions métier (réserver, faire un check-in ou un check-out, voir les chambres libres…). Un **panneau « SQL exécuté »** affiche, en lecture seule, la requête jouée en base. C'est la partie pédagogique de l'interface.

## Stack technique

| Brique | Choix | Rôle |
|---|---|---|
| SGBDR 1 | **PostgreSQL (Supabase)** | Base principale |
| SGBDR 2 | **MySQL** (Docker en local) | Cible de la migration |
| NoSQL | **MongoDB Atlas** (offre gratuite) | Avis clients et journal des actions |
| API | **Node.js + Express** + `pg` | Requêtes paramétrées, renvoie aussi le SQL exécuté |
| Web | **React (Vite) + SCSS** | Interface de réception |
| Mobile | **Expo (React Native)** | Application « femme de chambre » |
| Secrets | `.env` (non commité) | Chaînes de connexion |

## Modèle de données (MCD et MLD dans le FigJam « SQL »)

- `categorie` (id, libelle, description, tarif_nuit) : Économique, Standard, Confort, Suite…
- `chambre` (numero, etage, etat [propre/sale/maintenance], categorie_id → categorie, hotel_id → hotel)
- `client` (id, nom, prenom, email, telephone, supprime_le) → **soft delete**
- `employe` (id, nom, prenom, poste, salaire, hotel_id → hotel, responsable_id → employe)
- `hotel` (id, nom, adresse, directeur_id → employe)
- `sejour` (id, client_id, chambre_numero, date_debut, date_fin, statut [reservé/en cours/terminé/annulé])
- `prestation` (id, libelle, prix_unitaire) : petit-déjeuner, spa, parking…
- `consommer` (sejour_id, prestation_id, date_conso, quantite) : clé primaire composée
- `paiement` (id, sejour_id, montant, mode [CB/espèces/virement], date_paiement)
- `intervention` (id, chambre_numero, employe_id, type [ménage/maintenance], date_intervention, statut [à faire/terminée])

Contraintes à poser : `CHECK (date_fin > date_debut)`, `UNIQUE (email)`, `FOREIGN KEY` avec `ON DELETE RESTRICT`, `CHECK (tarif_nuit > 0)`, `CHECK (quantite > 0)`, `CHECK (montant > 0)`.

## Objets SQL à créer

- **Vues** : `v_chambres_disponibles`, `v_occupation_du_jour`, `v_ca_par_categorie`, `v_facture_sejour` (nuits + prestations − paiements = reste à payer)
- **Fonctions** : `chambres_libres(date_debut, date_fin)` (renvoie une table), `montant_sejour(sejour_id)` (scalaire)
- **Procédures** : `check_in(sejour_id)`, `check_out(sejour_id)` dans une **transaction**. Le check-out vérifie que tout est payé, passe la chambre à « sale » et crée une intervention de ménage.
- **Triggers** : refuser une réservation qui chevauche une autre sur la même chambre ; passer la chambre à « propre » quand une intervention de ménage est terminée
- **Index** : sur `sejour(chambre_numero, date_debut, date_fin)` et `client(nom)`
- **Rôles** : `role_reception` (lecture et écriture sur les séjours et les clients), `role_direction` (lecture de tout, y compris les salaires et le CA), `role_menage` (lecture des chambres et mise à jour de leur état uniquement)

## Écrans

### Web (réception)

1. **Tableau de bord** : plan des chambres par étage, une couleur par état (libre, occupée, sale, maintenance), arrivées et départs du jour.
2. **Réserver** : choisir les dates, afficher les chambres libres (fonction `chambres_libres`), choisir ou créer un client, valider.
3. **Séjours** : liste paginée et filtrable, boutons check-in, check-out et annuler.
4. **Clients** : recherche, fiche avec l'historique des séjours, suppression logique (soft delete).
5. **Direction** : CA par catégorie, taux d'occupation, client le plus fidèle, organigramme des employés (auto-jointure).
6. **Panneau « SQL exécuté »** : présent sur tous les écrans, il affiche la dernière requête avec ses paramètres.

### Mobile (ménage)

- Liste des chambres à nettoyer, bouton « Chambre propre » qui fait un `UPDATE` de l'état
- Ajout d'un avis ou d'un incident sur une chambre, stocké dans MongoDB

## Fonctionnalités en plus (à choisir)

Idées en dehors du CRUD classique. Cochez celles qui vous intéressent et mettez votre prénom à côté. ⭐ = conseillé en priorité (bon rapport effort / effet en démo).

### Réception

- [ ] ⭐ **Planning des chambres** : frise façon Gantt, chambres en lignes, jours en colonnes, séjours en barres colorées sur 2 semaines. *SQL : `generate_series` sur les dates, jointure sur des intervalles.*
- [ ] ⭐ **Surclassement automatique** : si la catégorie demandée est pleine, proposer la catégorie supérieure la moins chère encore libre. *SQL : sous-requête, `ORDER BY tarif LIMIT 1`.*
- [ ] ⭐ **Changer de chambre en cours de séjour** : clôturer le séjour en cours et en ouvrir un nouveau dans une autre chambre. *SQL : transaction, tout est annulé si une étape échoue.*
- [ ] **Annulation avec frais** : 0 % si on annule plus de 7 jours avant, 50 % entre 2 et 7 jours, 100 % sinon. *SQL : `CASE` sur une différence de dates.*
- [ ] **Note détaillée au check-out** : nuits + prestations − paiements, affichée et imprimable. *SQL : vue `v_facture_sejour`.*

### Clients

- [ ] **Statut fidélité** : badge « Habitué » ou « VIP » selon le nombre de séjours ou le total dépensé. *SQL : `GROUP BY` + `HAVING` + `CASE`.*
- [ ] **Fusion de doublons** : rattacher tous les séjours de deux fiches à une seule, l'autre passe en soft delete. *SQL : transaction avec plusieurs `UPDATE` sur les clés étrangères.*
- [ ] **Anonymisation RGPD** : effacer nom, email et téléphone en gardant les séjours pour les statistiques. *Lien avec la partie « vie privée » du cours (page 4 du PDF).*
- [ ] **Import CSV de clients** : charger une liste de clients d'un coup. *SQL : insertion en masse (page 11 du PDF).*

### Direction

- [ ] **Tableau de bord** : taux d'occupation par mois, CA par catégorie, prestations les plus vendues. *SQL : agrégations.*
- [ ] ⭐ **Classement et évolution** : top 5 des clients, CA du mois comparé au mois précédent. *SQL : fonctions de fenêtrage `RANK()` et `LAG()`.*
- [ ] **Prévision** : taux de remplissage des 30 prochains jours. *SQL : `generate_series` + `LEFT JOIN`.*

### Ménage (mobile)

- [ ] **Répartition automatique** : le matin, répartir équitablement les chambres à faire entre les employés du ménage. *SQL : fonction, `ROW_NUMBER()` modulo le nombre d'employés.*
- [ ] **Chambre bloquée** : une chambre en maintenance ne peut pas être réservée. *SQL : trigger.*
- [ ] **Signalement avec photo** : incident (« fuite salle de bain ») avec photo. *MongoDB : document à schéma libre.*

### Vitrine SQL (pour la soutenance)

- [ ] ⭐ **`EXPLAIN` et temps d'exécution dans le panneau SQL** : générer 50 000 séjours, lancer la recherche de chambres libres, puis montrer le temps avant et après la création de l'index.
- [ ] **Démo d'injection SQL** : un bouton « version vulnérable » à côté de la « version sécurisée », sur le même formulaire de recherche.

## Partie NoSQL (MongoDB)

- Collection `avis` : note, commentaire, tags, photos éventuelles. Le schéma est libre, ce qui justifie le NoSQL.
- Collection `journal` : chaque action de l'API (qui, quand, quelle requête SQL, durée)
- Livrable : un comparatif SGBDR vs NoSQL (ACID vs BASE, schéma fixe vs libre, jointures vs documents imbriqués)

## Sécurité

- Uniquement des **requêtes paramétrées** (`$1, $2…`), jamais de concaténation. Démo d'une injection sur une version volontairement vulnérable, puis du correctif.
- Connexion de l'API avec un rôle limité, jamais avec le super-utilisateur
- Pas de comptes en base : trois profils (réception, direction, ménage) choisis au lancement de l'appli, chacun relié à son rôle SQL
- `.env` dans le `.gitignore`
- Vérifications OWASP de base : XSS (échappement côté React), validation des entrées côté API

## Sauvegarde et migration

- Script `pg_dump` pour la sauvegarde et `psql` pour la restauration, avec un test de restauration documenté
- **Migration PostgreSQL → MySQL** : convertir le DDL (`SERIAL` → `AUTO_INCREMENT`, `BOOLEAN`, `TIMESTAMPTZ`, `ILIKE` → `LIKE`, syntaxe des procédures et triggers), exporter et importer les données, rebrancher l'API sur MySQL, puis lister les différences rencontrées

## Arborescence prévue

```
sql/
  01_schema.sql        -- CREATE TABLE + contraintes
  02_seed.sql          -- données de test
  03_vues_fonctions.sql
  04_triggers.sql
  05_roles.sql
  mysql/               -- version migrée
api/                   -- Express + pg
web/                   -- React (Vite) + SCSS
mobile/                -- Expo
docs/                  -- MCD, MLD, comparatifs, captures
```

## Répartition à deux

On alterne les rôles pour que chacun sache tout expliquer à l'évaluation individuelle.

| | Personne A | Personne B |
|---|---|---|
| Base | Schéma, contraintes, seed | Vues, fonctions, triggers, rôles |
| API | Routes séjours et réservations | Routes clients, direction et ménage |
| Front | Web : tableau de bord et réservation | Web : séjours, clients, direction |
| Annexes | Migration MySQL | MongoDB et application mobile |
| Commun | Sécurité, sauvegarde, documentation | Sécurité, sauvegarde, documentation |

## Planning

| Échéance | Objectif |
|---|---|
| **09/11** | MCD/MLD validés, `01_schema.sql` et `02_seed.sql` sur Supabase, squelette React + API Express connecté à la base |
| **17/12** | Vues, fonctions, triggers et rôles terminés. Web : tableau de bord, réservation, séjours et panneau SQL fonctionnels |
| **18/12** (autonomie) | MongoDB (avis et journal), application mobile minimale, sécurité (injection, rôles, `.env`) |
| **27/01** | Migration MySQL, sauvegarde/restauration, page direction, documentation et démo |

## À faire tout de suite

- [ ] Demander au prof ce qu'est le « Grand Projet Applicatif » et si l'hôtel convient
- [ ] Créer le projet Supabase et le dépôt Git commun
- [ ] Finaliser le MCD de l'hôtel (TP 1) puis en tirer le MLD

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
| API | **Next.js API routes** + `pg` | Requêtes paramétrées, renvoie aussi le SQL exécuté |
| Web | **Next.js + Tailwind** | Interface de réception |
| Mobile | **Expo (React Native)** | Application « femme de chambre » |
| Secrets | `.env` (non commité) | Chaînes de connexion |

## Modèle de données (repris de l'E/R du TP 1)

- `categorie` (id, libelle, type_salle_eau [complete/simple], tarif_nuit)
- `chambre` (numero, etage, categorie_id → categorie, etat [propre/sale/maintenance])
- `client` (id, nom, prenom, email, telephone, supprime_le) → **soft delete**
- `employe` (id, nom, prenom, poste, salaire, responsable_id → employe)
- `hotel` (id, nom, adresse, directeur_id → employe)
- `sejour` (id, client_id, chambre_numero, date_debut, date_fin, statut [reservé/en cours/terminé/annulé])

Contraintes à poser : `CHECK (date_fin > date_debut)`, `UNIQUE (email)`, `FOREIGN KEY` avec `ON DELETE RESTRICT`, `CHECK (tarif_nuit > 0)`.

## Objets SQL à créer

- **Vues** : `v_chambres_disponibles`, `v_occupation_du_jour`, `v_ca_par_categorie`
- **Fonction** : `chambres_libres(date_debut, date_fin)` (renvoie une table)
- **Procédures** : `check_in(sejour_id)`, `check_out(sejour_id)` dans une **transaction**. Le check-out passe la chambre à « sale ».
- **Trigger** : refuser une réservation qui chevauche une autre sur la même chambre
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

## Partie NoSQL (MongoDB)

- Collection `avis` : note, commentaire, tags, photos éventuelles. Le schéma est libre, ce qui justifie le NoSQL.
- Collection `journal` : chaque action de l'API (qui, quand, quelle requête SQL, durée)
- Livrable : un comparatif SGBDR vs NoSQL (ACID vs BASE, schéma fixe vs libre, jointures vs documents imbriqués)

## Sécurité

- Uniquement des **requêtes paramétrées** (`$1, $2…`), jamais de concaténation. Démo d'une injection sur une version volontairement vulnérable, puis du correctif.
- Connexion de l'API avec un rôle limité, jamais avec le super-utilisateur
- Authentification simple avec trois profils (réception, direction, ménage) reliés aux rôles SQL
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
web/                   -- Next.js (front + API)
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
| **09/11** | MCD/MLD validés, `01_schema.sql` et `02_seed.sql` sur Supabase, squelette Next.js connecté à la base |
| **17/12** | Vues, fonctions, triggers et rôles terminés. Web : tableau de bord, réservation, séjours et panneau SQL fonctionnels |
| **18/12** (autonomie) | MongoDB (avis et journal), application mobile minimale, sécurité (injection, rôles, `.env`) |
| **27/01** | Migration MySQL, sauvegarde/restauration, page direction, documentation et démo |

## À faire tout de suite

- [ ] Demander au prof ce qu'est le « Grand Projet Applicatif » et si l'hôtel convient
- [ ] Créer le projet Supabase et le dépôt Git commun
- [ ] Finaliser le MCD de l'hôtel (TP 1) puis en tirer le MLD

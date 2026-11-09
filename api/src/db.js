// Accès à PostgreSQL.
//
// pg.Pool lit tout seul les variables d'environnement PGHOST, PGPORT,
// PGDATABASE, PGUSER et PGPASSWORD (fournies par docker-compose.yml) :
// aucune information de connexion n'est écrite ici.
import pg from 'pg';

const pool = new pg.Pool();

/**
 * Exécute une requête PARAMÉTRÉE et renvoie ses lignes ainsi que la requête
 * elle-même, pour que le front puisse l'afficher dans le panneau
 * « SQL exécuté ».
 *
 * @param {string} texte   requête avec des marqueurs $1, $2… (jamais de concaténation)
 * @param {Array}  valeurs valeurs des marqueurs, envoyées séparément au serveur
 */
export async function query(texte, valeurs = []) {
  const resultat = await pool.query(texte, valeurs);
  return { rows: resultat.rows, sql: { texte, valeurs } };
}

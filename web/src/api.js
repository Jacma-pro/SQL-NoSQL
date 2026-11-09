// Accès à l'API, partagé par le site public et la réception :
// les deux interfaces lisent les mêmes routes, donc les mêmes données.

/**
 * Appelle une route de l'API et renvoie le champ `data` de la réponse.
 * Lève une erreur avec le message renvoyé par l'API si la requête échoue.
 */
export async function appelerApi(url) {
  const reponse = await fetch(url);
  const corps = await reponse.json();
  if (!reponse.ok) throw new Error(corps.erreur || `Erreur ${reponse.status}`);
  return corps.data;
}

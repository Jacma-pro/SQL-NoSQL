// Panneau « SQL exécuté » : affiche, en lecture seule, la dernière requête
// jouée par l'API et ses paramètres. L'utilisateur ne peut rien y taper.
//
// React échappe automatiquement le texte affiché entre accolades : même si une
// valeur contenait du HTML, elle serait montrée telle quelle, jamais exécutée.

export default function PanneauSql({ sql }) {
  return (
    <aside className="panneau-sql">
      <h2>SQL exécuté</h2>
      {sql ? (
        <>
          <pre>{sql.texte}</pre>
          {sql.valeurs.length > 0 ? (
            <ul>
              {sql.valeurs.map((valeur, i) => (
                <li key={i}>
                  <code>${i + 1}</code> = <code>{JSON.stringify(valeur)}</code>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun paramètre.</p>
          )}
        </>
      ) : (
        <p>Aucune requête exécutée pour l'instant.</p>
      )}
    </aside>
  );
}

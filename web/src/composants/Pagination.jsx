// Boutons de pagination « ← 1 2 3 → » (page courante en bleu).
// Partagé : séjours de la réception, historique de la fiche client…
import Bouton from './Bouton.jsx';

export default function Pagination({ page, nombrePages, onChanger }) {
  if (nombrePages <= 1) return null;
  const pages = Array.from({ length: nombrePages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <Bouton
        petit
        variante="secondaire"
        disabled={page === 1}
        onClick={() => onChanger(page - 1)}
        aria-label="Page précédente"
      >
        ←
      </Bouton>
      {pages.map((n) => (
        <Bouton
          key={n}
          petit
          variante={n === page ? 'primaire' : 'secondaire'}
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onChanger(n)}
        >
          {n}
        </Bouton>
      ))}
      <Bouton
        petit
        variante="secondaire"
        disabled={page === nombrePages}
        onClick={() => onChanger(page + 1)}
        aria-label="Page suivante"
      >
        →
      </Bouton>
    </nav>
  );
}

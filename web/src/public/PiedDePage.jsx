// Pied de page du site public. Les adresses viennent de la base (table hotel).
import { decouperAdresse } from '../format.js';

export default function PiedDePage({ hotels }) {
  return (
    <footer className="pied-de-page">
      <p className="pied-de-page__marque">Parc &amp; Belledonne</p>

      {/* Desktop : sur une ligne, séparées par « | ». Mobile : une par ligne. */}
      <ul className="pied-de-page__adresses">
        {hotels.map((h) => {
          const { rue, ville } = decouperAdresse(h.adresse);
          return (
            <li key={h.id_hotel}>
              {h.nom} · {rue}{ville && `, ${ville}`}
            </li>
          );
        })}
      </ul>

      <hr className="separateur" />

      <p className="pied-de-page__mentions">
        © 2026 · Mentions légales · Confidentialité · Conditions de réservation
      </p>
    </footer>
  );
}

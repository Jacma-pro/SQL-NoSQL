// Icône décorative (fichier SVG exporté de la maquette).
// alt="" + aria-hidden : un lecteur d'écran l'ignore, le texte voisin suffit.
export default function Icone({ src, taille, className = '' }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={taille}
      height={taille}
      className={`icone ${className}`}
    />
  );
}

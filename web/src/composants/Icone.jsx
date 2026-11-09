// Icône décorative (fichier SVG exporté de la maquette).
// alt="" + aria-hidden : un lecteur d'écran l'ignore, le texte voisin suffit.
//
// teinte = true : l'icône prend la couleur du texte (CSS `color`) au lieu de
// sa couleur d'origine. Le SVG sert alors de « pochoir » (mask-image) sur un
// fond de couleur `currentColor`. Utile quand une même icône change de couleur
// (entrée de menu active / inactive, états des chambres…).
export default function Icone({ src, taille, teinte = false, className = '' }) {
  if (teinte) {
    // Guillemets obligatoires : Vite intègre les petits SVG sous forme
    // d'adresse "data:" qui contient des apostrophes, invalides dans url(…) nu.
    const pochoir = `url("${src}")`;
    return (
      <span
        aria-hidden="true"
        className={`icone icone--teinte ${className}`}
        style={{
          width: taille,
          height: taille,
          WebkitMaskImage: pochoir,
          maskImage: pochoir,
        }}
      />
    );
  }
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

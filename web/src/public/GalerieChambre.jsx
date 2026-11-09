// Galerie de la fiche chambre : grande photo + deux vues complémentaires
// (à droite sur desktop, en dessous sur mobile). Sans vues complémentaires,
// la grande photo occupe toute la largeur.
import Photo from '../composants/Photo.jsx';

export default function GalerieChambre({ principale, vues = [], alt }) {
  return (
    <div className={`galerie ${vues.length === 0 ? 'galerie--seule' : ''}`}>
      <Photo
        desktop={principale.desktop}
        mobile={principale.mobile}
        alt={alt}
        className="galerie__principale"
      />
      {vues.length > 0 && (
        <div className="galerie__vues">
          {vues.map((vue) => (
            <Photo
              key={vue.desktop}
              desktop={vue.desktop}
              mobile={vue.mobile}
              alt={vue.alt}
              className="galerie__vue"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Photo avec deux cadrages : la maquette mobile utilise parfois une image
// recadrée (héros en portrait, par exemple). Le navigateur choisit la bonne
// source selon la largeur de l'écran, grâce à <picture>.
export default function Photo({ desktop, mobile, alt, className = '' }) {
  return (
    <picture>
      {mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
      <img src={desktop} alt={alt} className={className} loading="lazy" />
    </picture>
  );
}

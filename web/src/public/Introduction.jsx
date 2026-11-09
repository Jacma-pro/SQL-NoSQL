// En-tête de section : surtitre bleu, grand titre, phrase d'accroche.
// `aside` (facultatif) s'affiche à droite, aligné en bas (ex. « À partir de 75 € / nuit »).
export default function Introduction({ surtitre, titre, texte, aside }) {
  return (
    <div className="introduction">
      <div className="introduction__titres">
        <p className="surtitre">{surtitre}</p>
        <h2 className="introduction__titre">{titre}</h2>
        <p className="introduction__texte">{texte}</p>
      </div>
      {aside && <p className="introduction__aside">{aside}</p>}
    </div>
  );
}

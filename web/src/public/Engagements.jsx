// Bandeau bleu clair des trois engagements (texte fixe de la maquette).
import Icone from '../composants/Icone.jsx';
import iconeCalendrier from '../assets/icones/calendar-check.svg';
import iconeBouclier from '../assets/icones/shield-check.svg';
import iconeCasque from '../assets/icones/headset.svg';

const ENGAGEMENTS = [
  {
    icone: iconeCalendrier,
    titre: 'Réservez en toute sérénité',
    texte: 'Annulation gratuite jusqu’à 7 jours avant l’arrivée',
  },
  {
    icone: iconeBouclier,
    titre: 'Paiement sécurisé',
    texte: 'Vos transactions et données sont protégées',
  },
  {
    icone: iconeCasque,
    titre: 'Un accueil à votre écoute',
    texte: 'Une assistance attentionnée, 7j/7',
  },
];

export default function Engagements() {
  return (
    <section className="engagements">
      {ENGAGEMENTS.map((e) => (
        <div key={e.titre} className="engagement">
          <Icone src={e.icone} taille={25} />
          <div>
            <p className="engagement__titre">{e.titre}</p>
            <p className="engagement__texte">{e.texte}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

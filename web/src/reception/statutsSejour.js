// Statuts de séjour : codes de la base (CHECK sur sejour.statut) → libellé
// affiché et couleur de badge. Utilisé par le tableau de bord et l'écran Séjours.
export const STATUTS_SEJOUR = {
  reserve: { libelle: 'Réservé', badge: 'info' },
  en_cours: { libelle: 'En cours', badge: 'info' },
  termine: { libelle: 'Terminé', badge: 'succes' },
  annule: { libelle: 'Annulé', badge: 'neutre' },
};

// Infobulle des actions qui attendent les objets SQL de la phase 3.
export const ACTION_PHASE_3 =
  'Disponible avec les procédures SQL check_in / check_out (phase 3)';

#!/bin/sh
# Crée le rôle de connexion de l'API, exécuté après 01_schema.sql et 02_seed.sql.
#
# PHASE 2 (provisoire) : hotel_api n'a que le droit de LECTURE.
# En phase 3, sql/05_roles.sql créera role_reception / role_direction /
# role_menage et ce rôle sera remplacé.
#
# Le mot de passe vient de la variable d'environnement HOTEL_API_PASSWORD
# (fichier .env) : il n'est jamais écrit dans le code.
set -e

# -v pwd=... crée une variable psql ; :'pwd' l'insère correctement échappée
# entre apostrophes. Le heredoc est entre apostrophes ('EOSQL') pour que le
# shell ne touche à rien dans le SQL.
psql -v ON_ERROR_STOP=1 -v pwd="$HOTEL_API_PASSWORD" \
     --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'EOSQL'
CREATE ROLE hotel_api LOGIN PASSWORD :'pwd';
GRANT USAGE ON SCHEMA public TO hotel_api;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO hotel_api;
EOSQL

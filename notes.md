# SQL & NoSQL

## Vocabulaire

- BD: Base de données - Un ensemble structuré de données stockées et accessibles électroniquement.
- SGBD: Système de gestion de base de données - Un logiciel qui permet de créer, gérer et manipuler des bases de données.
- BDR : Base de données relationnelle - Un type de base de données qui organise les données en tables avec des relations entre elles.
- SGBDR : Système de gestion de base de données relationnelle - Un logiciel qui gère les bases de données relationnelles.
- NoSQL : Système de gestion de base de données non relationnelle - Un type de base de données qui ne suit pas le modèle relationnel classique.
- Collecte de données : processus qui permet de définir les données à utiliser pour 'représenter' la réalité de l'environnement sous forme infomatique.
    - données élémentaires : l'adresse, le nom, le prénom, le numéro de téléphone, etc.
    - La big data : ensemble de données volumineuses et complexes qui nécessitent des outils et des techniques spécifiques pour être traitées et analysées.
    - Les données constantes : données qui ne changent pas dans le temps, comme les coordonnées géographiques d'un lieu.
- Le dictionnaire des données :
    - nom, type, taille, description, valeur par défaut, contraintes, etc.

## La conception d'une base de données

- La conception d'une BDD commence par relever les données sur lequelles on va travailler.
- Cette étape démare par une recherche avec les utilisateurs, les clients, les besoin, les documents et toute autre information nécessaire à la construction d'un ensemble de données.
- Une fois la conception établie et accordée avec les besoins du client, on passe a une étape de spécification dans laquelle on va définir les données, les relations entre elles et les contraintes.

### Le modèle Entité-Association (E-A)

- Créé par P.S Chen en 1976
- il s'agit d'un modèle graphique très simple pour représenter les données et leurs relations sur une application avant la création d'une base de données.
- Un modèle E/A a deux éléments:
    - Les entités : ce sont les objets du monde réel que l'on souhaite représenter dans la base de données. Elles sont représentées par des rectangles.
    - Les associations : ce sont les relations entre les entités. Elles sont représentées par des losanges.

#### Les entités

- Une entité est une unité d'information, il peut s'agir des personnes, d'objets, des événements, …


### Exercice
1. Réaliser un modèle E/R pour représenter les employés d'une entreprise, les départementsd dans lesquels ils travaillent et les projets auxquels ils sont affcectés.
2. Réaliser un modèle E/R pour représenter les candidats qui se présentent aux épreuves des formations de MyDigitalSchool et les notes obtenues.
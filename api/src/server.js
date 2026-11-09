// Point d'entrée de l'API Express.
import express from 'express';
import routesSante from './routes/sante.js';
import routesHotels from './routes/hotels.js';
import routesCategories from './routes/categories.js';

const app = express();
app.use(express.json());

app.use('/api/sante', routesSante);
app.use('/api/hotels', routesHotels);
app.use('/api/categories', routesCategories);

// Gestionnaire d'erreurs : Express 5 y envoie automatiquement les erreurs des
// routes async. Le détail reste dans les logs du serveur, le client ne reçoit
// qu'un message générique (on ne divulgue pas la structure de la base).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erreur: 'Erreur interne du serveur' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API à l'écoute sur le port ${port}`);
});

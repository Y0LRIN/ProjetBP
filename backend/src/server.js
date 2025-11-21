import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📝 Environnement: ${config.nodeEnv}`);
  console.log(`💾 Base de données: ${config.dataPath}`);
});

export default app;

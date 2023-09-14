const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/logements') {
    // Créer un logement
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { name, colorId } = JSON.parse(body);
        const lodging = await prisma.lodging.create({
          data: {
            name,
            colorId,
          },
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(lodging));
      } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erreur lors de la création du logement' }));
      }
    });
  } else if (req.method === 'PUT' && req.url.startsWith('/logements/')) {
    // Modifier un logement
    const logementId = req.url.split('/')[2];
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { name, colorId } = JSON.parse(body);
        const updatedLodging = await prisma.lodging.update({
          where: { id: Number(logementId) },
          data: { name, colorId },
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedLodging));
      } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erreur lors de la modification du logement' }));
      }
    });
  } else if (req.method === 'DELETE' && req.url.startsWith('/logements/')) {
    // Supprimer un logement
    const logementId = req.url.split('/')[2];
    try {
      await prisma.lodging.delete({ where: { id: Number(logementId) } });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Logement supprimé avec succès' }));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur lors de la suppression du logement' }));
    } 
} else if(req.method === 'GET' && req.url === '/logements') {
    // Obtenir tous les logements
    try {
      const lodgings = await prisma.lodging.findMany();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(lodgings));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur lors de la récupération des logements' }));
    
    }
}
else {
    console.log(req.method);
    console.log(req.url);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page non trouvée');
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
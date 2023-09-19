const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { checkJWT } = require("../middleware/authMiddleware")
const authController = require("../controllers/authControllers")

const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY;



// Créer un logement
router.post('/api/logements', async (req, res) => {
  try {
    const { name, colorId, options } = req.body;

    console.log(name)
    console.log(colorId)
    console.log(options)

    const lodging = await prisma.lodging.create({
      data: {
        name,
        colorId,
        options: {
          connect: {
           id: "tv"
          }
        }
      },
    });
    res.json(lodging);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du logement' });
  }
});

// Modifier un logement
router.put('/api/logements/:id', async (req, res) => {
  const { id } = req.params;
  const { name, colorId, options } = req.body;

  const options2 = {
    "id": "internet",
    "name": "Internet",
    "isActive": false
  }

  console.log("options belek: ")
  console.log(options)

  try {
    const updatedLodging = await prisma.lodging.update({
      where: { id: Number(id) },
      data: { 
        name: name, 
        colorId: colorId, 
        options: {
          disconnect: [{id: "tv"}, {id: "internet"}],
          connect: options
        }
      },
    });
    res.json(updatedLodging);
  } catch (error) {
    console.log("VOICI LERREUR")
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la modification du logement' });
  }
});

// Supprimer un logement
router.delete('/api/logements/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.lodging.delete({ where: { id: Number(id) } });
    res.json({ message: 'Logement supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du logement' });
  }
});

router.get('/api/logements', async (req, res) => {
  try {
    const lodgings = await prisma.lodging.findMany({
      include: {
        color: true,
        options: true,
      },
    });
    res.writeHead(200, 
      { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin" : "http://localhost:3000",
        "Access-Control-Allow-Credentials" : true,
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers" : "Origin, Content-Type, Accept"
      }
      );
    res.end(JSON.stringify(lodgings));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erreur lors de la récupération des logements' }));
  
  }
});

router.get('/api/users', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await prisma.users.findUnique({
      where: {
        email: email
      }
    });
    res.writeHead(200, 
      { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin" : "http://localhost:3000",
        "Access-Control-Allow-Credentials" : true,
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers" : "Origin, Content-Type, Accept"
      }
      );
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erreur lors de la récupération des users' }));
  
  }
});

router.get('/api/colors', async (req, res) => {
  try {
    const lodgings = await prisma.lodging.findMany({
      include: {
        color: true,
        options: true,
      },
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(lodgings));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erreur lors de la récupération des logements' }));
  
  }
});

router.get('/api/logements/filter', async (req, res) => {
  try {
    const lodgings = await prisma.lodging.findMany({
      where: {
        color: {
          name: req.query.color,
        },
      },
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(lodgings));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erreur lors de la récupération des logements' }));
  
  }
});

router.get('/', (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/index.html');
})

router.get('/login', (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/login.html');
})

router.get('/register', (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/register.html');
})

router.get('/admin', checkJWT, (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/admin.html');
})

// Route d'inscription (POST /register)
router.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Vérifier si le nom d'utilisateur existe déjà
    console.log(req)

    console.log(username)
    console.log(email)
    console.log(password)

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
    }

    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer un nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    //res.status(201).json({ message: `Inscription réussie! Bienvenue à ${newUser.username}` });
    /*
    app.get('/login', (req, res) => {
      //fs.readFile(__dirname + "/index.html")
      res.sendFile(__dirname + '/login.html');
    })
    */
    res.sendFile(__dirname + '/login.html');
    

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Route de connexion (POST /login)
router.post('/auth/login', authController.login_post);

router.get('/auth/logout', authController.logout_get)


module.exports = router

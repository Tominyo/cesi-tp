// server.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const bodyParser = require('body-parser')


const prisma = new PrismaClient();
const app = express();

app.use(express.json()); //Middlewar TOUJOURS TOUT EN HAUT

app.use(bodyParser.urlencoded()); // IMPORTANT !!  pour les requètes etc JSON()
app.use(express.static(path.join(__dirname, 'public')));


// Créer un logement
app.post('/api/logements', async (req, res) => {
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
app.put('/api/logements/:id', async (req, res) => {
  const { id } = req.params;
  const { name, colorId } = req.body;

  try {
    const updatedLodging = await prisma.lodging.update({
      where: { id: Number(id) },
      data: { name, colorId },
    });
    res.json(updatedLodging);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la modification du logement' });
  }
});

// Supprimer un logement
app.delete('/api/logements/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.lodging.delete({ where: { id: Number(id) } });
    res.json({ message: 'Logement supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du logement' });
  }
});

app.get('/api/logements', async (req, res) => {
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

app.get('/api/colors', async (req, res) => {
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

app.get('/api/logements/filter', async (req, res) => {
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

app.get('/', (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/index.html');
})

app.get('/login', (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/login.html');
})

app.get('/register', (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/register.html');
})

app.get('/admin', (req, res) => {
  //fs.readFile(__dirname + "/index.html")
  res.sendFile(__dirname + '/admin.html');
})

// Route d'inscription (POST /register)
app.post('/auth/register', async (req, res) => {
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
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const email2 = "harry.potter@mail.com"
    const password2 = "1234"
    console.log(email)
    console.log(password)
    // Rechercher l'utilisateur par nom d'utilisateur
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect (1)' });
    }

    // Comparer le mot de passe haché
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch)
    
    
    if(passwordMatch)
    {
      const token = jwt.sign({ userId: user.id }, 'votre-secret-jwt', { expiresIn: '1h' });
      res.json({ token });
      console.log("Connexion réussi.");
    }
    else
    {
      //window.alert("Nom d\'utilisateur ou mot de passe incorrect");
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect (2)' });
    }

    /*
    bcrypt.hash(password2, 10, async function(err, hash) {
      if (err) { throw (err); }
  
      const passwordMatch = bcrypt.compare(user.password, hash, function(err, result) {
          if (err) { throw (err); }
          console.log(result);

          if (!passwordMatch) {
            console.log("password = " + password2)
            console.log("passwordHash = " + user.password)
            console.log("passwordMatch = " + passwordMatch)
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect (2)' });
          }
      
          // Générer un jeton JWT pour l'authentification
          const token = jwt.sign({ userId: user.id }, 'votre-secret-jwt', { expiresIn: '1h' });
      
          res.json({ token });
      });
  });
  */

  /*
    if(password2 == user.password)
    {
      // Générer un jeton JWT pour l'authentification
      const token = jwt.sign({ userId: user.id }, 'votre-secret-jwt', { expiresIn: '1h' });

      res.json({ token });

      console.log("Connexion réussi.");
    }
  */
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});  

function retreiveColor(colorId)
{

}
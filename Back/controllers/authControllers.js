const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY;

const maxAge = 3 * 24 * 60 * 60

module.exports.login_post = async (req, res, next) => {
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
          const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

          res.header('Authorization', 'Bearer ' + token);
          res.header("Credentials",'include');
          res.header('Access-Control-Expose-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          res.header("Access-Control-Allow-Origin", "http://localhost:3000");
          res.header("Access-Control-Allow-Credentials", true);
          res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          //res.json({ token });

          res.cookie("username", user.username, {maxAge: maxAge * 1000})

          if(user.isAdmin)
          {
            let userID = {
              
            };
            
            res.cookie("jwt", token, {maxAge: maxAge * 1000})
          }

          //res.status(200).json('auth_ok');
          res.redirect("http://localhost:3000/");
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
}

module.exports.logout_post = (req, res, next) => {
    res.cookie("jwt", "", { maxAge: 1});
    res.cookie("username", "", {maxAge: 1});

    res.header("Credentials",'include');
    res.header('Access-Control-Expose-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.redirect("http://localhost:3000/");
    //next()
}


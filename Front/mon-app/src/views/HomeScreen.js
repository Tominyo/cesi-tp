import React, {useState, useEffect} from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import List from '../components/List';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from "react-router-dom";
import TableCustom from '../components/TableCustom';
import Radio from '@mui/material/Radio';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Cookies from 'js-cookie';

export default function HomeScreen(props) {

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  

    const [lodgings, setLodgings] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState("");

    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [filter, setFilter] = useState("all");

    const radioGroup = useRadioGroup(); 

    let timer;
    
    useEffect(() => {
      
     //console.log(username)
     //setUsername(Cookies.get('username'))

     if(Cookies.get('username'))
     {
      console.log("ICI C PARIS")
      console.log(getCookie("username"))
      setUsername(Cookies.get('username'));
      setIsLogin(true);
     }


     if(Cookies.get('jwt'))
     {
      console.log("JWT IS LAAAAAAAAAAAAA")
      setIsAdmin(true)
     }

    }, [])
    

    useEffect(() => {
    
    }, [filter, lodgings])
    
    
    const onRadioValueChange = (event, value) => {
      console.log(value)
      setFilter(value)
    }

    const inputHandler = (e) => {
      //convert input text to lower case
  
              var lowerCase = e.target.value.toLowerCase();
              setInputText(lowerCase);
  
              setIsLoading(true);
          
              if(timer == null)
              {
                  timer = setTimeout(() => {
                      console.log('This will run after 3 second!')
                      setIsLoading(false);
                      timer = null;
                    }, 3000);
                    return () => clearTimeout(timer);
              }
         
    };

    const logout = () => {
      let headers = new Headers();

      //headers.append('Content-Type', 'application/json');
      //headers.append('Accept', 'application/json');
      //headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
      //headers.append('Origin','http://localhost:3001');
      headers.append('Access-Control-Allow-Origin', 'http://localhost:3001');
      headers.append('Access-Control-Allow-Credentials', 'true');
      //https://api.publicapis.org/entries

      fetch(`http://localhost:3001/auth/logout`,{
          //mode: 'cors',
          credentials: 'include',
          //method: 'POST',
          //headers: headers
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
       
        }
      )
    }

    useEffect(() => {
        let headers = new Headers();

        //headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
        headers.append('Origin','http://localhost:3001');
        //headers.append('Access-Control-Allow-Origin', 'http://localhost:3001');
        //headers.append('Access-Control-Allow-Credentials', 'true');
        //https://api.publicapis.org/entries

        fetch(`http://localhost:3001/api/logements`,{
            mode: 'cors',
            credentials: 'include',
            method: 'GET',
            headers: headers
        })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result)
           setLodgings(result)
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
         
          }
        )

    }, [])
    
  return (
    <>
    <header>
    <nav class="menu">
        <a href="/"><img src="/img/logo.png" width="150" alt="Logo du site"/></a>
        <ul>
            <li><a href="#about">À Propos</a></li>
            <li><a href="#contact">Contact</a></li>
            {
              isLogin 
                ? <li><a href="http://localhost:3001/auth/logout">Se déconnecter</a></li>
                : <li><a href="#login" onClick={()=> {props.setCurrentPage("/Login")}}>Se Connecter</a></li>
            }
            
            
            {
              isAdmin && <li><a href='http://localhost:3001/admin'>admin</a></li>
            }
            
            
        </ul>
    </nav>
</header>

    <main>

        <div class="portfolio">
            <div class="container">
              <div class="row">
                <div class="col-md-8">
                  <h3 class="center-h">Les Réservations</h3>

                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', height: "70px"}}
                        >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Quel logement recherchez vous ?"
                            inputProps={{ 'aria-label': 'Quel logement recherchez vous ?' }}
                            onChange={inputHandler}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>

                    <div id='wrapper-flex'>
                        <div id='sidebar-section'>
                          <FormControl>
                              <FormLabel id="demo-radio-buttons-group-label">Filtre par couleur</FormLabel>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="all"
                                name="radio-buttons-group"
                                onChange={onRadioValueChange}
                              >
                                <FormControlLabel value="huey" control={<Radio />} label="" className='huey' />
                                <FormControlLabel value="dewey" control={<Radio />} label="" className='dewey'/>
                                <FormControlLabel value="saumon" control={<Radio />} label="" className='saumon'/>
                                <FormControlLabel value="all" control={<Radio />} label="Tous" />
                              </RadioGroup>
                            </FormControl>
                        </div>

                        <div id="main-section" className='search-bar'>        
          
                        {
                          lodgings.length > 0 
                              ? 
                                <TableCustom data={lodgings} filter={filter}/>

                              : <></>

                        }

                      </div>
                    </div>
                    
                </div>
              </div>
              
              
            </div>
          </div>


    </main>

    <footer>
      <p>LogementFacile - Tout droits réservés ©</p>
    </footer>

</>
  )
}

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

import React, {useState, useEffect} from 'react'

export default function HomeScreen() {

    const [lodgings, setLodgings] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)

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
        <a href="/"><img src="/img/logo.png" width="100" alt="Logo du site"/></a>
        <ul>
            <li><a href="#about">A Propos</a></li>
            <li><a href="#selectionOfMonth">Notre Sélection</a></li>
            <li><a href="#contact">Nous Joindre</a></li>
        </ul>
    </nav>
</header>

    <main>

        <div class="portfolio">
            <div class="container">
              <div class="row">
                <div class="col-md-8">
                  <h3 class="center-h">Les Réservations</h3>
                  {
                    lodgings.length > 0 
                        ? lodgings.map((lodging) => <li>{lodging.name}</li>)
                        : <></>

                  }
                </div>
              </div>
              
              
            </div>
          </div>


    </main>

    <footer>
      <p>LesMeilleursLogements - Tout droits réservés ©</p>
      {
        isAdmin &&
        <a href='http://localhost:3001/admin'>admin</a>
      }
    </footer>

</>
  )
}

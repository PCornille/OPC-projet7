import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './index.css';

import Header from './front/Components/Header/Header';
import Sablier from './front/Components/Sablier/Sablier';
import Profil from "./front/Components/Profil/Profil";
import  Post  from "./front/Components/Post/Post";
import Connexion from "./front/Components/Utilisateur/Connexion/Connexion";
import Inscription from "./front/Components/Utilisateur/Inscription/Inscription";

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>
          <Routes>
              <Route path="/posts" element={
                  <>
                          <Header titre="Accueil"/>
                          <Sablier/>
                          <Profil imageUrl={"./Groupomania découpé.png"}/>
                            <Post/>
                  </>
              }>
              </Route>
              <Route path="/" element={
                <>
                    <Header titre="Connexion"/>
                    <div style={{display:"flex",justifyContent:"space-evenly",margin:"40px 0 0 0"}}>
                        <Connexion/>
                        <h3>- OU -</h3>
                        <Inscription/>
                    </div>
                </>
              }>
              </Route>
          </Routes>
      </Router>
  </React.StrictMode>
);

/*
COMPOSANT HOME

STYLE

COULEURS
Primaire : #FD2D01
● Secondaire : #FFD7D7
● Tertiaire : #4E5166



appeler les commentaires commentaires et pas postrqs
 */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

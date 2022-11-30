import React from "react";

class Connexion extends React.Component {


    //userID(sessionst)
    //token cookies (react-cookies)
    constructor(props) {
        super(props);
        this.style = {
            "container": {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "370px",
                padding: "20px 15px 20px 15px",
                borderRadius: "12px",
                backgroundColor: "#0ac9da"
            },
            "champ": {
                display: "flex",
                flexDirection: "column",
                margin: "10px 0 10px 0",
            },
            "bouton": {
                borderRadius: "7px",
                backgroundColor: "#6BC079",
                color: "#FFFFFF",
                border: "none",
                height: "60px",
                fontSize: "20px",
                fontWeight: "700",
                cursor: "pointer",
                padding:"0 15px 0 15px",
                margin: "20px 0 0 0",
            },
            "action": {
                display: "flex",
                justifyContent: "center",
            },
            "erreur":{
                backgroundColor: "#FD2D01"
            }
        };
        this.state={courriel:false,mdp:false};
    }

    setValCourriel(self){
        this.setState({courriel:self.target.value});
    }

    setValMdp(self){
        this.setState({mdp:self.target.value});
    }

    valider(){
        if(this.state.courriel&&this.state.mdp){
            this.envoyer();
        }
    }

    envoyer(){
        let xhr=new XMLHttpRequest();
        let url="http://localhost:3301/api/user/login";
        xhr.open("POST",url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({email:this.state.courriel,password:this.state.mdp}));
        xhr.onerror = (e) => {
            console.error("enregistrer raté ");
            console.error(e);
        }
        xhr.onreadystatechange=()=>{
            if(xhr.readyState===4){
                if(JSON.parse(xhr.response).userId&&JSON.parse(xhr.response).token){
                    document.cookie=xhr.response;
                    window.location.replace(window.location.protocol+"//"+window.location.host+"/posts");
                }else{
                    this.setState({erreur:true});
                }
            }
        }
    }

    //couleurs de la charte
    //utiliser les states pour les var
    //regarder les useform
    render(){
        return (
            <div className={"utilisateur__connexion"} style={this.style.container}>
                    <h2>Connexion</h2>
                {this.state.erreur?<div style={this.style.erreur}>
                    <p style={{color:"#FFFFFF",textAlign:"center"}}>Connexion impossible, veuillez verifiez vos informations</p>
                </div>:false}
                    <div ref={this.user_courriel} style={this.style.champ}>
                        <label htmlFor={"user_courriel"}>Adresse eMail</label>
                        <input id="user_courriel" type={"text"} onBlur={this.setValCourriel.bind(this)}/>
                    </div>
                    <div ref={this.user_mdp} style={this.style.champ}>
                        <label htmlFor={"user_mdp"}>Mot de passe</label>
                        <input id="user_mdp" type={"text"} onBlur={this.setValMdp.bind(this)}/>
                    </div>
                    <div className={"utilisateur__inscription--action"} style={this.style.action}>
                        <input type={"button"} value={"Confirmer"} style={this.style.bouton} onClick={this.valider.bind(this)}/>
                    </div>
                </div>
        );
    }

}

export default Connexion;
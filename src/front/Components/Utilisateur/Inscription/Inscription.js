import React from "react";

class Inscription extends React.Component {

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
                backgroundColor: "#44b753"
            },
            "champ": {
                display: "flex",
                flexDirection: "column",
                margin: "10px 0 10px 0",
            },
            "bouton": {
                borderRadius: "7px",
                backgroundColor: "#0ac9da",
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
        this.state={mdp:false,
            nom:false,
            courriel:false,
            incomplet:false
        };
    }

    setValCourriel(self){
        this.setState({courriel:self.target.value});
        console.log(this.courriel);
    }

    setValMdp(self){
        this.setState({mdp:self.target.value});
        console.log(this.mdp);
    }

    setValNom(self){
        this.setState({nom:self.target.value});
        console.log(this.nom);
    }

    valider(){
        if(this.state.courriel&&this.state.mdp&&this.state.nom){
            this.enregistrer();
        }else{
            this.setState({incomplet:true});
        }
    }

    enregistrer(){
        let xhr=new XMLHttpRequest();
        let url="http://localhost:3301/api/user/register";
        xhr.open("POST",url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({email:this.state.courriel,password:this.state.mdp,nom:this.state.nom}));
        xhr.onerror = (e) => {
            console.error("enregistrer raté ");
            console.error(e);
        }
        xhr.onreadystatechange=()=>{
            if(xhr.readyState===4){
                if(JSON.parse(xhr.response).userId&&JSON.parse(xhr.response).token){
                    document.cookie=xhr.response;
                    window.location.replace(window.location.protocol+"//"+window.location.host+"/posts");
                }
            }
        }
    }

    render(){
        return (
            <div className={"utilisateur__inscription"} style={this.style.container}>
                <h2>Inscription</h2>
                {this.state.incomplet?<div style={this.style.erreur}>
                    <p style={{color:"#FFFFFF",textAlign:"center"}}>Enregistrement impossible, veuillez verifiez vos informations</p>
                </div>:false}
                <div style={this.style.champ}>
                    <label htmlFor={"user_courriel"}>Adresse eMail</label>
                    <input id="user_courriel" type={"text"} onBlur={this.setValCourriel.bind(this)}/>
                </div>
                <div style={this.style.champ}>
                    <label htmlFor={"user_mdp"}>Mot de passe</label>
                    <input id="user_mdp" type={"text"} onBlur={this.setValMdp.bind(this)}/>
                </div>
                <div style={this.style.champ}>
                    <label htmlFor={"user_nom"}>Nom d'usage</label>
                    <input id="user_nom" type={"text"} onBlur={this.setValNom.bind(this)}/>
                </div>
                <div className={"utilisateur__inscription--action"} style={this.style.action}>
                    <input type={"button"} value={"Confirmer"} style={this.style.bouton} onClick={this.valider.bind(this)}/>
                </div>
            </div>
        );
    }

}

export default Inscription;
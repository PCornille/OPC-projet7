import React from "react";
import ContainerUnit from "../Post/PostContainer/ContainerUnit";

class Commentaire extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            comm:false,
        }
        this.style={
            flex:{
                display:"flex",
                justifyContent:"space-between",
            },
            comm:{
                backgroundColor: "#FFD7D7",
                margin:"10px 0 10px 0",
                padding:"15px",
                borderRadius:"22px"
            },
            nom:{
                fontWeight:"600"
            },
            contenu:{
                width: "40%"
            },
            suppr:{
                display:"flex",
                justifyContent:"space-between",
                position:"absolute"
            },
            edit_bouton:{
                border: "1px solid",
                padding: "12px",
                backgroundColor: "rgb(253, 45, 1)",
                fontSize: "14px",
                color: "rgb(255, 255, 255)",
                cursor: "pointer",
            }
        }
    }

    componentDidMount() {
        if(this.props.comm.auteurId!==undefined&&this.props.comm.auteurId!==0)
            this.auteur();
        this.setState({comm:this.props.comm});
    }

    remComm(){
        console.log(this.state.comm)
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/post/remComm/?id="+this.state.comm._id;
        xhr.open("DELETE", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("remComm raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if(xhr.response){
                    console.log(xhr.response)
                    this.props.update(this.state.comm);
                }
            }
        }
    }

    auteur(){
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/user/findOne?id="+this.props.comm.auteurId;
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("fetchAuteur raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log("rep xhr", xhr.response);
                this.setState({auteur:JSON.parse(xhr.response).user});
            }
        }
    }

    render(){
        return (
            <div style={this.style.comm}>
                <div style={this.style.flex}>
                    <p style={this.style.nom} className={"post__container--unit--auteur"}>{(this.state.auteur!=0?this.state.auteur:"Anonyme")}</p>
                    <div>
                    <p className={"post__container--unit--date"}>{this.props.timestamp(this.state.comm.timestamp)}</p>
                    {(this.state.comm.auteurId==JSON.parse(document.cookie).userId)||(JSON.parse(document.cookie).admin)?<div style={this.style.suppr}>
                            <input style={this.style.edit_bouton} type={"button"} value={"Supprimer"} onClick={this.remComm.bind(this)}/>
                        </div>:
                        false}</div>
                </div>
                <p style={this.style.contenu}>{this.state.comm.contenu}</p>
            </div>
        );
    }
}

export default Commentaire;

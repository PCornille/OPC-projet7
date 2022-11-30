import React from "react";

class Nouveau extends React.Component {

    constructor(props) {
        super(props);
        this.style={
            corps:{
                resize:"none",
                height:"250px",
                width:"100%",
                fontSize:"18px"
            },
            checkbox:{
                display:"flex",
                flexDirection:"column",
                width:"200px"
            },
            post:{
                margin:"25px 0 0 0",
                display:"flex",
                flexDirection: "column",
            },
            post_top:{
                display:"flex",
                justifyContent: "space-between"
            },
            fermer:{
                height:"35px",
                width:"35px",
                backgroundColor:"rgb(253, 45, 1)",
                cursor:"pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "15px 20px 15px 20px"
            },
            nouveau:{
                border: "1px solid",
                padding: "12px",
                backgroundColor: "rgb(253, 45, 1)",
                fontSize: "16px",
                color: "rgb(255, 255, 255)",
                cursor: "pointer",
                margin:"15px"
            },
            titre:{
                height:"35px",
                margin:"15px 0 15px 0",
                fontSize:"22px"
            }
        };
        this.state={
            id:true,
            titre:false,
            corps:false,
            image:false,
            nom:"",
            status:false
        };
    }
    file=undefined;


    componentDidMount() {
        this.auteur();
    }

    identite(){
        this.setState({id:!this.state.id});
    }

    titre(self){
        this.setState({titre:self.target.value});
    }

    corps(self){
        this.setState({corps:self.target.value});
    }

    image(self){
        this.file=self.target.files[0];
        this.setState({image:self.target.value});
    }

    valider(){
        if(this.state.titre&&this.state.corps){
            if(this.state.titre!==""&&this.state.corps!==""){
                this.publier();
            }
        }
    }

    auteur(){
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/user/findOne?id="+JSON.parse(document.cookie).userId;
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("fetchAuteur raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.setState({nom:JSON.parse(xhr.response).user});
            }
        }
    }

    publier(){
        let xhr=new XMLHttpRequest();
        let url="http://localhost:3301/api/post/newPost";
        xhr.open("POST",url);
        xhr.setRequestHeader('Authorization', 'Bearer '+JSON.parse(document.cookie).token);
        let data=new FormData();
        data.append("titre",this.state.titre);
        data.append("contenu",this.state.corps);
        data.append("auteurId",this.state.id?JSON.parse(document.cookie).userId:0);
        data.append("image",this.file);
        xhr.send(data);
        xhr.onerror = (e) => {
            console.error("publier raté ");
            console.error(e);
        }
        xhr.onreadystatechange=()=>{
            if(xhr.readyState===4){
                this.props.update();
                this.setState({status:false})
            }
        }
    }

    render(){
        return(
            <div style={{width:"80%",textAlign:"center"}}>
            {!(this.state.status)?
            <input type={"button"} style={this.style.nouveau} value={"Nouvelle Publication"} onClick={()=>{this.setState({status:true})}}/>
                :
            <div className={"post__nouveau"} style={this.style.post}>
                <div className={"post__nouveau__top"} style={this.style.post_top}>
                    <fieldset className={"post__nouveau__checkbox"} style={this.style.checkbox}>
                        <legend>
                            Identité de publication
                        </legend>
                        <select onChange={this.identite.bind(this)}>
                            <option>{this.state.nom}</option>
                            <option>Anonyme</option>
                        </select>
                    </fieldset>
                    <div className={"post__nouveau--fermer"} style={this.style.fermer} onClick={()=>{this.setState({status:false})}}>
                        <span style={{margin:"auto",color:"#FFFFFF"}}>X</span>
                    </div>
                </div>
                <input type={"text"} style={this.style.titre} placeholder={"Titre"} onBlur={this.titre.bind(this)}/>
                <textarea placeholder={"Corps de votre publication"} style={this.style.corps} onBlur={this.corps.bind(this)}/>
                <div className={"post__nouveau__action"}>
                    <input className={"post__nouveau__action--publier"} style={this.style.nouveau} type={"button"} value={"Publier"} onClick={this.valider.bind(this)}/>
                    <input className={"post__nouveau__action--image"} type="file" accept="image/*" onChange={this.image.bind(this)}/>
                </div>
            </div>
            }
            </div>
        );
    }
}

export default Nouveau;
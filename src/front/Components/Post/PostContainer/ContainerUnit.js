import React from "react";
import Commentaire from '../../Comm/Commentaire';

class ContainerUnit extends React.Component {

    constructor(props) {
        super(props);
        this.style = {
            flex:{
              display:"flex",
            },
            flexCol:{
                display:"flex",
                flexDirection:"column"
            },
            flex_sp:{
                display:"flex",
                justifyContent:"space-around"
                },
            container: {
                display: "flex",
                flexDirection: "column",
                border:"1px solid black",
                width:"68vw",
                margin: "25px auto 25px auto",
                padding:"20px",
                boxShadow: "0 10px 10px rgba(0, 0, 0, 0.15)"
            },
            element: {
                display: "flex",
                flexDirection: "column"
            },
            corps: {
                margin:"15px 0 30px 0"
            },
            image:{
                maxHeight:"300px",
                maxWidth:"470px",
                margin:"0 25px 25px 0",
                objectFit:"contain",
                cursor:"pointer"
            },
            date:{
            },
            options:{
              display:"flex",
                flexDirection:"column"
            },
            bouton:{
                border: "1px solid",
                padding: "12px 0",
                backgroundColor: "#FD2D01",
                fontSize: "14px",
                fonWeight: "500",
                color: "#fff",
                width: "30%",
                cursor:"pointer",
                margin:"15px 0 15px 0"
            },
            bouton_sp:{
                border: "1px solid",
                padding: "12px 0",
                backgroundColor: "#FD2D01",
                fontSize: "16px",
                fonWeight: "500",
                color: "#fff",
                cursor:"pointer",
                margin:"0 0 15px 0"
            },
            edit_cont:{
                display:"flex",
                position:"relative",
            },
            edit_bouton:{
                border: "1px solid",
                padding: "12px",
                backgroundColor: "rgb(253, 45, 1)",
                fontSize: "14px",
                color: "rgb(255, 255, 255)",
                cursor: "pointer",
                margin: "15px 15px 15px 0",
            },like_cont:{
                display:"flex"
            },
            like:{
                height:"35px",
                width:"35px",
                backgroundColor:"rgb(253, 45, 1)",
                cursor:"pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "15px",
                color:"#FFFFFF",
                fontSize:"26px"
            },dislike:{
                height:"35px",
                width:"35px",
                backgroundColor:"#4E5166",
                cursor:"pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "15px",
                color:"#FFFFFF",
                fontSize:"26px"
            }
        };
        this.state={
            post:false,
            auteur:false,
            comms:[],
            textArea:false,
            nComm:0,
            update:false,
            light:false,
            mod:false
            }
    }
    _image=false;
    file=undefined;
    score=undefined;
    _supprImage=false;

    timestamp(timestamp) {
        let now = new Date();
        let dateTimeObject = new Date(parseInt(timestamp));
        let diff = Math.abs(now.getTime() - parseInt(timestamp));
        if (isNaN(diff))
            return "";
        if (true) {
            let hours = '' + dateTimeObject.getHours();
            let minutes = '' + dateTimeObject.getMinutes();
            if (hours.length < 2)
                hours = '0' + hours;
            if (minutes.length < 2)
                minutes = '0' + minutes;
            if (now.getDate() === dateTimeObject.getDate())
                return " Aujourd'hui à " + hours + ":" + minutes;
            if (now.getDate() - 1 === dateTimeObject.getDate())
                return "Hier à " + hours + ":" + minutes;
        }
        return dateTimeObject.toLocaleDateString();
    }

    componentDidMount() {
        this.setState({post:this.props.post},()=>{
            this.compteComm();
            if(this.props.post.auteurId!==0) {
                this.auteur(this.props.post.auteurId);
            }
            else{
                this.setState({auteur:"Anonymous"});
            }
            this.score=this.state.post.score.length;
            console.log(this.state.post)
            let cont=this.state.post.score;
            let arr=Array.from(cont);
            if(arr?arr.includes(JSON.parse(document.cookie).userId):false){
                this.setState({light:true});
            }
        });
    }

    auteur(){
        if(this.state.auteurId===undefined){
            this.setState({auteur:"Anonyme"});
        }
        if(this.props.post.auteurId===0){
            return;
        }
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/user/findOne?id="+this.props.post.auteurId;
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("fetchAuteur raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.setState({auteur:JSON.parse(xhr.response).user});
            }
        }
    }

    click(self){
        this._image=!(this._image);
        if(this._image) {
            self.target.style.maxHeight = "";
            self.target.style.maxWidth = "";
        }else{
            self.target.style.maxHeight = "300px";
            self.target.style.maxWidth = "470px";
        }
    }

    comm(s){
        if(this.state.textArea&&s){
            this.state.comms=0;
            this.setState({textArea:false});
            return;
        }
        this.setState({ textArea : true })
        console.log(this.state.comms)
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/post/findAllComm?id="+this.props.post._id;
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("fetchAuteur raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.setState({comms:JSON.parse(xhr.response)});
            }
        }
    }

    update(commentaire){
        console.log(this.state.comms)
        let i=this.state.comms.findIndex((item)=>
            item._id===commentaire._id);
        console.log("fn update",commentaire);
        this.state.comms.splice(i,1);
        this.compteComm();
        this.setState({comms:this.state.comms});
    }

    remPost(){
        console.log(this.state.post._id)
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/post/remPost/"+this.state.post._id;
        xhr.open("DELETE", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("remPost raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if(xhr.response){
                    this.props.update(this.props.post);
                    this.props.compte();
                }
            }
        }
    }

    modPost(self){
        this.setState({mod:true});
    }

    titre(self){
        let _post=this.state.post;
        _post.titre=self.target.value;
        this.setState({post:_post});
    }

    corps(self){
        let _post=this.state.post;
        _post.contenu=self.target.value;
        this.setState({post:_post});
    }

    image(self){
        this.file=self.target.files[0];
        if(this._supprImage){
            this._supprImage=false;
        }
    }

    supprImage(){
        this._supprImage=true;
        let _post=this.state.post;
        _post.imageUrl=undefined;
    }

    sendModPost(){
        let xhr=new XMLHttpRequest();
        let url="http://localhost:3301/api/post/modPost";
        xhr.open("POST",url);
        xhr.setRequestHeader('Authorization', 'Bearer '+JSON.parse(document.cookie).token);
        let data=new FormData();
        data.append("titre",this.state.post.titre);
        data.append("contenu",this.state.post.contenu);
        data.append("id",this.state.post._id);
        data.append("image",this.file);
        if(this._supprImage===true)
            data.append("supprImage",true)
        xhr.send(data);
        xhr.onerror = (e) => {
            console.error(e);
        }
        xhr.onreadystatechange=()=>{
            if(xhr.readyState===4){
                this.setState({post:JSON.parse(JSON.parse(xhr.response).object)});
                this.setState({mod:false});
            }
        }
    }

    compteComm(){
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/post/compteComm?id="+this.state.post._id;
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("compteComm raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.setState({nComm:JSON.parse(xhr.response).c});
            }
        }
    }

    modScore(self){
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/post/modScore";
        xhr.open("POST", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({id:this.state.post._id}));
        xhr.onerror = (e) => {
            console.error("sendComm raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if(xhr.response){
                    let i=this.state.post.score.findIndex((index)=>
                            index===JSON.parse(document.cookie).userId)
                    let up_score=this.state.post.score;
                    console.log(i)
                    if(i!==-1){
                        up_score.splice(i,1);
                    }else{
                        up_score.push(JSON.parse(document.cookie).userId);
                    }
                    let up_state=this.state.post;
                    up_state.score=up_score;
                    this.setState({post:up_state});
                    this.setState({light:!(this.state.light)});
                    this.score=this.state.post.score.length;
                    self.target.previousElementSibling.value="";
                }
            }
        }
    }

    sendComm(self){
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/post/addComm";
        xhr.open("POST", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({auteurId:JSON.parse(document.cookie).userId,postId:this.state.post._id,contenu:self.target.parentNode.querySelector("textarea").value}));
        xhr.onerror = (e) => {
            console.error("sendComm raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if(xhr.response){
                    this.comm(false);
                    this.compteComm();
                    self.target.previousElementSibling.value="";
                }
            }
        }
    }

    render(){
        return (
            <div className={"post__container--corps"} style={this.style.container}>
                <div className={"post__container--unit element"} style={this.style.element}>
                    <div style={this.style.flex_sp}>
                        <p className={"post__container--unit--auteur"} style={{fontSize:"22px"}}>{(this.state.post.auteurId!=0?this.state.auteur:"Anonyme")}</p>
                        <p className={"post__container--unit--date"} style={this.style.date}>{this.timestamp(this.state.post.timestamp)}</p>
                    </div>
                    <div style={this.style.options}>
                    <div style={this.style.like_cont}>
                        {(this.state.light?<div style={this.style.flex}> <div style={this.style.like}>
                                {this.score}
                            </div>
                                <div style={this.style.like} onClick={this.modScore.bind(this)}>
                                    -
                                </div></div>:
                            <div style={this.style.flex}><div style={this.style.dislike}>
                                {this.score}
                            </div>
                                <div style={this.style.dislike} onClick={this.modScore.bind(this)}>
                                    +
                                </div></div>)}
                    </div>
                    {(this.state.post.auteurId==JSON.parse(document.cookie).userId)||(JSON.parse(document.cookie).admin)?<div style={this.style.edit_cont}>
                            <input style={this.style.edit_bouton} type={"button"} value={"Supprimer"} onClick={this.remPost.bind(this)}/>
                            <input style={this.style.edit_bouton} type={"button"} value={"Modifier"} onClick={this.modPost.bind(this)}/>
                        </div>:
                        false}
                    </div>
                    {!(this.state.mod)?
                        <h3 className={"post__container--unit--titre"}>{this.state.post.titre}</h3> :
                        <div>
                            <input type={"text"} style={{width:"30%",margin:"0 0 10px 0"}} placeholder={"nouveau titre"} onBlur={this.titre.bind(this)}/>
                            <input className={"post__nouveau__action--image"} type="file" accept="image/*" onChange={this.image.bind(this)}/>
                            {(this.state.post.imageUrl!==undefined)?
                            <input type={"button"} value={"supprimer l'image"} onClick={this.supprImage.bind(this)}/>:
                                false}
                        </div>
                            }
                    <div style={this.style.flexCol}>
                        {(this.state.post.imageUrl!=undefined)&&
                            <img src={this.state.post.imageUrl} className={"post__container--unit--image"} onClick={this.click.bind(this)} style ={this.style.image} alt={"image accompagnant la publication"}></img>
                        }
                        {!(this.state.mod)?
                        <p className={"post__container--unit--contenu"} style={this.style.corps}>{this.state.post.contenu}</p>:
                            <div style={{width:"80%"}}>
                            <textarea spellCheck="false" style={{width:"100%",height:"60px"}} placeholder={"modifier le contenu"} onBlur={this.corps.bind(this)}/>
                                <input type={"button"} style={this.style.edit_bouton} value={"Enregistrer"} onClick={this.sendModPost.bind(this)}/>
                            </div>
                        }
                    </div>
                    <input type={"button"} style={this.style.bouton_sp} value={!this.state.textArea?
                        "Participer" +"( "+this.state.nComm+" Commentaires )":"Réduire les commentaires"} onClick={this.comm.bind(this)}/>
                    {this.state.textArea?
                        <div style={{borderTop:"1px solid black",padding:"15px 0 0 0"}}>
                            <textarea spellCheck="false" style={{width:"100%",height:"60px"}} placeholder={"Commenter cette publication"}></textarea>
                            <input type={"button"} style={this.style.bouton} onClick={this.sendComm.bind(this)} value={"Publier"}/>
                        </div>:false
                    }
                    {this.state.comms!==0?
                        <div >
                            {this.state.comms.map((_comm)=>{
                            return <Commentaire update={this.update.bind(this)} key={_comm._id} comm={_comm} timestamp={this.timestamp}/>
                        })
                            }
                        </div>:false
                    }
                </div>
            </div>
        )
    }
}

export default ContainerUnit;
import React from "react";

class Profil extends React.Component {

    constructor(props) {
        super(props);
        this.style={
            general:{
              backgroundColor:"#FFD7D7",
                position:"absolute",
                padding:"0 20px 10px 20px",
                top:"0",
                display:"flex",
                flexDirection:"column",
                borderRadius:"0 0 15px 0",
                border:"1px solid rgba(253, 45, 1, 0.13)"
            },
            logout:{
                textDecoration:"none"
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
                margin:"15px 0 15px 0",
            }
        }
        this.state={
            nom:false,
            imageUrl:false
        }
    }
    file=undefined;

    componentDidMount() {
        this.getUserInfos();
    }

    image(self){
            this.file=self.target.files[0];
            this.setState({image:self.target.value});
    }

    sendImage(){
        let data=new FormData();
        data.append("image",this.file);
        let xhr=new XMLHttpRequest();
        let url = "http://localhost:3301/api/user/addPhoto";
        xhr.open("POST", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send(data);
        xhr.onerror = (e) => {
            console.error("sendPhoto raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.forceUpdate();
            }
        }
    }

    getUserInfos(){
        let xhr=new XMLHttpRequest();
        let url = "http://localhost:3301/api/user/findOne?id="+JSON.parse(document.cookie).userId;
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("getUserInfos raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.setState({nom:JSON.parse(xhr.response).user});
                if(JSON.parse(xhr.response).imageUrl) {
                    this.state.imageUrl = JSON.parse(xhr.response).imageUrl;
                }
            }
        }
    }

    render(){
        return (
            <div className={"profil"} style={this.style.general}>
                <p>{this.state.nom}</p>
                <a href="/" style={this.style.logout}>Logout</a>
            </div>
        );
    }
}

export default Profil;
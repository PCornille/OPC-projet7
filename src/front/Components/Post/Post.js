import React from "react";
import Nouveau from "./Nouveau/Nouveau";
import PostContainer from "./PostContainer/PostContainer";

class Post extends React.Component {

    constructor(props) {
        super(props);
        this.style={
            flex:{
                display:"flex",
                justifyContent:"center",
                width:"100vw"
            }
        };
        this.state={
            posts:[],
            switch:false
        }
    }

    componentDidMount() {
        this.hydrate();
    }

    hydrate() {
        let xhr = new XMLHttpRequest();
        let url = "http://localhost:3301/api/post/all";
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("findAll raté ");
            console.error(e);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.setState({posts: JSON.parse(xhr.response),switch:!(this.state.switch)});
            }
        }
    }

    update(){
        this.hydrate();
    }


    render(){
        return (<div>
            <div style={this.style.flex}>
                <Nouveau update={this.update.bind(this)}/>
            </div>
            <div style={this.style.flex}>
                {this.state.posts.length!==0?
                <PostContainer update={this.update.bind(this)} posts={this.state.posts}/>
                    :console.log(this.state)}
            </div>
        </div>)
    }
}

export default Post;
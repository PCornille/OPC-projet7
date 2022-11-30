import React from "react";
import ContainerUnit from "./ContainerUnit";

class PostContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state={
                compte:false,
                posts:[]
            }
    }

    componentDidMount() {
        this.comptePosts();
    }

    comptePosts(){
        let xhr=new XMLHttpRequest();
        let url="http://localhost:3301/api/post/comptePost";
        xhr.open("GET",url);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer '+JSON.parse(document.cookie).token);
        xhr.send();
        xhr.onerror = (e) => {
            console.error("comptePost raté ");
            console.error(e);
        }
        xhr.onreadystatechange=()=>{
            if(xhr.readyState===4){
                this.setState({compte:JSON.parse(xhr.response).c});
            }
        }
    }

    update(post){
        let i=this.state.posts.findIndex((item)=>
            item._id===post._id)
        let t=this.state.posts;
        console.log("voici t ",t)
        t.splice(i,1)
        this.props.update();
    }

    render(){
        const posts=this.props.posts;
        return (
           <div className={"post__container"} style={{backgroundColor:"#FFF"}}>
               <h2 style={{textAlign:"center"}}><span className={"post__container--total"} >{this.state.compte}</span> publications</h2>
               {(posts!==false)?posts.map((_post)=>{
                  return <ContainerUnit update={this.update.bind(this)} compte={this.comptePosts.bind(this)} key={_post._id} post={_post}/>
               }):false}
           </div>
        );
    }
}

export default PostContainer;
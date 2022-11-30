import logo from './Groupomania découpé.png';
import React from "react";

class Header extends React.Component {


    constructor(props) {
        super(props);
        this.style={
            header:{
                display:"flex",
                justifyContent: "center",
            },
            image: {
                height: "100px",
                margin:"90px 0 0 0",
                padding:"0 100px 0 0 "
            },

        }
    }


    componentDidMount() {
        this.props.titre==="Connexion"?
            document.title="Groupomania - Connexion":
            document.title="Groupomania - Publications";
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged(){
        //
    }

    render() {
        return (
            <nav className={"header"} style={this.style.header}>
                <div>
                    <img src={logo} alt={"logo groupomania"} style={this.style.image}/>
                </div>
            </nav>
        );
    }
}//

export default Header;
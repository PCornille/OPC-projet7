import React from "react";

class Sablier extends React.Component{

    constructor(props){
        super(props);
        this.state={date:new Date()};
        this.interval=null;
        this.style={
            sablier:{
                position:"absolute",
                top:"10px",
                right:"40px"
            }
        }
    }


    componentDidMount() {
        this.interval=window.setInterval(this.top.bind(this),1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    top(){
        this.setState({date:new Date()});
    }

    render(){
        return (
            <div className={"sablier"} style={this.style.sablier}>
                <span>{this.state.date.toLocaleString()}</span>
            </div>
        );
    }
}

export default Sablier;
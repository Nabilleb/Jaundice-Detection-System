import React from "react";
import "./styles/home.css"
function Card(props){
    return(
        <div className="card">
            <div className="header">
            {props.icon}
              <h3 className="cardh">{props.text}</h3>
            </div>
            <div className="content">
                <p>{props.content}</p>
            </div>
             </div>
    )
}

export default Card
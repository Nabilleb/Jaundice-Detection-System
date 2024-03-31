import React from "react";

function Input(props){
    return(
        <div className="input">
        <label htmlFor={props.name}>{props.label}</label>
        <input type="text" className="inpts"  placeholder={props.placeholder} name={props.name} required/>
      </div>
    )
}
export default Input
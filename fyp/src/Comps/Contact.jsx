import React from "react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import "./styles/contact.css"
function Contact(){
    return(
       <div className="contact">
         <div className="subcontact">
                <h3>Reach our Teams</h3>
                <div className="round">
                    <h5 ><WhatsAppIcon /> +961 3815688</h5>
                </div>
                <div className="round">
                    <h5><EmailIcon /> system@gmail.com</h5>
                </div>
         </div>
       </div>
    )
}

export default Contact
import React from 'react';
import './../css/Music.css';
import './../css/Base.css';
import MeshObject from '../gl/Mesh'

const Music = () =>{
    // var audioState = false;

    // function waitForElementToDisplay(selector, time) {
    // if(document.querySelector(selector)!=null) {
    //         // alert("activo");
    //         return;
       
    // }
    // else {
    //     setTimeout(function() {
    //         waitForElementToDisplay(selector, time);
    //     }, time);
    // }
    // }

    // waitForElementToDisplay("#temita",5000);

        return (  
            <div> 
            <MeshObject/>
            <audio
                id="temita" 
                preload="auto"
                // controls
                src={require("./../../sounds/temita.mp3")}
                loop={true}
                autoPlay={false}
                muted
            />
            </div> 
        );
    
};

export default Music;
import React from 'react';
import './../css/Loader.css'
import './../css/Base.css'
import gif from "../../images/loader.gif";
function ShowDetail() {
  return (
    <div className="base-container center"><img width="100" height="100" src={gif}></img></div>
  );
}

export default ShowDetail;

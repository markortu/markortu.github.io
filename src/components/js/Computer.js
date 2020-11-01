import React from "react"
import './../css/Computer.css'
import soundcloud from "../../images/sc.png";
import instagram from "../../images/ig.png";
import txt from "../../images/txt.png";


function aboutMe(){

}
var d = new Date();
const Computer = () => {
    return (
        <div id="pc"><div className="fillspace skin_background" id="s42_background">
            <div className="os_container">
                <div className="os_desk os_desk--workspace os_desk--local" id="os_desk_0">
                    <a href="https://soundcloud.com/cleincheekz" target="_blank">
                        <div id="soundcloud" className="os_icon os_icon__file os_icon_link" style={{ position: "fixed", left: "0px", top: "0px", zIndex: "0" }}>
                            <img width="50" height="50" src={soundcloud} alt="Soundcloud" />
                            <span>Soundcloud</span>
                        </div>
                    </a>
                    <a href="https://www.instagram.com/markortu" target="_blank">
                        <div id="instagram" className="os_icon os_icon__file os_icon_link" style={{ position: "fixed", left: "0px", top: "100px", zIndex: "0" }}>
                            <img width="50" height="50" src={instagram} alt="Instagram" />
                            <span>Instagram</span>
                        </div>
                    </a>
                    <div onClick={aboutMe} id="aboutme" className="os_icon os_icon__file os_icon_link" style={{ position: "fixed", left: "100px", top: "200px", zIndex: "0" }}>
                        <img width="50" height="50" src={txt} alt="Instagram" />
                        <span>about me.txt</span>
                    </div>
                </div>
                <div className="pa0 fixed pc_footer">
                    <div className="os_combo_one skin_base skin_outset_deep" id="taskbar">
                        <button type="button" id="s42_start" className="os_start"><i width="16" heigth="16" className="glyphicon glyphicon-home" /><span><b>Start</b></span></button>
                        <div id="s42_dock" className="os_combo_one__main os_window_dock"></div>
                        <div id="s42_notif" className="skin_inset">
                            <i className="glyphicon glyphicon-eye-open" />
                            <span id="s42_clock">{d.getHours() + ":" + d.getMinutes()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
};

export default Computer;
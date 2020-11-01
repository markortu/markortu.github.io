import React from 'react'
// import {
//     NavLink
//     } from "react-router-dom"
import './../css/Menu.css';
import $ from 'jquery';
var audioState = false;
import {HashRouter, Link} from "react-router-dom"
$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#scrollBack').fadeIn();
    } else {
        $('#scrollBack').fadeOut();
    }
});

function scrollBack() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

$(document).ready(function () {
    var href = window.location.pathname;
    if (href === "/music") {
        console.log(href);
        $('#back2home').css({ 'display': 'inline' });
    }
    else {
        $('#homeBack').css({ "display": "inline" });
    }
});


function toggleButton() {
    var audioToggle = document.getElementById("audioToggle");
    if (audioState) {
        mutePage();
        audioToggle.classList.add("glyphicon-play");
        audioToggle.classList.remove("glyphicon-pause");

    }
    else {
        unmutePage();
        audioToggle.classList.add("glyphicon-pause");
        audioToggle.classList.remove("glyphicon-play");
    }
}
function mutePage() {
    document.querySelectorAll("video, audio").forEach(elem => muteMe(elem));
    audioState = false;
}
function muteMe(elem) {
    elem.muted = true;
    elem.pause();
}

function unmutePage() {
    document.querySelectorAll("video, audio").forEach(elem => unmuteMe(elem));
    audioState = true;
}
function unmuteMe(elem) {
    elem.muted = false;
    elem.play();
}

function button() {
    $('#navBar').toggleClass('open');
    if($('#hamburgerBtn').hasClass('glyphicon-menu-hamburger')){
        $('#hamburgerBtn').removeClass('glyphicon-menu-hamburger');
        $('#hamburgerBtn').addClass('glyphicon-remove');  

    } else {
        $('#hamburgerBtn').removeClass('glyphicon-remove');
        $('#hamburgerBtn').addClass('glyphicon-menu-hamburger');
    }
}
function close() {
    $('#navBar').removeClass('open');
    $('#hamburgerBtn').removeClass('glyphicon-remove');
    $('#hamburgerBtn').addClass('glyphicon-menu-hamburger');
}

const Menu = () => {

    return (
        <HashRouter basename={process.env.PUBLIC_URL}>
        <div>
            <i onClick={button} id="hamburgerBtn" className="glyphicon glyphicon-menu-hamburger"></i>
            <a onClick={scrollBack} id="back2top">
                <i id="scrollBack" className="glyphicon glyphicon-chevron-up navbar-icon"></i>
            </a>
            <nav id="navBar">
                <div className="nav-brand">
                    <p>Clein <strong>Cheekz</strong></p>
                </div>
                <ul className="nav-items">
                    <li><Link to={process.env.PUBLIC_URL + '/'} onClick={close}>Home</Link></li>
                    <li><Link to={process.env.PUBLIC_URL + '/music'} onClick={close}>Music</Link></li>
                    <li><Link to={process.env.PUBLIC_URL + '/about'} onClick={close}>About</Link></li>
                </ul>
                <div className="nav-footer">
                    <p>@<strong>markortu</strong></p>
                </div>
            </nav>
        </div>
        </HashRouter>
    )
};

export default Menu;

{/* <div className="mr-auto p-2">
                    <a href="/#" id="back2home" className="navbar-text" style={{position: "absolute"}}>
                        <i id="homeBack" className="glyphicon glyphicon-chevron-left navbar2-icon"></i>
                    </a>
                    <a onClick={scrollBack} id="back2top" className="navbar-text" href="#">
                        <i id="scrollBack" className="glyphicon glyphicon-chevron-up navbar-icon"></i>
                    </a>
                </div> */}
{/* <div className="mr-auto p-2">
                    <a onClick={scrollBack} id="back2top" className="navbar-text" href="#">
                        <i id="scrollBack" className="glyphicon glyphicon-chevron-up navbar-icon"></i>
                    </a>
                </div> */}

{/* <div className="p-2">
                    <a onClick={toggleButton} className="navbar-text"><i id="audioToggle" className="glyphicon glyphicon-play volume-icon"></i></a>
                   
                </div> */}
{/* <div className="p-2">
                    <NavLink exact activeClassName="active-class" className="navbar-text" to="/about">
                        About
                    </NavLink>
                </div>
                <div className="p-2">
                    <NavLink exact activeClassName="active-class" className="navbar-text" to="/music">
                        Music
                    </NavLink>
                </div> */}
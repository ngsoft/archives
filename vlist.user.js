// ==UserScript==
// @name         Vlist player
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  autoplay
// @author       daedelus
// @include     *://vlist.*/v/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/vlist.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/vlist.user.js
// ==/UserScript==

$(document).ready(function() {
    $('iframe').remove();
    $('#vb_adplayer').empty();
    $('#vb_adplayer').hide();
    jwplayer().play();
});
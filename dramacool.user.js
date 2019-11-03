// ==UserScript==
// @name         Dramacool (UI Remaster + Videouploader)
// @namespace    https://github.com/ngsoft
// @version      7.1
// @description  dramacool.video
// @author       daedelus
// @include     *://*dramacool*.*/*
// @include     *://*watchasian*.*/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
// ==/UserScript==

((doc, undef) => {


    let jdtitle = "";

    doc.querySelectorAll('.watch-drama .category a').forEach((x) => {
        jdtitle = x.innerText;
    });
    
    if (jdtitle.length > 0) {
        if (/episode\-([0-9]+)/.test(location.pathname)) {
            let ep = /episode\-([0-9]+)/.exec(location.pathname)[1];
            ep = parseInt(ep);
            if (ep < 10) ep = "0" + ep;
            jdtitle += ".E";
            jdtitle += ep;
        }
        jdtitle += ".mp4";


        doc.querySelectorAll('.anime_muti_link li[data-video]').forEach((x) => {
            try {
                let url = new URL(x.dataset.video);
                url.searchParams.set('jdtitle', jdtitle);
                x.dataset.video = url.href;
            } catch (e) {
                console.error(e);
            }
        });
    }
    






})(document);
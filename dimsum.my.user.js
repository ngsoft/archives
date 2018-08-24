// ==UserScript==
// @name         dimsum.my
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  Subtitle downloader (add button to subtitle selection)
// @author       daedelus
// @include     *://*.dimsum.my/*
// @include     *://dimsum.my/*
// @run-at      document-idle
// @grant none
// @noframes
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// ==/UserScript==


function getProxyUrl(href){
    let matches, title, lng;
    if((matches = window.playerModule._title.match(/^E([0-9]+) (.*?)$/i)) !== null){
        title = matches[2].replace(/[\|&;\$%@"\'’<>\(\)\ \+,]/g, ".");
        title += '.1x' + matches[1];
        if((lng = href.match(/\_([A-Z]+).srt$/i))!== null){
            lng = lng[1];
            title+='.'+lng;
        }
        title+='.srt';
        let url = new URL('http://daedelus.uk.to');
        url.searchParams.set('from', href);
        url.pathname = '/proxy/' + title;
        return url.href;
    }
}


$(document).ready(function() {
    $(document).on('click', '.audio_subtitle_selector #playerModule__selector_toggle', function() {
        $('#playerModule__subtitles .playerModule__subtitle-tracks:not([data-id="0"])').each(function() {
            if ($(this).find('a').length > 0) {
                return;
            }
            let link = $('<a download href="" target="_blank" style="vertical-align:middle; float:right;padding:0 6px;cursor:pointer;margin-top:-40px;display:inline-block;transform:translate(-16px,50%);" class="sub-link">⏬</a>');
            $(this).after(link);
            for (let i = 0; i < window.playerModule.subtitles.length; i++) {
                let sub = window.playerModule.subtitles[i];
                if (sub.id + "" == this.dataset.id) {
                    let href = sub.src;
                    /*if (!(href = getProxyUrl(sub.src))) {
                        href = sub.src;
                    }*/
                    link.attr('href', href);
                }
            }
        });

    });

});




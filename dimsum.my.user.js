// ==UserScript==
// @name         dimsum.my
// @namespace    https://github.com/ngsoft
// @version      1.0.0
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

$(document).ready(function() {
    $(document).on('click', '.audio_subtitle_selector #playerModule__selector_toggle', function() {
        $('#playerModule__subtitles .playerModule__subtitle-tracks:not([data-id="0"])').each(function() {
            if ($(this).find('a').length > 0) {
                return;
            }
            let link = $('<a href="" target="_blank" style="vertical-align:middle; float:right;padding:0 6px;cursor:pointer;margin-top:-40px;display:inline-block;transform:translate(-16px,50%);" class="sub-link">⏬</a>');
            $(this).after(link);
            for (let i = 0; i < window.playerModule.subtitles.length; i++) {
                let sub = window.playerModule.subtitles[i];
                if (sub.id + "" == this.dataset.id) {
                    link.attr('href', sub.src);
                }
            }
        });

    });

});




// ==UserScript==
// @name         dimsum.my
// @namespace    https://github.com/ngsoft
// @version      2.0.1
// @description  Subtitle downloader (add button to subtitle selection)
// @author       daedelus
// @include     *://www.dimsum.my/*
// @include     *://dimsum.my/*
// @run-at      document-idle
// @grant none
// @noframes
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// ==/UserScript==


function getProxyUrl(href, lang) {
    let matches, title, lng;
    if((matches = window.playerModule._title.match(/^E([0-9]+) (.*?)$/i)) !== null){
        title = matches[2].replace(/[\|&;\$%@"\'’<>\(\)\ \+,]/g, ".");
        title += '.1x' + matches[1];
        if ((lng = href.match(/\_([A-Z\-]+).srt$/i)) !== null) {
            lng = lng[1].toLowerCase();
            title+='.'+lng;
        }
        title+='.srt';
        /*let url = new URL('http://daedelus.uk.to');
        url.searchParams.set('from', href);
        url.pathname = '/proxy/' + title;*/
        let url = new URL('http://127.0.0.1:8091');
        url.searchParams.set('from', href);
        url.pathname = '/assets/srt/' + title;


        return url.href;
    }
}


$(document).ready(function() {

    let useproxy = localStorage.useproxy;


    $(document).on('click', '.audio_subtitle_selector #playerModule__selector_toggle', function() {
        $('#playerModule__subtitles .playerModule__subtitle-tracks:not([data-id="0"])').each(function() {
            if ($(this).find('a').length > 0) {
                return;
            }
            let link = $('<a download href="" target="_blank" style="vertical-align:middle; float:right;padding:0 6px;cursor:pointer;margin-top:-40px;display:inline-block;transform:translate(-16px,50%);" class="sub-link"><img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAArklEQVR4AXWRJVgEURRGD+7eJ+FOhjYZh4r13nDtGV1v67tp+zcNb9OxSsPG9fGf5/ekdwEkVH7xk6ER7CyiMO3jkE8itNvCKkX8WeeZVyr0AMAKZfyZIUWSD+bCwpSGnQKrYeFMw06ZlbBwoPGvUEsNOxo11IoFmRwXGjlksdDEHt8aezSKBYAtDUAk9DGqMaCh7fSFhRx3HnK2YH+1KEVWxc2yUVgEUbttVCT4A+GLTZ5S0nQvAAAAAElFTkSuQmCC" style="filter:invert(100%);"/></a>');
            $(this).after(link);
            for (let i = 0; i < window.playerModule.subtitles.length; i++) {
                let sub = window.playerModule.subtitles[i];
                if (sub.id + "" == this.dataset.id) {
                    let href = sub.src;
                    link.attr('data-original', href);
                    if (useproxy === "true") {
                        href = getProxyUrl(sub.src);
                    }
                    link.attr('href', href);
                    link.on('change', function() {
                        if (useproxy === "true") {
                            this.href = getProxyUrl(this.dataset.original);
                        } else {
                            this.href = this.dataset.original;
                        }
                    });

                }
            }
        });
        $('#playerModule__subtitles > div.title').each(function() {
            if ($(this).find(":input").length > 0) {
                return;
            }
            let input = $('<input type="checkbox" title="&lt; Use Proxy &gt;" style="float:right;vertical-align:middle;transform:translate(-24px,0);" />');
            $(this).append(input);
            input = $(input).get(0);
            input.checked = useproxy === "true";
            $(input).on('change', function() {
                localStorage.useproxy = JSON.stringify(this.checked);
                useproxy = localStorage.useproxy;
                $('a.sub-link').trigger('change');
            });
        });

    });

});




// ==UserScript==
// @name         dimsum.my
// @namespace    https://github.com/ngsoft
// @version      3.0
// @description  Subtitle downloader (add button to subtitle selection)
// @author       daedelus
// @include     *://www.dimsum.my/*
// @include     *://dimsum.my/*
// @run-at      document-idle
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require     https://greasyfork.org/scripts/34527/code/GMCommonAPI.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// ==/UserScript==


function downloadString(text, fileName, server, convert) {
    if (convert === true) {
        let form = $(`<form method="post" class="hidden" target="dlsubs" action=""><textarea name="data"></textarea><input type="submit" /></form>`);
        form.attr('action', server.replace(/%filename%/, fileName));
        form.find('textarea').text(text);
        $('body').append(form);
        form.submit().remove();
        return;
    }

    let blob = new Blob([text], {type: 'octet/stream'});
    let link = document.createElement('a');
    let href = URL.createObjectURL(blob);
    link.download = fileName;
    link.href = href;
    link.style.opacity = 0;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(x => URL.revokeObjectURL(href), 2000);

}

function getBaseFileName(playerModule) {
    let matches, title;
    if ((matches = playerModule._title.match(/E([0-9]+) (.*?)$/i)) !== null) {
        title = matches[2].replace(/[\|&;\$%@"\'’<>\(\)\ \+,]/g, ".");
        title += '.E' + matches[1];
    }
    return title;

}

class UserSettings {
    constructor(defaults) {
        if (typeof defaults === 'object') {
            Object.keys(defaults).forEach(function(k) {
                if (typeof GMC.getValue(k) !== typeof defaults[k]) {
                    this.set(k, defaults[k]);
                }
            }, this);
        }
    }
    get(key) {
        return GMC.getValue(key);
    }
    set(key, val) {
        GMC.setValue(key, val);
        return this;
    }
}


$(document).ready(function() {

    let defaults = {
        server: 'http://127.0.0.1:8091/assets/srt/convert/%filename%',
        converter: false
    }, settings = new UserSettings(defaults);

    $('body').append(`<iframe id="dlsubs" name="dlsubs" style="display: none;"></iframe>`);



    $(document).on('click', '.audio_subtitle_selector #playerModule__selector_toggle', function() {
        $('#playerModule__subtitles .playerModule__subtitle-tracks:not([data-id="0"])').each(function() {
            if ($(this).find('a').length > 0) {
                return;
            }
            let link = $('<a download href="" target="_blank" style="vertical-align:middle; float:right;padding:0 6px;cursor:pointer;margin-top:-40px;display:inline-block;transform:translate(-16px,50%);" class="sub-link"><img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAArklEQVR4AXWRJVgEURRGD+7eJ+FOhjYZh4r13nDtGV1v67tp+zcNb9OxSsPG9fGf5/ekdwEkVH7xk6ER7CyiMO3jkE8itNvCKkX8WeeZVyr0AMAKZfyZIUWSD+bCwpSGnQKrYeFMw06ZlbBwoPGvUEsNOxo11IoFmRwXGjlksdDEHt8aezSKBYAtDUAk9DGqMaCh7fSFhRx3HnK2YH+1KEVWxc2yUVgEUbttVCT4A+GLTZ5S0nQvAAAAAElFTkSuQmCC" style="filter:invert(100%);"/></a>');
            $(this).after(link);
            for (let i = 0; i < playerModule.subtitles.length; i++) {

                let sub = playerModule.subtitles[i];
                if (sub.id + "" == this.dataset.id) {
                    let href = sub.src;
                    link.attr('href', sub.src);

                    link.on('click', function(e) {
                        e.preventDefault();
                        let filename = getBaseFileName(playerModule), lng;
                        if ((lng = this.href.match(/\_([A-Z\-]+).srt$/i)) !== null) {
                            lng = lng[1].toLowerCase();
                            filename += '.' + lng;
                        }
                        filename += '.srt';

                        GMC.xmlHttpRequest({
                            method: 'GET',
                            url: this.href,
                            onload(xhr) {
                                let txt = xhr.responseText;
                                if (txt.length) {
                                    downloadString(txt, filename, settings.get('server'), settings.get('converter'));
                                }
                            }
                        });
                        return false;
                    });
                }
            }
        });
        $('#playerModule__subtitles > div.title').each(function() {
            if ($(this).find(":input").length > 0) {
                return;
            }
            let input = $('<input type="checkbox" title="&lt; Use Converter &gt;" style="float:right;vertical-align:middle;transform:translate(-24px,0);" />');
            $(this).append(input);
            input = $(input).get(0);
            input.checked = settings.get('converter') === true;
            $(input).on('change', function() {
                settings.set('converter', this.checked);
                return false;
            });
        });

    });

});




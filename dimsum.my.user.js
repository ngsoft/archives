// ==UserScript==
// @name         dimsum.my
// @namespace    https://github.com/ngsoft
// @version      4.0
// @description  Subtitle downloader
// @author       daedelus
// @include     /^https?://(www.)?dimsum.my//
// @run-at      document-end
// @noframes
// @grant       GM_xmlhttpRequest
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// ==/UserScript==


(function(doc, undef) {

    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;

    function html2element(html) {
        if (typeof html === "string") {
            let template = doc.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
    }

    function addcss(css) {
        if (typeof css === "string" && css.length > 0) {
            let s = doc.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.body.appendChild(s);
        }
    }

    let styles = `
        .download-button
        {text-decoration: none;width:32px;height:31px;line-height:0;vertical-align: middle;display: inline-block;float: right;margin: -35px 8px 3px -8px;padding: 4px;}
        .download-button > * {width:100%;height:100%;}
        .download-button{color: #fff!important;border-radius: 3px;border: 1px solid rgba(0,0,0,0);}
        .download-button:hover{border-color: #ec1c24; background: #ec1c24;}
        .download-button + [data-id="0"]{margin-left:54px!important;}
    `;

    addcss(styles);

    function downloadButton(subtrack) {
        if (this === undef || this === window) {
            return;
        }
        let self = this;
        if (!(subtrack instanceof Element) || !subtrack.matches('[data-id]')) {
            throw new Error();
        }

        function getBaseFileName(playerModule) {
            let type = playerModule.engageData.type, baseTitle = playerModule.engageData.title;
            let matches, title, season, episode;
            switch (type) {
                case "movie":
                    title = baseTitle.replace(/[\|&;\$%@"\'’<>\(\)\+,]/g, ".");
                    break;
                case "episode":
                    if ((matches = playerModule._title.match(/E([0-9]+) (.*?)$/i)) !== null) {
                        title = matches[2].replace(/[\|&;\$%@"\'’<>\(\)\+,]/g, ".") + ".";
                        season = parseInt(playerModule.gtmData.seasonNumber);
                        episode = parseInt(matches[1]);
                        if (season > 1) {
                            if (season < 10) {
                                season = "0" + season;
                            }
                            title += "S" + season;
                        }
                        if (episode < 10) {
                            episode = "0" + episode;
                        }
                        title += "E" + episode;
                    }
                    break;
            }
            return title;
        }

        let template = {
            button: `<a title="" href="#" class="download-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M452 432c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm-84-20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm144-48v104c0 24.3-19.7 44-44 44H44c-24.3 0-44-19.7-44-44V364c0-24.3 19.7-44 44-44h99.4L87 263.6c-25.2-25.2-7.3-68.3 28.3-68.3H168V40c0-22.1 17.9-40 40-40h96c22.1 0 40 17.9 40 40v155.3h52.7c35.6 0 53.4 43.1 28.3 68.3L368.6 320H468c24.3 0 44 19.7 44 44zm-261.7 17.7c3.1 3.1 8.2 3.1 11.3 0L402.3 241c5-5 1.5-13.7-5.7-13.7H312V40c0-4.4-3.6-8-8-8h-96c-4.4 0-8 3.6-8 8v187.3h-84.7c-7.1 0-10.7 8.6-5.7 13.7l140.7 140.7zM480 364c0-6.6-5.4-12-12-12H336.6l-52.3 52.3c-15.6 15.6-41 15.6-56.6 0L175.4 352H44c-6.6 0-12 5.4-12 12v104c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12V364z"></path></svg><a>`
        };

        this.metadatas = {
            lang: "",
            src: "",
            title: "",
            displaylang: subtrack.innerText.trim()
        };

        this.click = function(e) {
            e.preventDefault();
            self.download(this.href, this.download);
            return false;
        };

        this.download = function(src, filename) {
            if (typeof src === "string" && typeof filename === "string" && src.length > 0 && filename.length > 0) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: src,
                    onload(xhr) {
                        let txt = xhr.responseText;
                        if (txt.length) {
                            let blob = new Blob([txt], {type: 'octet/stream'});
                            let link = doc.createElement('a');
                            let href = URL.createObjectURL(blob);
                            link.download = filename;
                            link.href = href;
                            link.style.opacity = 0;
                            doc.body.appendChild(link);
                            link.click();
                            doc.body.removeChild(link);
                            setTimeout(x => URL.revokeObjectURL(href), 2000);
                        }
                    }
                });
            }
        };

        if (typeof playerModule !== "undefined" && Array.isArray(playerModule.subtitles)) {
            let lang = "", src = "", title = "";
            let id = parseInt(subtrack.dataset.id);
            playerModule.subtitles.forEach(function(sub) {
                if (sub.id === id) {
                    src = sub.src;
                    lang = sub.srclang;
                }
            });
            if (src.length > 0 && lang.length > 0) {
                this.metadatas.lang = lang;
                this.metadatas.src = src;
                if ((title = getBaseFileName(playerModule))) {
                    title += "." + lang + ".srt";
                    this.metadatas.title = title;
                }
            }
        }
        if (this.metadatas.title.length > 0) {
            this.button = html2element(template.button);
            this.button.title = 'Download ' + this.metadatas.displaylang + ' Subtitle';
            this.button.download = this.metadatas.title;
            this.button.href = this.metadatas.src;
            subtrack.parentNode.insertBefore(this.button, subtrack.nextSibling);
            this.button.addEventListener('click', this.click)
        }
        return this;
    }

    doc.addEventListener('click', function(e) {
        if (e.target.matches('.audio_subtitle_selector #playerModule__selector_toggle')) {
            if (doc.querySelector('#playerModule__subtitles .download-button') !== null) {
                return;
            }
            doc.querySelectorAll('#playerModule__subtitles .playerModule__subtitle-tracks:not([data-id="0"])').forEach(function(el) {
                new downloadButton(el);
            });
        }
    });

})(document);
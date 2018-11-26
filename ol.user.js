// ==UserScript==
// @name         Openload + StreamMango + RapidVideo + UpToBox + YourUpload
// @author       daedelus
// @namespace    https://github.com/ngsoft
// @version      3.2.1
// @description  Helps to download streams (videojs based sites)
// @include     *://openload.co/embed/*
// @include     *://oload.fun/embed/*
// @include     *://streamango.*/embed/*
// @include     *://*rapidvideo.com/e/*
// @include     *://*mp4upload.com/embed*
// @include     *://*uptostream.com/iframe/*
// @include     *://*yourupload.com/embed/*
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at      document-start
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// ==/UserScript==


(function(doc, undef) {
    /* jshint expr: true */
    /* jshint -W018 */

    window.adblock = false;
    window.adblock2 = false;
    window.sadbl = false;
    window.turnoff = true;
    window.open = function() {};

    document.addEventListener = (function(old) {
        return function(type, listener, capture) {
            if (type !== 'contextmenu')
                old(type, listener, !!capture);
        };
    })(document.addEventListener);


    const addstyle = this.addstyle = function(css) {
        return !css ? null : function() {
            let s = document.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
            document.body.appendChild(s);
        }();
    };

    const html2element = function(html) {
        if (typeof html === "string") {
            let template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
        return null;
    };

    const onDocStart = function(fn, binding) {
        let w = function() {
            if (document.body !== null) {
                !w.i || clearInterval(w.i);
                fn();
                return true;
            }
            return false;
        };
        w() || (w.i = setInterval(w, 20));
    };

    const onDocEnd = function(fn, binding) {
        if (binding)
            fn.bind(binding);
        onDocStart(function() {
            if (document.readyState !== 'loading') {
                return fn();
            }
            document.addEventListener('DOMContentLoaded', fn);
        });
    };

    function trigger(type, el) {
        type += "";
        if (!(el instanceof EventTarget)) {
            return;
        }
        if (type.length === 0) {
            return;
        }
        el.dispatchEvent(new Event(type, {bubbles: true, cancelable: true}));
    }

    const copyToClipboard = function(text = "") {
        let clip = html2element(`<textarea>${text}</textarea>"`);
        document.body.appendChild(clip);
        clip.style.opacity = 0;
        clip.select();
        let retval = document.execCommand("copy");
        document.body.removeChild(clip);
        return retval;
    };

    function getIcon() {
        let result = '/favicon.ico';
        if (document.querySelector('[rel*="icon"]') instanceof Element) {
            result = document.querySelector('[rel*="icon"]').href;
        }
        return result;
    }



    onDocStart(function() {
        getIcon();

        addstyle(`
            div.dlvideo{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #000; padding: 1em 0;}
            div.dlvideo span{position:absolute; right:0; top:1rem; width: auto;}
            div.dlvideo .clipboard{position:absolute; left:0; top:1rem; width: auto;cursor:pointer;}
            div.dlvideo span a, div.dlvideo span a:before, .dl-icon{position: relative;display: inline-block;vertical-align: middle;}
            div.dlvideo span a{white-space: nowrap;overflow: hidden;text-indent: -99999px;}
            div.dlvideo > a, div.dlvideo > span, div.dlvideo .clipboard{padding: 0 2rem;cursor:pointer;}
            [class*="-icon"]{-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;display:inline-block;vertical-align: middle;font-style: normal!important;vertical-align: middle;display: inline-block;width: 1rem;height: 1rem;}
            [class*="-icon"] svg{width:87.5%;height:100%;}


            .hidden, #videooverlay, .videologo, .jw-dock , #overlay, .hidden *{position: fixed; top:-100%;right: -100%; height:1px; width:1px; opacity: 0;}

            /* color theme */
            [class*="-icon"]{width: 1.25rem;height: 1.25rem;}
            div.dlvideo{color: #FFF; background-color: rgba(0,0,0,.4);}
            div.dlvideo a{color: #FFF; text-decoration: none;}
            div.dlvideo span a:before{background-image: url('${getIcon()}');width: 100%;height: 100%;}
            div.dlvideo span a {width: 1.25rem;height: 1.25rem;}
            div.dlvideo:hover a, div.dlvideo:hover span, div.dlvideo:hover > i{filter: drop-shadow(.25rem .25rem .5rem #000);}
            /* animations */
            @keyframes flash {0% { opacity: 1; } 50% { opacity: .1; } 100% { opacity: 1; }}
            .flash{animation: flash linear .25s infinite;-webkit-animation: flash linear .25s infinite;}
        `);
        if (document.location.origin.match(/mango/i) !== null) {
            addstyle(`
                /* color theme */
                div.dlvideo, div.dlvideo:hover{color: rgba(116, 44, 161,1); background-color: rgba(253, 250, 250,1);}
                div.dlvideo a{color: rgba(116, 44, 161,1); text-decoration: none;}
                div.dlvideo:hover span a{filter: none;}

            `);
        }
        if (document.location.origin.match(/openload|oload/i) !== null) {
            addstyle(`
                /* color theme */
                div.dlvideo:hover, .video-js:hover button.vjs-big-play-button{background-color: rgba(0,170,255,.9);}
                div.dlvideo:hover span a{filter: invert(100%);}
            `);
        }
    });

    function createToolbar(target, video) {
        if (!(target instanceof Element)) {
            return undefined;
        }

        let toolbar = {
            root: html2element(`<div class="dlvideo-toolbar">&nbsp;</div>`),
            newtab: html2element(`<a href="" target="_blank" title="Open in a new tab" class="newtab-btn"><span class="fav-icon"></span></a>`),
            download: html2element(`<a href="" target="_blank" title="Download Video" class="dl-btn"><span class="dl-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M230.9 64c8.8 0 16 7.2 16 16v144h93.9c7.1 0 10.7 8.6 5.7 13.6L203.3 381.2c-6.3 6.3-16.4 6.3-22.7 0l-143-143.6c-5-5-1.5-13.6 5.7-13.6h93.9V80c0-8.8 7.2-16 16-16h77.7m0-32h-77.7c-26.5 0-48 21.5-48 48v112H43.3c-35.5 0-53.5 43-28.3 68.2l143 143.6c18.8 18.8 49.2 18.8 68 0l143.1-143.5c25.1-25.1 7.3-68.2-28.3-68.2h-61.9V80c0-26.5-21.6-48-48-48zM384 468v-8c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v8c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12z"></path></svg></span>VIDEO LINK</a>`),
            clipboard: html2element(`<a href="" class="clipboard-btn"><span class="clipboard-icon" title="Copy to Clipboard"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 193.941l-51.882-51.882A48 48 0 0 0 348.118 128H320V80c0-26.51-21.49-48-48-48h-61.414C201.582 13.098 182.294 0 160 0s-41.582 13.098-50.586 32H48C21.49 32 0 53.49 0 80v288c0 26.51 21.49 48 48 48h80v48c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V227.882a48 48 0 0 0-14.059-33.941zm-84.066-16.184l48.368 48.368a6 6 0 0 1 1.757 4.243V240h-64v-64h9.632a6 6 0 0 1 4.243 1.757zM160 38c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18zm-32 138v192H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h55.414c9.004 18.902 28.292 32 50.586 32s41.582-13.098 50.586-32H266a6 6 0 0 1 6 6v42h-96c-26.51 0-48 21.49-48 48zm266 288H182a6 6 0 0 1-6-6V182a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v170a6 6 0 0 1-6 6z"></path></svg></span></a>`)
        };

        target.appendChild(toolbar.root);
        toolbar.root.appendChild(toolbar.clipboard);
        toolbar.root.appendChild(toolbar.download);
        toolbar.root.appendChild(toolbar.newtab);

        toolbar.download.href = video.src;

        toolbar.root.newtab.addEventListener('click', function() {
            this.href = document.location.href;
            return false;
        });

        toolbar.download.addEventListener("click", function() {
            this.href = video.src;
            return false;
        });
        toolbar.clipboard.addEventListener("click", function() {
            if (copyToClipboard(toolbar.download.href)) {
                toolbar.clipboard.classList.add('flash');
                setTimeout(function() {
                    toolbar.clipboard.classList.remove('flash');
                }, 1500);

            }
            return false;
        });
        video.addEventListener("play", function() {
            toolbar.root.classList.add('hidden');
        });
        video.addEventListener("pause", function() {
            toolbar.root.classList.remove('hidden');
        });
        return toolbar;
    }

    onDocEnd(function() {
        window.BetterJsPop = {
            checkEventTrusted() {
                return true;
            },
            checkStack() {
                return true;
            }
        };
        window.doPopAds = null;
        window.doSecondPop = null;
        window.secondsdl = 0;
        window.popAdsLoaded = true;
        window.noPopunder = true;

        let worker = setInterval(function() {
            //if (typeof jQuery !== undefined) {
                if (document.querySelectorAll('video').length > 0) {
                    clearInterval(worker);

                //jQuery('body').off('mouseup');
                    let vjs;
                    document.querySelectorAll('video').forEach(function(video) {

                        let id;
                        if ((id = video.parentNode.id)) {
                            try {
                                if (videojs && videojs(id)) {
                                    vjs = videojs(id);
                                    /** Disable VAST **/
                                    if (typeof vjs.vast !== "undefined") {
                                        if (typeof vasturl !== "undefined") {
                                            vasturl = null;
                                        }
                                        vjs.vast.disable();
                                    }
                                }
                            } catch (e) {
                                return;
                            }
                        }
                        if (video.src && video.src.length > 0) {
                            createToolbar(document.body, video);
                        } else {
                            video.addEventListener("loadeddata", function() {
                                if (this.src) {
                                    createToolbar(document.body, this);
                                }
                            });
                        }

                    });

                    if (document.querySelector('#videooverlay') instanceof Element) {
                        /*document.querySelector('#videooverlay').addEventListener('click', function() {
                            vjs.load();
                        });*/

                        trigger("click", document.querySelector('#videooverlay'));
                    }
                    if (document.querySelector('#home_video') instanceof Element) {
                        document.querySelector('#home_video').oncontextmenu = x => false;
                    }


                }
            //}
        }, 20);

        /**
         * Auto Quality selector only available for rapidvideo
         */
        if (location.host.match(/rapidvideo/i) !== null) {
            let quality = {}, best;
            document.querySelectorAll('#home_video > div[style*="23px"]').forEach(function(x) {
                x.querySelectorAll('a[href*="q="]').forEach(function(y) {
                    best = y;
                    quality[y.innerText] = y;
                    y.addEventListener('click', function() {
                        localStorage.lastquality = this.innerText;
                    });
                });
            });


            if (document.location.href.match(/q=/) === null) {
                let last;
                if (last = localStorage.lastquality) {
                    if (quality[last]) {
                        document.location.replace(quality[last].href);
                    }
                    return;
                }
                document.location.replace(best.href);

            }else{
                executed = true;
            }

        }
    });



})(document);
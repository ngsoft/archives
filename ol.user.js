// ==UserScript==
// @name         Openload Embed
// @author       daedelus
// @namespace    https://github.com/ngsoft
// @version      3.0
// @description  Openload
// @include     *://openload.co/embed/*
// @include     *://oload.fun/embed/*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// ==/UserScript==


(function() {
    /* jshint expr: true */
    /* jshint -W018 */

    window.adblock = false;
    window.adblock2 = false;
    window.sadbl = false;
    window.turnoff = true;
    window.open = function() {};


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

    onDocStart(function() {
        document.onbeforescriptexecute = function(e) {
            if (e.target.src.search('script.packed') != -1)
                e.preventDefault();
        };
        addstyle(`
            div.dlvideo{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #000; padding: 1em 0;}
            div.dlvideo span{position:absolute; right:0; top:1rem; width: auto;}
            div.dlvideo .clipboard{position:absolute; left:0; top:1rem; width: auto;cursor:pointer;}
            div.dlvideo span a, div.dlvideo span a:before, .dl-icon{position: relative;display: inline-block;vertical-align: middle;}
            div.dlvideo span a{white-space: nowrap;overflow: hidden;text-indent: -99999px;}
            div.dlvideo span a:before, .dl-icon{-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;}
            div.dlvideo span a:before{content:"";text-indent: 99999px;position: absolute;top:0;left: 0;}
            div.dlvideo > a, div.dlvideo > span, div.dlvideo .clipboard{padding: 0 2rem;cursor:pointer;}
            .unicon{font-family: "Segoe UI Symbol";font-style: normal;}
            .hidden, #dlframe, .hidden *{position: fixed; top:-100%;right: -100%; height:1px; width:1px; opacity: 0;}

            /* color theme */
            div.dlvideo{color: #FFF; background-color: rgba(0,0,0,.4);}
            div.dlvideo:hover, .video-js:hover button.vjs-big-play-button{background-color: rgba(0,170,255,.9);}
            div.dlvideo a{color: #FFF; text-decoration: none;}
            div.dlvideo span a:before{background-image: url('/favicon.ico');width: 100%;height: 100%;}
            div.dlvideo .dl-icon{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAArklEQVR4AXWRJVgEURRGD+7eJ+FOhjYZh4r13nDtGV1v67tp+zcNb9OxSsPG9fGf5/ekdwEkVH7xk6ER7CyiMO3jkE8itNvCKkX8WeeZVyr0AMAKZfyZIUWSD+bCwpSGnQKrYeFMw06ZlbBwoPGvUEsNOxo11IoFmRwXGjlksdDEHt8aezSKBYAtDUAk9DGqMaCh7fSFhRx3HnK2YH+1KEVWxc2yUVgEUbttVCT4A+GLTZ5S0nQvAAAAAElFTkSuQmCC');}
            div.dlvideo span a {width: 1.25rem;height: 1.25rem;}
            div.dlvideo .dl-icon{width: 1rem;height: 1rem;margin: -.25rem .5rem 0 .5rem;}
            div.dlvideo:hover span a, div.dlvideo .dl-icon{filter: invert(100%);}
            /* animations */
            @keyframes flash {0% { opacity: 1; } 50% { opacity: .1; } 100% { opacity: 1; }}
            .flash{animation: flash linear .25s infinite;-webkit-animation: flash linear .25s infinite;}
        `);
    });

    function createToolbar(target, video) {
        if (!(target instanceof Element)) {
            return undefined;
        }

        let toolbar = {
            root: html2element(`<div class="dlvideo"><span><a href="" target="_blank" title="Open in a new tab">&infin;</a></span></div>`),
            link: html2element(`<a href="" target="_blank" title="Download Video"><i class="unicon dl-icon"></i>VIDEO LINK</a>`),
            clip: html2element(`<i class="unicon clipboard" title="Copy to Clipboard">&#128203;</i>`)
        };
        target.appendChild(toolbar.root);
        toolbar.root.appendChild(toolbar.clip);
        toolbar.root.appendChild(toolbar.link);

        toolbar.link.href = video.src;

        toolbar.root.querySelector('span a').addEventListener('click', function() {
            this.href = document.location.href;
            return false;
        });

        toolbar.link.addEventListener("click", function() {
            this.href = video.src;
            return false;
        });
        toolbar.clip.addEventListener("click", function() {
            if (copyToClipboard(toolbar.link.href)) {
                toolbar.clip.classList.add('flash');
                setTimeout(function() {
                    toolbar.clip.classList.remove('flash');
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
            if (typeof jQuery !== undefined) {
                if (document.querySelectorAll('video').length > 0) {
                    clearInterval(worker);

                    jQuery('body').off('mouseup');
                    if (videojs && videojs("olvideo").vast) {
                        vasturl = null;
                        videojs("olvideo").vast.disable();
                    }

                    document.querySelectorAll('video').forEach(function(video) {
                        video.addEventListener("loadeddata", function() {
                            if (this.src) {
                                createToolbar(document.body, this);
                            }
                        });
                    });

                    trigger("click", document.querySelector('#videooverlay'));
                }
            }
        }, 20);
    });



})();
// ==UserScript==
// @name         SHOUPA and ESYY HLS Downloader
// @namespace    https://github.com/ngsoft
// @version      1.1.1
// @description  FIX Stream for firefox Quantum + command to download stream
// @author       daedelus
// @include     *.shoupa.com/v/*
// @include     *://esyy007.com/*?m=vod-play*src*num*
// @run-at      document-body
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/shoupa.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/shoupa.user.js
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require     https://cdn.jsdelivr.net/npm/hls.js@latest
// @require     https://cdn.jsdelivr.net/npm/clipboard@latest
// @require     https://greasyfork.org/scripts/34527/code/GMCommonAPI.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function(doc, $, undef) {

    function dirname(src) {
        return src.substring(0, src.lastIndexOf('/') + 1);
    }

    function onReady(fn) {
        if (doc.readyState != 'loading') {
            fn()
        } else {
            doc.addEventListener('DOMContentLoaded', fn);
        }
    }

    function addCSS(css) {
        let s = document.createElement('style');
        s.setAttribute('type', "text/css");
        s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
        onReady(function() {
            doc.body.appendChild(s);
        });
    }

    function playM3u8(url, video, debug = false) {
        let hls = new Hls({debug: debug});
        video.classList.add("native_mode");
        video.classList.remove("zoomed_mode");
        video.controls = "controls";
        video.dataset.original = url;
        $(video).after(`<div class="video-message hidden">Please disable "mixed active content" protection on this page using <span class="unicon">&#128274;</span> icon to play the video.</div>`);
        hls.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    $(video).addClass('hidden').next().removeClass('hidden');
                }
            }
        });
        let m3u8Url = decodeURIComponent(url);
        hls.loadSource(m3u8Url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });

    }

    function getSteamURL(src = "", callback) {
        if (typeof callback !== 'function' || src.length === 0) {
            return;
        }
        GMC.xmlHttpRequest({
            method: 'GET',
            url: src,
            onload(xhr) {
                let m3u8 = xhr.response.replace(/\n([^#].*)/g, `\n${dirname(src)}$1`);
                let regex = /#EXT-X-STREAM-INF.*\n([^#].*)/, matches;
                if ((matches = regex.exec(m3u8)) !== null) {
                    callback(matches[1].trim());
                }
            }
        });
    }

    function generateClip(infos, video) {

        let title = infos.show + '.';
        if (infos.number.length) {
            title += "E" + infos.number + ".";
        }
        title += infos.provider + ".mp4";
        let cmd = `ffmpeg -protocol_whitelist "file,http,https,tcp,tls" -y -i "${infos.url}" -c copy "${title}"`;

        let clip = $(`<span class="clip"><code>${cmd}</code></span>`);

        $(video).parent().append(clip);
        let clipboard = new ClipboardJS('.clip', {
            text: function(trigger) {
                return clip.children().text();
            }
        });
        clipboard.on('success', function(e) {
            let msg = $(`<div class="video-message">Copied to Clipboard...</div>`);
            $(video).after(msg);
            setTimeout(function() {
                msg.remove();
            }, 1000);

            e.clearSelection();
        });

    }
    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    addCSS(`
        video.native_mode{width:100%;height: ${ isChrome ? '95' : '100'}%;}
        button.dl-video{margin-left: 1rem;margin-top: 13px;}
        div.video-message, span.clip{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 999; padding: 1em 0;}
        button.dl-btn{position: absolute; bottom:10rem;right:4rem;}
        span.clip{top: 50%; transform: translate(0,-50%); padding: 2rem;margin: 2rem;}
        span.clip code{white-space:normal; text-align: left; display:block;}
        /* color theme */
        .unicon{font-family: "Segoe UI Symbol";}
        div.video-message, span.clip, button.dl-btn, button.dl-btn:hover{color: #FFF; background-color: rgba(0,0,0,.4);}
        button.dl-btn{border: 1px solid rgba(255,255,255,.8);}
        span.clip code{color: #666; background-color: #FFF;}
        div.video-message a{color: #FFF; text-decoration: none;}
        /* Utils */
        button.dl-btn{display: none;}
        td#playleft:hover button.dl-btn{display: inline;}
        div.video-message{display: none;}
        video + div.video-message, object + div.video-message{display: block;}
        .hidden{display: none !important;}
    `);

    if (location.origin.match(/shoupa.com/) !== null) {

        let observer = new MutationObserver(function(mutations, obs) {
            for (let i = 0; i < mutations.length; i++) {
                let mutation = mutations[i];
                let node = $(mutation.addedNodes);
                if (node.is('video#ckplayer_cms_player')) {
                    let src = $(node).children(':first').attr('src');
                    let video = doc.createElement('video');
                    node.after(video);
                    node.remove();
                    playM3u8(src, video);
                }
                if (node.is('object#ckplayer_cms_player')) {
                    let params = new URLSearchParams(node.children('[name="flashvars"]').val());
                    let src = params.get('a');
                    node.attr('data-original', src);
                }
                if (node.is('#detail-content a')) {
                    node.removeAttr('target')
                }
                if (node.is('.play-interaction .detail-mobile')) {
                    node.after(`<button type="button" class="btn btn-primary dl-video">
                                                        <img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAArklEQVR4AXWRJVgEURRGD+7eJ+FOhjYZh4r13nDtGV1v67tp+zcNb9OxSsPG9fGf5/ekdwEkVH7xk6ER7CyiMO3jkE8itNvCKkX8WeeZVyr0AMAKZfyZIUWSD+bCwpSGnQKrYeFMw06ZlbBwoPGvUEsNOxo11IoFmRwXGjlksdDEHt8aezSKBYAtDUAk9DGqMaCh7fSFhRx3HnK2YH+1KEVWxc2yUVgEUbttVCT4A+GLTZ5S0nQvAAAAAElFTkSuQmCC" style="filter:invert(100%);"/>
                                                        Get Video
                                                    </button>`);
                }
            }

        });

        observer.observe(document.body, {childList: true, subtree: true});
        setTimeout(observer.disconnect.bind(observer), 5000);

        $(doc).ready(function() {

            $(doc).on('click', 'button.dl-video', function() {
                if ($('.clip').length > 0) {
                    $('.clip').removeClass('hidden');
                    return false;
                }
                $('video.native_mode, object#ckplayer_cms_player').trigger('download');
                return false;
            }).on('click', '.clip', function(e) {
                $(this).addClass('hidden');
            });

            $(doc).on('download', 'video.native_mode, object#ckplayer_cms_player', function() {
                let src = this.dataset.original, self = this;

                getSteamURL(src, function(url) {
                    let infos = {
                        provider: 'SHOUPA',
                        url: url,
                        show: $('.play .container h2.text-nowrap a').last().text(),
                        number: (function(txt) {
                            let m;
                            if ((m = /第([0-9]+)/.exec(txt)) !== null) {
                                return m[1];
                            }
                            return "";

                        })($('.play .container h2.text-nowrap small').text())
                    };
                    generateClip(infos, self);

                });
                return false;
            });
        });
    }

    if (location.origin.match(/esyy/) !== null) {
        let observer = new MutationObserver(function(mutations, obs) {
            for (let i = 0; i < mutations.length; i++) {
                let mutation = mutations[i];
                let node = $(mutation.addedNodes);
                if (node.is('iframe[src*="ck.php"]')) {
                    node.each(function() {
                        if($(this).is('iframe[src*="ck.php"]')){
                            let url = new URL(this.src), stream = url.searchParams.get('url'), vid = doc.createElement('video');
                            $(this).after(vid);
                            playM3u8(stream, vid);
                        }
                    }).remove();

                }
            }

        });
        observer.observe(document.body, {childList: true, subtree: true});
        setTimeout(observer.disconnect.bind(observer), 5000);

        $(doc).ready(function() {
            $('.player .video-play-src a').each(function() {
                if (this.href === location.href) {
                    $(this).addClass('current-episode');
                    this.dataset.number = "";
                    let matches;
                    if ((matches = /第([0-9]+)/.exec(this.title)) !== null) {
                        this.dataset.number = matches[1];
                    }
                }
            });

            let infos = {
                provider: "ESYY",
                src: $('video').attr('data-original'),
                show: $('.tag-title-sm a').last().text(),
                number: $('.player .video-play-src a.current-episode').attr('data-number') + ""
            };

            let dlbt = $('<button type="button" class="btn dl-btn"><img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAArklEQVR4AXWRJVgEURRGD+7eJ+FOhjYZh4r13nDtGV1v67tp+zcNb9OxSsPG9fGf5/ekdwEkVH7xk6ER7CyiMO3jkE8itNvCKkX8WeeZVyr0AMAKZfyZIUWSD+bCwpSGnQKrYeFMw06ZlbBwoPGvUEsNOxo11IoFmRwXGjlksdDEHt8aezSKBYAtDUAk9DGqMaCh7fSFhRx3HnK2YH+1KEVWxc2yUVgEUbttVCT4A+GLTZ5S0nQvAAAAAElFTkSuQmCC" style="filter:invert(100%);"/>  Download  </button>');
            $('video').parent().append(dlbt);


            $(doc).on('click', 'button.dl-btn', function() {
                if ($('.clip').length > 0) {
                    $('.clip').removeClass('hidden');
                    return false;
                }
                $('video.native_mode').trigger('download');
                return false;
            }).on('click', '.clip', function(e) {
                $(this).addClass('hidden');
            });

            $(doc).on('download', 'video.native_mode', function() {

                let self = this;

                getSteamURL(infos.src, function(url) {
                    infos.url = url;
                    generateClip(infos, self);
                });

                return false;
            });

        });
    }


})(document, jQuery);



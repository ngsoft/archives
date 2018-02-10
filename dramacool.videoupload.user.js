// ==UserScript==
// @name         Dramacool VideoUpload
// @namespace    https://github.com/ngsoft
// @version      1.1.0
// @description  JD Links with custom rule ?title=* + jquery integration
// @author       daedelus
// @include     *://videoupload.space/*
// @grant none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.videoupload.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.videoupload.user.js
// ==/UserScript==


(function() {

    window.adblock = false;
    window.adblock2 = false;
    window.turnoff = true;
    window.open = function() {};
    window.eval = function() {};



    var toolbox = {

        loader: {
            timeout: 1500,
            show: function() {
                document.body.style.opacity = 0;
            },
            hide: function() {
                setTimeout(function() {
                    document.body.style.opacity = 1;
                }, toolbox.loader.timeout);
            }
        },
        ui: {
            addcss: function(css) {
                html = '<style type="text/css"><!-- ' + css + ' --></style>';
                $('body').append(html);
            }
        },

        init: function(fn) {

            toolbox.ready(fn);
        },
        onload: function() {},
        load: function() {},
        wait: function() {
            toolbox.onload();
            interval = setInterval(function() {
                if (typeof $ !== 'undefined') {
                    toolbox.load();
                    clearInterval(interval);
                }
            }, 50);
        },

        ready: function(fn) {
            toolbox.load = fn;
            if (document.readyState != 'loading') {
                toolbox.wait();
            } else {
                document.addEventListener('DOMContentLoaded', toolbox.wait);
            }

        }
    };

    var vu = {
        ui: {
            css: `  .hidden, [data-inside-iframe] header, [data-inside-iframe] footer, .watch, .sumer{display: none!important;}
                    [data-inside-iframe] .content_l {width: 200px;}
                    .mirror_link{padding-top: 10px; border-top: 1px solid #8d8d8d; margin-top: 10px;}
                    .content_c_bg{min-height: 290px;}
                    [data-inside-iframe] .content_c_bg{margin-top: 90px;}
                    `
        },

        title: function() {
            params = new URLSearchParams(location.search);
            title = params.get('title');
            title = title.replace(':', ' ', title);
            title = title.trim();
            title += '.mp4';
            return title;

        },
        links: function() {
            return $('#main .mirror_link div.dowload a');
        },
        init: function() {
            toolbox.ui.addcss(vu.ui.css);
            if (window.top != window.self) {
                $('body').attr('data-inside-iframe', true);
            }
            vu.links().each(function() {
                href = new URL($(this).attr('href'));
                //params = new URLSearchParams(href.search);
                href.searchParams.set('title', vu.title());
                $(this).attr('target', '_blank').attr('href', href);
            });
            toolbox.loader.hide();

        }
    };

    toolbox.onload = function() {
        toolbox.loader.show();

    };

    toolbox.init(vu.init);








}());
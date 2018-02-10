// ==UserScript==
// @name         Dramacool VideoUpload
// @namespace    https://github.com/ngsoft
// @version      1.0.0
// @description  JD Links with custom rule ?title=*
// @author       daedelus
// @include     *://videoupload.space/*
// @grant none
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
            show: function() {},
            hide: function() {}
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



    var videoupload = {
        ui: {
            css: `

            `
        },
        gettitle: function() {
            title = $('#main .content_c_bg div.name').text().trim();
            title = title.replace(/\([a-z\-0-9]+\)/i, '', title);
            title = title.replace(':', ' ', title);
            title = title.trim();
            title += '.mp4';
            return title;
        },
        getfirstlink: function() {
            return $('#main .mirror_link').first().find('div.dowload a').first();
        },
        getlink: function() {
            return $('#main .mirror_link div.dowload a');
        },
        flash: function() {

            flash = setTimeout(function() {
                $('.content_c_bg').css('background-color', 'rgb(227, 227, 227)');
                setTimeout(function() {
                    $('.content_c_bg').css('background-color', 'rgb(28, 28, 28)');
                }, 1000);
            }, 1000);
        },
        init: function() {
            if (window.top != window.self) {
                $('body').attr('data-inside-iframe', true);
            }



            videoupload.getlink().each(function() {
                url = $(this).attr('href') + '?title=' + videoupload.gettitle();
                $(this).attr('href', url).attr('target', '_blank');

            });
            videoupload.flash();

        }
    };


    toolbox.onload = function() {

    };

    toolbox.init(videoupload.init);








}());
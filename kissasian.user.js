// ==UserScript==
// @name         Kissasian Site Integration
// @namespace    https://github.com/ngsoft
// @version      2.2.1
// @description  removes adds + simplify UI
// @author       daedelus
// @include     *://*kissasian.*/*
// @include     *://*kissanime.*/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kissasian.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kissasian.user.js
// ==/UserScript==

(function() {

    window.adblock = false;
    window.adblock2 = false;
    window.turnoff = true;
    window.open = function() {};
    //document.body.style.opacity = '0';
    function onready(fn) {
        if (document.readyState != 'loading')
            fn();
        else
            document.addEventListener('DOMContentLoaded', fn);
    }



    var uri = location.pathname;
    var url = location.href;
    if (uri.indexOf('/Special/') !== -1) {
        document.body.style.opacity = '1';
        return;
    }
    if (url.indexOf('kissasian.com') !== -1) {
        location.href = url.replace('kissasian.com', 'kissasian.ch');
        return;
    }
    if (window.top != window.self) {
        return;
    }


    var toolkit = {
        body: function() {
            return $('body');
        },
        addcss: function(css) {
            html = `<style type="text/css"><!-- ` + css + ` --></style>`;
            toolkit.body().append(html);
        },
        spinner: `<style type="text/css"><!--
        div#spinner{display : block;position : fixed;z-index: 100; background-repeat : no-repeat;background-position : center;left : 0; bottom : 0; right : 0;  top : 0;}
        div#spinner img{left : 50%;top : 50%;position : absolute;z-index : 101;width : 32px;height : 32px;margin-left : -16px;margin-top : -16px;}
         --></style><div id="spinner"><img alt="" class="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K" /></div>`,
        init: function(fn) {
            interval = setInterval(function() {
                if (typeof $ !== 'undefined') {
                    //if ($.fn.jquery != '3.2.1')
                    //    return;
                    fn();
                    clearInterval(interval);
                }
            }, 50);
        },
        loader: {
            show: function() {
                if ($('div#spinner').length > 0)
                {
                    $('div#spinner').show();
                    return;
                }
                $('body').append(toolkit.spinner);
                //toolkit.body().append(toolkit.spinner);
            },
            hide: function() {
                if ($('div#spinner').length > 0) {
                    $('div#spinner').hide();
                }

            }
        }


    };
    var kissasian = {
        ui: {

            css: `
                .hidden, div[id*="divAds"], div[style*="fixed;"], iframe:not(.ignored){ display: none!important;}
                .nomargin, .banner, .bigBarContainer{margin: 0!important;}
                .clear, #container:not(.videoplayer) .clear2{height: 0; max-height: 0;}
                #vidlink{display: block;text-align: center;font-size: 12pt;margin: 10px 0 20px 0;}
                .visible{visibility: visible!important;}
                #centerDivVideo{margin-top: 15px;}
                .bksbutton{text-decoration: underline;}
            `,
            timeout: 1500,
            show: function() {
                setTimeout(function() {
                    //document.getElementById('containerRoot').style.opacity = '1';
                    toolkit.loader.hide();
                }, kissasian.ui.timeout);
            },
            bks: function() {
                //latest episode (auto hides completed)

                var latest = {
                    button: $("th:contains('Latest')"),
                    completed: $("td:contains('Completed')").parent('tr'),
                    uncomplete: $("td a:contains('Episode')").parents('tr')
                };

                latest.button.addClass('bksbutton').attr('data-toogle', 'all');

                latest.button.click(function(e) {
                    toogle = $(this).attr('data-toogle');
                    if (toogle == "all") {
                        $(this).attr("data-toogle", "uncomplete").attr('title', 'Show Complete');
                        latest.completed.addClass('hidden');
                        latest.uncomplete.removeClass('hidden');
                        return;
                    }
                    if (toogle == "uncomplete") {
                        $(this).attr("data-toogle", "complete").attr('title', 'Show All');
                        latest.completed.removeClass('hidden');
                        latest.uncomplete.addClass('hidden');
                        return;
                    }
                    if (toogle == "complete") {
                        $(this).attr("data-toogle", "all").attr('title', 'Show Uncomplete');
                        latest.completed.removeClass('hidden');
                        latest.uncomplete.removeClass('hidden');
                    }
                }).click();




                //status (auto hides watched)
                var st = {
                    button: $("th:contains('Status')"),
                    watched: $('a.aUnRead[style*="none"]').parent('td').parent('tr'),
                    unwatched: $('a.aRead[style*="none"]').parent('td').parent('tr'),
                };

                st.button.addClass('bksbutton').attr('title', 'Toggle Visibility').attr('data-toogle', 'all');
                st.button.click(function(e) {
                    toogle = $(this).attr('data-toogle');
                    if (toogle == 'unwatched') {
                        $(this).attr('data-toogle', 'watched').attr('title', 'Show All');
                        st.unwatched.addClass('hidden');
                        st.watched.removeClass('hidden');
                        return;
                    }
                    if (toogle == 'watched') {
                        $(this).attr('data-toogle', 'all').attr('title', 'Show Unwatched');
                        st.unwatched.removeClass('hidden');
                        st.watched.removeClass('hidden');
                        return;
                    }
                    if (toogle == 'all') {
                        $(this).attr('data-toogle', 'unwatched').attr('title', 'Show Watched');
                        st.unwatched.removeClass('hidden');
                        st.watched.addClass('hidden');
                    }
                });



            },
            epl: function() {
                $('table.listing tr td').parent('tr').addClass('ep');
                table = $('table.listing');
                table.html(table.find('tr').get().reverse());
                table.prepend(table.find('tr:not(.ep)').get().reverse());
            },
            player: {
                link: '',
                filename: '',
                getlink: function() {
                    filename = document.title.split('-');
                    filename = filename[0].trim();
                    filename += '.mp4';
                    //default mode
                    if (filename.length > 0) {
                        kissasian.ui.player.filename = filename.trim();
                        link = $('#divDownload a').first().clone();
                        if (link.length > 0) {
                            kissasian.ui.player.link = link;
                        }
                        //revert to device player
                        else {
                            kissasian.ui.player.link = $("div.clsTempMSg div:contains('If the player does not work') a").first().clone();
                        }
                    }
                    kissasian.ui.player.addlink();
                },
                addlink: function() {
                    if (kissasian.ui.player.link.length < 1) {
                        return;
                    }
                    if (kissasian.ui.player.filename.length < 1) {
                        return;
                    }
                    target = $('#container .barContent').first();
                    el = $('<div><b>Download : </b></div>');
                    el.attr('id', 'vidlink');
                    el.append(kissasian.ui.player.link);
                    a = el.find('a');
                    if (a.attr('href').indexOf('?') === -1)
                        a.html(kissasian.ui.player.filename).attr('target', '_blank').attr('href', a.attr('href') + '?title=' + kissasian.ui.player.filename);
                    else
                        a.html(kissasian.ui.player.filename).attr('target', '_blank').attr('href', a.attr('href') + '&title=' + kissasian.ui.player.filename);
                    target.prepend(el);
                },
                init: function() {
                    kissasian.ui.timeout = 3500;
                    $('#divContentVideo iframe').addClass('ignored');

                    $('.divCloseBut a').click();
                    $('div > span.st_facebook_hcount').parent('div').parent('div').remove();
                    $('#divComments').remove();
                    $('#head').addClass('hidden');
                    kissasian.ui.player.getlink();
                }
            },
            main: function() {
                $("div.barTitle:contains('Remove ads')").parent('div.rightBox').addClass('hidden');
                $("div.barTitle:contains('^^')").parent('div.rightBox').addClass('hidden');
                $("div.barTitle:contains('Related')").parent('div.rightBox').addClass('hidden');
                $("div.barTitle:contains('Comments')").parent('div.bigBarContainer').addClass('hidden');
                $("div.barTitle:contains('Episodes')").parent('div.bigBarContainer').prev().addClass('hidden');
                rsstag = $('a[href*="/RSS/"]').parent('div');
                rsstag.next().addClass('hidden');
                rsstag.addClass('hidden');
            }
        },
        linkclick: function() {
            toolkit.loader.show();
        },

        init: function() {

            toolkit.addcss(kissasian.ui.css);
            toolkit.loader.show();
            if (uri == '/Login') {
                $('#btnSubmit').attr('type', 'submit').attr('onclick', '');
                kissasian.ui.show();
                return;
            }

            if (uri == '/BookmarkList') {
                kissasian.ui.bks();
            }
            if (url.match(/\/Drama\//)) {
                kissasian.ui.epl();
            }
            if ($('#centerDivVideo').length > 0) {
                kissasian.ui.player.init();
            }
            kissasian.ui.main();
            $('div[id*="divAds"]').remove();
            $('iframe:not(.ignored)').remove();
            $('div[style*="fixed;"]').remove();

            $('a[href^="/"').click(kissasian.linkclick);
            $('a[href*="//kissasian"').click(kissasian.linkclick);


            kissasian.ui.show();
        }

    };
    onready(function() {
        //hide container
        //document.getElementById('containerRoot').style.opacity = '0';
        //document.body.style.opacity = '1';
        toolkit.init(kissasian.init);
    });

})();
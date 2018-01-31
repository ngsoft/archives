// ==UserScript==
// @name         Kissasian Site Integration v2
// @namespace    https://github.com/ngsoft
// @version      2.0.0
// @description  removes adds + simplify UI
// @author       daedelus
// @include     *://kissasian.*/*
// @include     *://kissanime.*/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @noframes
// @grant none
// @run-at       document-start
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kissasian2.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kissasian2.user.js
// ==/UserScript==

//
// @run-at document-start
//
window.adblock = false;
window.adblock2 = false;
window.turnoff = true;
window.open = function() {};
//
// @run-at document-end
//
function onready(fn) {
    if (document.readyState != 'loading')
        fn();
    else
        document.addEventListener('DOMContentLoaded', fn);
}


(function() {
    var uri = location.pathname;
    var url = location.href;
    if (uri.indexOf('/Special/') !== -1) {
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
            html = `<style type="text/css"><!-- ` + css + `--></style>`;
            toolkit.body().append(html);
        }
    };
    var kissasian = {
        ui: {
            css: ``,
            bks: function() {
                el = $("th:contains('Latest')");
                el.css("text-decoration", "underline").attr('title', 'Show All/Uncomplete');
                el.on('click', function(e) {
                    tohide = $("td:contains('Completed')").parent('tr');
                    if (tohide.hasClass('hidden')) {
                        tohide.removeClass('hidden');
                    } else {
                        tohide.addClass('hidden');
                    }
                }).click();
            },
            epl: function() {
                $('table.listing tr td').parent('tr').addClass('ep');
                table = $('table.listing');
                table.html(table.find('tr').get().reverse());
                table.prepend(table.find('tr:not(.ep)').get().reverse());
            },
            player: {

                init: function() {

                }
            }
        },

        init: function() {
            toolkit.addcss(kissasian.ui.css);

            if (uri == '/Login') {
                $('#btnSubmit').attr('type', 'submit').attr('onclick', '');
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




        }

    };





    onready(function() {
        interval = setInterval(function() {
            if (typeof $ !== 'undefined' && $.fn.jquery == '3.2.1') {
                kissasian.init();
                clearInterval(interval);
            }
        }, 100);

    });


})();
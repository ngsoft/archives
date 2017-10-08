// ==UserScript==
// @name         Kissasian Site Integration
// @namespace    ngsoft/kissasian
// @version      1.0.0
// @description  removes adds + simplify UI
// @author       daedelus
// @include     *://kissasian.*/*
// @include     *://kissanime.*/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kissasian.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kissasian.js
// ==/UserScript==

//adios popups
window.open = function() {};

(function() {
    //main variables
    var uri = location.pathname;
    var url = location.href;
    //capcha
    if (uri.indexOf('/Special/') !== -1) {
        return;
    }
    //redirect old site
    if (url.indexOf('kissasian.com') !== -1) {
        location.href = url.replace('kissasian.com', 'kissasian.ch');
        return;
    }

    //prevent iframes (old style)
    if (window.top != window.self) {
        return;
    }
    //Blackscript class player
    var player = {
        link: '',
        filename: '',
        run: function() {
            player.css();
            player.hideadds();
            player.getlink();
        },
        hideadds: function() {
            $('.divCloseBut a').click();
            $('div > span.st_facebook_hcount').parent('div').parent('div').remove();
            $('#divComments').remove();
        },
        getlink: function() {
            filename = $('#divFileName').clone().children().remove().end().text();
            //default mode
            if (filename.length > 0) {
                player.filename = filename.trim();
                link = $('#divDownload a').first().clone();
                if (link.length > 0) {
                    player.link = link;
                }
            }
            player.addlink();
        },
        addlink: function() {
            if (player.link.length < 1) {
                return;
            }
            if (player.filename.length < 1) {
                return;
            }
            target = $('#container .barContent').first();
            el = $('<div><b>Download : </b></div>');
            el.attr('id', 'vidlink');
            el.append(player.link);
            a = el.find('a');
            a.html(player.filename).attr('href', a.attr('href') + '?title=' + player.filename);
            target.prepend(el);
        },
        css: function() {
            $('#container').addClass('videoplayer');
            mycss = `
				<style type="text/css">
				<!--
					#vidlink{
						display: block;
						text-align: center;
						font-size: 12pt;
						margin: 10px 0 20px 0;
					}
				-->
				</style>`;
            $('body').append(mycss);
        }
    };
    //Blackscript class kissasian
    // http://gabordemooij.com/index.php?p=/blackscript
    var kissasian = {
        main: function() {
            interval = setInterval(function() {
                if (typeof $ !== 'undefined' && $.fn.jquery == '3.2.1') {
                    kissasian.run();
                    clearInterval(interval);
                }
            }, 200);
        },
        run: function() {
            $(document).ready(function() {
                //repair login
                if (uri == '/Login') {
                    kissasian.login();
                    return;
                }
                kissasian.css();
                //router
                //bookmarks
                if (uri == '/BookmarkList') {
                    kissasian.bookmarks();
                }
                //player
                if ($('#centerDivVideo').length > 0) {
                    player.run();
                }
                kissasian.hideadds();
                kissasian.hideui();
            });
        },
        css: function() {
            mycss = `
				<style type="text/css">
				<!--
					.hidden{
						display: none!important;
					}
					.nomargin{
						margin: 0!important;
					}
					.clear, #container:not(.videoplayer) .clear2{
						height: 0;
						max-height: 0;
					}

				-->
				</style>`;
            $('body').append(mycss);
        },
        //hide adds and some UI elements
        hideadds: function() {
            $('#divContentVideo iframe').addClass('ignored');
            $('div[id*="divAds"]').remove();
            $('iframe:not(.ignored)').remove();
            $('div[style*="fixed;"]').remove();
        },
        hideui: function() {
            $('.banner').addClass('nomargin');
            $('.bigBarContainer').addClass('nomargin');
            $("div.barTitle:contains('Remove ads')").parent('div.rightBox').addClass('hidden');
            $("div.barTitle:contains('^^')").parent('div.rightBox').addClass('hidden');
            $("div.barTitle:contains('Comments')").parent('div.bigBarContainer').addClass('hidden');
            $("div.barTitle:contains('Episodes')").parent('div.bigBarContainer').prev().addClass('hidden');
            rsstag = $('a[href*="/RSS/"]').parent('div');
            rsstag.next().addClass('hidden');
            rsstag.addClass('hidden');
        },
        bookmarks: function() {
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
        login: function() {
            $('#btnSubmit').attr('type', 'submit').attr('onclick', '');
        }
    };
    window.addEventListener("load", kissasian.main, false);
}());
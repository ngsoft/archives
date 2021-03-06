// ==UserScript==
// @name         Kissasian Site Integration
// @namespace    https://github.com/ngsoft
// @version      5.9.1
// @description  removes adds + simplify UI + Mobile mode
// @author       daedelus
// @icon        data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAChVBMVEX////jqHyeq9a6YJvWSH/FhbajmMe6RYfNY5ilkcK3P4LLZpumi77JaJ3bp4qnhrvIaZ/irnLajZ+nf7XHa6Hep3fbjpmoe7PGbKLaoH2od7HIOHfGa6LXm4Oocq3GPHvGbqXTl4ena6jDP3/GbaXRkoqmZKTCQ4PGbKTPj42M1/imXJ7ASIjJZJ7XfF3MjI+OptWkVJm+TIzMYZy1pMmRotOhTJS9UZDNaKKYn9CeRZC7VpSqtsrJlp7LlaSfTZa6Wpi4qKnWlIC5XZu6pKfWl4O4YZ++np7UmYm2Y6HAmJfUm4q2ZqOvrMXUn421Z6WxqsLToJKzaqfJjoDUoZGzaqfLj37SpJWza6jPkHrRpZmiOYazaqjRkHTTpZehPYmzaaehwsnTknPRqJuhQI21Z6apvbrWk23Rp52jVZu5ZKSgxs3UmHfpvGPaeFDgfT3ihj/kjkDnmULqokPsq0XutUjwvknBRobDRoXERYTHRoTJRoPKRYLMRoLORoLQRYDRRoDURn+6Jm68J22/J2zBJ2vFKGrHKGnJJ2jMKGfPKGfSJ2XUKGTXKmW4J2/UK2e1OH60J2/SLGmyNHyyJnDPL22wMXuvJnHMMnCsLXitJ3PKNHOpKnepJnPnmUOmKHanJnTkjkKiJ3elJnXhhkSgJnaiJnbffUadJnibJniYJnmVJnqSJXveiVXjjUDmkkGZN4etKHTehU7jiD/ml0KqKHTfgUjhhD7om0KpKXbee0LhgD7pn0SnK3nedj3fezzpn0Pqo0amLXvedjvqpETrqUilMH3sqkXsrEqkM4HtrkbtsEyjNoPus0bttU7vuEjtt1LvvEntulbwwUrtv1fllkbxxktHPnZRAAAAbnRSTlMB/Rfx/Xkl+6kz/ZdFhetbcfELc1/nBYtP2Z/9P8e1/TGzyfslm9n3GYMD5fMR/W0L7+8JKRf35wUh+d0r5b37z03ZwWnRsYXFoaO7j3WxfYOha9WXWd2NSeN7/Tfrc/spBe9n+RsJ81XpEQ3n/fLP0lUAAAGASURBVDjLY2CgGOTlFxQWFZeUljGCuUzM5RWVVdU1tXX1DY0srBgK2Nibmlta29o7Oru6e3o5MEzg5OpDKOjnxrCCZ8JEhIJJvGhu4GPgnzwFoWCqAJojBYWEp01HKJghguYLUTHxmbMQCmZLoHlTkkFqzlyEAmkZ1HCYJ8sgN38BQoG8AmpALVRkUFq0GKFAWQU1JJeoMqgtXYZQoK6BGtTLNbW0VyAp0NFFjQs9fQPDlUgKjIzRIsvE1GwVkgJzC/TYtLRajaTAmsHG1g5Vgf0aJAUODI5r1613QlGwAaFgozODy6bN69ZvccWuYKsbg/u27SAFOzywKdjpyeC1azdEwR5vTAV7fRh89+2HKjhw0A9dwSF/BoaAw3AFR44Goio4FgRiByMUHD8RgqzgZCiEE4ZQcOp0OELBmQiYeZEIBWfPRcEURMfAXaQVi1Bw/kIcREF8ApKvE5MQCi5eSgYpSElFCdm0dISCy1cyGBgys9BiLzvnKlzBtVwGygEAJ9w8vq6VXKoAAAAASUVORK5CYII=
// @include     *://*kissasian.*/*
// @include     *://*kissanime.*/*
// @include     *://*kissmanga.*/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kissasian.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kissasian.user.js
// ==/UserScript==
window.open = function() {};
window.eval = function() {};
(function(doc, undef) {
    window.adblock = false;
    window.adblock2 = false;
    window.turnoff = true;

    if (window.top != window.self) {
        return;
    }

    var uri = location.pathname;
    var url = location.href;

    if (uri.indexOf('/Special/') !== -1 && url.indexOf('kissasian') !== -1) {
        return;
    }
    if (url.indexOf('kissasian.com') !== -1) {
        location.href = url.replace('kissasian.com', 'kissasian.ch');
        return;
    }
    if (window.top != window.self) {
        return;
    }

    /**
     * Userscript library
     */

    var toolbox = {
        //runonce (prevent loop execution on error)
        exec: false,
        //interval for jquery check
        interval: 50,
        //exec on jquery $(document).ready() ?
        ondocumentready: true,
        //auto load jquery
        autoloadjquery: false,
        loader: {
            timeout: 1500,
            show: function() {
                toolbox.loader.onshow();
            },
            hide: function() {
                setTimeout(toolbox.loader.onhide, toolbox.loader.timeout);
            },
            onshow: function() {
                document.body.style.opacity = 0;
            },
            onhide: function() {
                document.body.style.opacity = 1;
            },
            setevents: function() {
                $('a[href^="/"]').on('click', toolbox.loader.show);
                $('a[href^="' + location.origin + '"]').on('click', toolbox.loader.show);
                $('a[href^="?"]').on('click', toolbox.loader.show);
            }
        },
        ui: {
            addscript: function(src) {
                s = document.createElement('script');
                s.setAttribute('src', src);
                document.body.appendChild(s);
            },
            addcss: function(css) {
                s = document.createElement('style');
                s.setAttribute('type', "text/css");
                s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
                document.body.appendChild(s);
            },
            loadcss: function(cssurl) {
                s = document.createElement('link');
                s.setAttribute('rel', "stylesheet");
                s.setAttribute('href', cssurl);
                document.head.appendChild(s);
            }
        },
        cookies: {
            ready: false,
            expire: 14,
            data: {},
            get: function(name, value = null) {
                if (toolbox.cookies.ready === false) {
                    return value;
                }
                if (typeof toolbox.cookies.data[name] === 'undefined') {
                    toolbox.cookies.data[name] = value;
                    get = Cookies.get(name);
                    if (typeof get !== 'undefined') {
                        toolbox.cookies.data[name] = get;
                    }
                }
                return toolbox.cookies.data[name];
            },
            getobj: function(name, value = {}) {
                if (toolbox.cookies.ready === false) {
                    return value;
                }
                if (typeof toolbox.cookies.data[name] === 'undefined') {
                    toolbox.cookies.data[name] = value;
                    get = Cookies.getJSON(name);
                    if (typeof get === 'object') {
                        toolbox.cookies.data[name] = get;
                    }
                }
                return toolbox.cookies.data[name];
            },
            set: function(name, value) {
                if (toolbox.cookies.ready === false) {
                    return;
                }
                toolbox.cookies.data[name] = value;
                Cookies.set(name, value, {expires: toolbox.cookies.expire});
            },
            remove: function(name) {
                toolbox.cookies.data[name] = null;
                delete toolbox.cookies.data[name];
                Cookies.remove(name);
            },
            save: function(name = null) {
                if (typeof toolbox.cookies.data === 'object') {
                    //save all
                    if (name === null) {
                        Object.keys(toolbox.cookies.data).map(function(key, index) {
                            toolbox.cookies.set(key, toolbox.cookies.data[key])
                        });
                    } else if (typeof toolbox.cookies.data[name] !== 'undefined') {
                        toolbox.cookies.set(name, toolbox.cookies.data[name]);
                    }
            }

            },
            onready: function() {},
            init: function() {
                console.debug('User script loading "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"');
                toolbox.ui.addscript('https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js');
                waitforcookies = setInterval(function() {
                    if (typeof Cookies !== 'undefined') {
                        clearInterval(waitforcookies);
                        toolbox.cookies.ready = true;
                        toolbox.cookies.onready();
                    }
                }, toolbox.interval);
            }
        },
        init: function(fn = null, interval = 50) {
            toolbox.interval = interval;
            toolbox.ready(fn);
        },
        onload: function() {},
        load: function() {},
        wait: function() {
            toolbox.onload();
            if (toolbox.autoloadjquery !== false) {
                console.debug('User script loading "https://code.jquery.com/jquery-3.2.1.min.js"');
                toolbox.ui.addscript('https://code.jquery.com/jquery-3.2.1.min.js');
            }
            if (toolbox.exec === true) {
                return;
            }
            interval = setInterval(function() {
                if (toolbox.exec === true) {
                    clearInterval(interval);
                    return;
                }
                if (typeof jQuery !== 'undefined') {
                    if (toolbox.exec === false) {
                        clearInterval(interval);
                        (function($) {
                            if (toolbox.ondocumentready === false) {
                                toolbox.load();
                            } else {
                                console.debug('User script waiting for $(document).ready()');
                                $(document).ready(toolbox.load);
                            }
                            toolbox.exec = true;
                        })(jQuery);
                    }
                }
            }, toolbox.interval);
        },
        ready: function(fn = null) {
            if (typeof fn === 'function') {
                toolbox.load = fn;
            }
            if (document.readyState != 'loading') {
                toolbox.wait();
            } else {
                document.addEventListener('DOMContentLoaded', toolbox.wait);
        }

        }
    };

    class ElementObserver {

        start() {
            if (this.worker !== undef) {
                return this;
            }
            let self = this;
            if (this.params.interval === 0) {
                throw new Error("ElementObserver : invalid interval");
            }
            if (typeof this.params.onload !== "function") {
                throw new Error("ElementObserver : no callback set");
            }
            if (this.params.selector.length === 0) {
                throw new Error("ElementObserver : no selector set");
            }
            this.worker = setInterval(function() {
                doc.querySelectorAll(self.params.selector).forEach(function(el) {
                    self.params.onload.apply(el, [el, self]);
                });
            }, this.params.interval);
            if (this.params.timeout > 0) {
                this.tworker = setTimeout(function() {
                    self.stop();
                }, this.params.timeout);
            }
            return this;
        }
        stop() {
            if (this.worker === undef) {
                return this;
            }
            if (this.tworker !== undef) {
                clearTimeout(this.tworker);
                delete(this.tworker);
            }
            clearInterval(this.worker);
            delete(this.worker);
            return this;
        }

        constructor(selector, options) {
            let self = this;
            this.params = {
                selector: "",
                onload: null,
                interval: 10,
                timeout: 0
            };
            if (typeof selector === "string" && selector.length > 0) {
                this.params.selector = selector;
            } else if (selector instanceof Object) {
                options = selector;
            }

            if (typeof options === "function") {
                this.params.onload = options;
            } else if (options instanceof Object) {
                Object.keys(options).forEach(function(x) {
                    if (self.params[x] !== undef) {
                        if (typeof options[x] === typeof self.params[x]) {
                            self.params[x] = options[x];
                        } else if (x === "onload" && typeof options[x] === "function") {
                            self.params[x] = options[x];
                        }

                    }
                });
            }

            if (typeof this.params.onload === "function" && this.params.interval > 0 && this.params.selector.length > 0) {
                this.start();
            }

        }
    }





    var kissasian = {
        loggedin: true,
        mobile: false,
        ui: {

            css: `
                [data-player-enabled] #head, .hidden, div[id*="divAds"], div[style*="fixed;"], #videoAd,
                #liReportError, #liRequest, #liCommunity, #liFAQ, #liChatRoom, #liReadManga, #liGame, #liMobile
                { display: none!important;}
                .nomargin, .banner, .bigBarContainer{margin: 0!important;}
                .clear, #container:not(.videoplayer) .clear2{height: 0; max-height: 0;}
                #vidlink{display: block;text-align: center;font-size: 12pt;margin: 10px 0 20px 0;}
                .visible{visibility: visible!important;}
                #centerDivVideo{margin-top: 15px;}
                .bksbutton{text-decoration: underline;}
                #navsubbar a img, #navsubbar a input[type="checkbox"]{width:12px; height: 12px;}
                a.bigChar img{width: 20px; height: 20px; margin-right:7px;}
            `,
            nav: {
                separator: function() {
                    if ($('div#navsubbar p a').length > 0) {
                        $('div#navsubbar p').append('| ');
                    }
                },
                add: function(desc, link) {
                    html = `<a href="` + link + `">` + desc + `</a>`;
                    html = $(html);
                    kissasian.ui.nav.separator();
                    kissasian.ui.nav.addhtml(html);
                    return html;
                },
                addhtml: function(html) {
                    $('div#navsubbar p').append(html);
                }
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
                });
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
                if (kissasian.mobile == true) {
                    table = $('ul.list li.episodeSub').parent('ul');
                    table.html(table.find('li').get().reverse());
                    return;
                }
                $('table.listing tr td').parent('tr').addClass('ep');
                table = $('table.listing');
                table.html(table.find('tr').get().reverse());
                table.prepend(table.find('tr:not(.ep)').get().reverse());
            },
            player: {
                link: '',
                filename: '',
                loaded: false,
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
                    toolbox.loader.timeout = 3500;
                    kissasian.ui.player.loaded = true;
                    $('body').attr('data-player-enabled', true);
                    $('#divContentVideo iframe').addClass('ignored');
                    $('iframe#mVideo').addClass('ignored');
                    $('div > span.st_facebook_hcount').parent('div').parent('div').remove();
                    //$('#divComments').remove();
                    $("div.barContent > div > div > div:contains('video is stuttering,')").parent('div').addClass('hidden');

                    if (kissasian.loggedin == false)
                        return;
                    //autolink

                    checkbox = kissasian.ui.nav.add(`<input type="checkbox" disabled /> Auto Video Link`, '#');

                    checkbox.off('click').on('click', function(e) {
                        e.preventDefault();
                        if ($(this).find('input[type="checkbox"][checked]').length > 0) {
                            $(this).find('input[type="checkbox"]').removeAttr('checked');
                            toolbox.cookies.set('autolink', 'false');
                            $('div#vidlink').remove();
                        } else {
                            $(this).find('input[type="checkbox"]').attr('checked', 'true');
                            toolbox.cookies.set('autolink', 'true');
                            kissasian.ui.player.getlink();
                        }
                    });

                    if (toolbox.cookies.get('autolink') === 'true') {
                        checkbox.find('input[type="checkbox"]').attr('checked', 'true');
                        kissasian.ui.player.getlink();
                    }
                    new ElementObserver({
                        selector: '#divContentVideo div[id*="glx-"] > div, div.glx-close',
                        onload(el, obs) {
                            $(el).click();
                        }
                    });



                }
            },
            main: function() {
                $("div.barTitle:contains('Remove ads')").parent('div.rightBox').addClass('hidden');
                $("div.barTitle:contains('^^')").parent('div.rightBox').addClass('hidden');
                $("div.barTitle:contains('Related')").parent('div.rightBox').addClass('hidden');
                //$("div.barTitle:contains('Comments')").parent('div.bigBarContainer').addClass('hidden');
                $("div.barTitle:contains('Episodes')").parent('div.bigBarContainer').prev().addClass('hidden');
                rsstag = $('a[href*="/RSS/"]').parent('div');
                rsstag.next().addClass('hidden');
                rsstag.addClass('hidden');
            }
        },
        init: function() {

            console.debug('User Script Started');

            //fix login button
            if (uri == '/Login') {
                $('#btnSubmit').hide().parent('div').append('<input type="submit" value="Sign in" />');
                toolbox.loader.hide();
                return;
            }
            if (uri == '/Register') {
                toolbox.loader.hide();
                return;
            }

            //check loggedin
            if ($('div#topHolderBox a[href*="/Login"]').length > 0) {
                kissasian.loggedin = false;
            }
            if ($('div.shifter-page').length > 0) {
                kissasian.mobile = 1;
            }

            if (uri == '/BookmarkList') {
                kissasian.ui.bks();
            }
            if (url.match(/\/Drama\//) || url.match(/\/Anime\//)) {
                kissasian.ui.epl();
            }

            new ElementObserver({
                selector: '.divCloseBut a',
                onload(el, obs) {
                    $(el).click();
                }
            });


            //$('.divCloseBut a').click();
            if ($('#centerDivVideo').length > 0 || $('#mVideo').length > 0) {
                kissasian.ui.player.init();
            }
            kissasian.ui.main();



            $('div[id*="divAds"]').remove();
            $('iframe:not(.ignored)').remove();


            $('div[style*="fixed;"]').remove();
            betamode.init();
            autoserver.init();
            g.init();
            if (location.host.indexOf('asian') !== -1) {
                $('#navcontainer > ul').append('<li><a href="//kissanime.ru/" target="_blank">Watch Anime</a></li>');
            }



            /*toolbox.loader.setevents();
             $('a[href^="Drama/"]').click(toolbox.loader.show);
             $('a[href^="Anime/"]').click(toolbox.loader.show);*/
            toolbox.loader.hide();
            //external search ?q=MySearch
            let sp = new URL(location.href), search;
            if ((search = sp.searchParams.get('q')) !== null) {
                $('#formSearch #keyword').val(search);
                $('#formSearch #imgSearch').click();

            }
        }

    };
    /**
     * Auto Beta player
     */
    var betamode = {
        episodepath: '',
        checkbox: `<a href="#" id="betamode"><input type="checkbox" disabled /> Beta Player</a>`,
        target: {},
        click: function(e) {
            e.preventDefault();
            if (betamode.checked()) {
                checked = betamode.checked(false);
                betamode.disable();
            } else {
                checked = betamode.checked(true);
                betamode.enable();
            }
            if (kissasian.ui.player.loaded) {
                toolbox.loader.show();
                s = 'default';
                if (checked == true)
                    s = 'beta';
                page = new URL(location.href);
                page.searchParams.set('s', s);
                location.href = page.href;
            }


        },
        change: function() {
            location.href = $(this).val();
        },
        checked: function(val = null) {
            if (val == null) {
                val = toolbox.cookies.get('beta');
            }

            if (val == 'true' || val == true) {
                val = true;
                betamode.checkbox.find('input').first().attr('checked', val);
            } else {
                val = false;
                betamode.checkbox.find('input').first().removeAttr('checked');
            }
            toolbox.cookies.set('beta', val);
            return val;
        },
        enable: function() {
            betamode.checked(true);
            betamode.target.each(function() {
                link = $(this).attr('data-original-link');
                link = new URL(link);
                if (link.searchParams.get('s') == null) {
                    link.searchParams.set('s', 'beta');
                }
                $(this).attr('href', link.href);
            });
            $('select#selectEpisode option').each(function() {
                link = $(this).attr('data-original-value');
                link = new URL(link);
                link.searchParams.set('s', 'beta');
                $(this).attr('value', link.href);
            });
        },
        disable: function() {
            betamode.checked(false);
            betamode.target.each(function() {
                href = $(this).attr('data-original-link');
                $(this).attr('href', href);
            });
            $('select#selectEpisode option').each(function() {
                link = $(this).attr('data-original-value');
                $(this).attr('value', link);
            });
        },
        init: function() {
            if (location.origin.indexOf('anime') === -1 && location.origin.indexOf('asian') === -1) {
                return;
            }
            betamode.checkbox = $(betamode.checkbox);
            kissasian.ui.nav.separator();
            kissasian.ui.nav.addhtml(betamode.checkbox);
            if (kissasian.mobile == true) {
                $('.shifter-navigation ul').append('<li />');
                $('.shifter-navigation ul li:last').append(betamode.checkbox);
            }


            checked = betamode.checked();
            betamode.checkbox.off('click').on('click', betamode.click);
            $('a[href*="?id="]').each(function() {
                href = $(this).attr('href');
                if (href.indexOf('/Drama/') === -1 && href.indexOf('/Anime/') === -1) {
                    return;
                }
                if (typeof $(this).attr('data-original-link') === 'undefined') {
                    if (href.indexOf(location.origin) === -1) {
                        href = location.origin + href;
                    }
                    $(this).attr('data-original-link', href);
                }
            });
            betamode.target = $('a[data-original-link]');

            if (kissasian.ui.player.loaded == false) {
                return;
            }

            betamode.episodepath = location.origin + location.pathname.match(/\/.*\//)[0];
            $('select#selectEpisode option').each(function() {
                $(this).attr('value', betamode.episodepath + $(this).attr('value'));
                $(this).attr('data-original-value', $(this).attr('value'));
            });

            $('select#selectEpisode').off('change').on('change', betamode.change);
            if (checked)
                betamode.enable();
        }
    };
    /**
     * auto server
     */

    var autoserver = {
        checkbox: {},
        server: {
            name: '',
            value: ''
        },
        checked: function(val = null) {
            if (val == null) {
                val = toolbox.cookies.get('automode');
            }

            if (val == 'true' || val == true) {
                val = true;
                autoserver.checkbox.find('input').first().attr('checked', val);
            } else {
                val = false;
                autoserver.checkbox.find('input').first().removeAttr('checked');
                Cookies.remove('lastserver');
            }
            toolbox.cookies.set('automode', val);
            return val;
        },
        enable: function() {
            betamode.disable();
            autoserver.checked(true);

            if (autoserver.server.value != null) {
                $('select#selectEpisode option').each(function() {
                    link = $(this).attr('data-original-value');
                    link = new URL(link);
                    link.searchParams.set('s', autoserver.server.value);
                    $(this).attr('value', link.href);
                });

                $.each(['#btnPrevious', '#btnNext'], function(i, v) {
                    if ($(v).length > 0) {
                        selector = $(v).parent('a');
                        link = new URL(selector.attr('data-original-link'));
                        link.searchParams.set('s', autoserver.server.value);
                        selector.attr('href', link.href);
                    }

                });
            }
        },
        disable: function() {
            autoserver.checked(false);
            $('select#selectEpisode option').each(function() {
                link = $(this).attr('data-original-value');
                $(this).attr('value', link);
            });
            $.each(['#btnPrevious', '#btnNext'], function(i, v) {
                if ($(v).length > 0) {
                    selector = $(v).parent('a');
                    selector.attr('href', selector.attr('data-original-link'));
                }

            });
        },
        click: function(e) {
            e.preventDefault();
            if (autoserver.checked()) {
                autoserver.disable();
                return;
            }
            autoserver.enable();
        },

        init: function() {
            if (location.origin.indexOf('anime') === -1 && location.origin.indexOf('asian') === -1) {
                return;
            }
            if (kissasian.ui.player.loaded == false) {
                autoserver.checkbox = kissasian.ui.nav.add(`<input type="checkbox" disabled /> Auto Server`, '#');
            } else {

                autoserver.server.name = $('select#selectServer option[selected]').first().html().trim();
                server = $('select#selectServer option[selected]').attr('value');
                if (!server.match(/^http/)) {
                    server = location.origin + server;
                }
                server = new URL(server);
                autoserver.server.value = server.searchParams.get('s');
                autoserver.checkbox = kissasian.ui.nav.add(`<input type="checkbox" disabled /> Auto Server : ` + autoserver.server.name, '#');

                currenturl = new URL(location.href);

                if (currentid = currenturl.searchParams.get('id')) {
                    $('select#selectEpisode option').removeAttr('selected');
                    $('select#selectEpisode option[value*="id=' + currentid + '"]').attr('selected', true);

                }
            }


            betamode.checkbox.on('click', function(e) {
                e.preventDefault();
                autoserver.disable();
            });
            autoserver.checkbox.off('click').on('click', autoserver.click);

            if (autoserver.checked()) {
                lastserver = toolbox.cookies.get('lastserver');
                if (lastserver !== null) {
                    server = $('select#selectServer option[value*="s=' + lastserver + '"]');
                    if (server.length > 0) {
                        if ($('select#selectServer option[value*="s=' + lastserver + '"][selected]').length < 1) {
                            location.href = server.attr('value');
                            return;
                        }


                    }
                }
                autoserver.enable();
                if (kissasian.ui.player.loaded !== false) {
                    toolbox.cookies.set('lastserver', autoserver.server.value);
                }
            }

            $('select#selectServer').off('change').removeAttr('onchange').on('change', function() {
                Cookies.remove('lastserver');
                location.href = this.value;
            });
            if (kissasian.ui.player.loaded !== false){
                let framelink = kissasian.ui.nav.add('Frame Link', $('#centerDivVideo iframe').attr('src') + '" target="_blank');
            }

            /*let embed = document.createElement('embed');
            $('#centerDivVideo iframe').each(function() {
                for (let i = 0; i < this.attributes.length; i++) {
                    embed.setAttribute(this.attributes[i].name, this.attributes[i].value);
                }
            }).after(embed).remove();*/





        }
    };
    //google search

    var g = {

        img: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAACHFBMVEUAAAD/AAAAf3///39Vqqqqqv//qlWZzP//mZl/v5+fv//+oot/v5TriYnrnImR2qPso5HumZmWufOY1qOc16b1nJOdu/egvffxmoySuPjynZeUz6aaveeb0qb0nZL1mJOU0KL63obxmI/ympL62XmLzZyU0qX723n72XOKzJyPzqDzlI6LzZz0lo70lY2OzqDylYuNzp7zlIuIy5mLzZzyk4uQuPiQt/jykonyjYWIypqMs/eCypb71mX71GPyiX/yioJ+yJPyh3/xhoB5xo2Hsvf61GCGsveFsPeGvcB1w4yCr/b70Vb80VR9rPf80FX70FJ7qffve3H70VbufHN0wonuenH7z1F0w4l8qvfwfHJxwYd4pvZ3qPb8zk5svoNuwYPvdm5qwIHudWnsc2lmu3zvcGXub2Riu3ntal/ta2LtbmNrn/ZguXlmnPVonPXtaF/3xzf6yDdZuHRatnRimvTuY1lgl/TtYFJPs2tStG1blvROtGrqW05KsWRLsGVMsWbqV0vqVkf5whv5wx9Er2BOjvPqUEM7qVlAq11vum7pTD/pTUDpTkHyjk40qFM1qFQ2qVQ2qVU3qVY6q1g7q1k8q1pBrV1ChfRDhfRDhvREhvFEr2NGh/RPkuRYtXpdtmxfo85ntpuXwmnCxE7iwSnqQzXqRDbqRDfqRjXrSDvrSTvrSj3tWj3xfkv4sUv5vAb6wDb7vAX7wRtlQDaiAAAAj3RSTlMAAQICAwMDBQUICAsMDQ0ODg8WGRoaIiMmKCorKy4vNDc3OT09PkpQUlVZW11dXmRoam52d3d4enp+jI6cnJ2goKOkpaamp6msr7S0w8TFxcbIyMjJysrLzM3Nz9DR09bX19zc3+Pl6Onq6urr7Ozs7O/v8fPz8/X29/f4+fn6+/v7/Pz8/f39/v7+/v7+/mQii0sAAAGCSURBVDjLY2AgAcg7J5c1NtUWhFnyYpM2yly+DAZ6gyTQpeXSlqGAHntGFHmD9mXoIEUQSd5iNYb8smw+hLz2Grjwqt4VEEamAEJetBEqW+GkzMjArRfSDdSPbEEURHqNAxtUQCo9C0k/g0ofxN26CCEOPmQfhG9av3LZsuWmuMKPrXnTpo1rlyXiDGCNTUCweZ0STgV2IAWbimDc2HJkYAYU8QUr8IcpyJmBDLyBInFgBW7YFQQSUhAJFPEBKwjArsAPKGILVlCIXYEHUEQdJL90gQJUATsXBOSBFZgDRZhbNm1aMr0/HtXzknNB8jPFQezgDYv7+/snGKMoiAEbUApmK3b1g0CnDpK8NcQJ7hBeNFhB/1RHFqg0p+cssHybEIQvXA9R0V/posrEwKPpVde/aDZIgSvMQK1p/TAwqQNCz583Y0Y+K9xKk6n96GDOwmoxJEfpt2KoKJFB8ZZ0Kqr05FB+9HRhmDERLj0lSQ1b0pG1SSiuaajKjbASISHLAwCGrRNmhWfeqwAAAABJRU5ErkJggg==`,
        init: function() {
            if (document.location.href.indexOf('id=') !== -1) {
                return;
            }
            if (document.location.href.indexOf('/Drama/') === -1 && document.location.href.indexOf('/Anime/') === -1) {
                return;
            }

            title = $('a.bigChar').first().text().trim();
            target = link = $('a.bigChar').first().parent('div');
            link = $('a.bigChar').first().clone();
            $('a.bigChar').first().remove();
            target.prepend(link).prepend('<a class="bigChar" target="_blank" href="https://google.com/search?q=' + title + '"><img src="' + g.img + '" />');
        }
    };


    /**
     * @link https://www.pexels.com/blog/css-only-loaders/ CSS Only Loaders
     */
    var cssloader = {
        css: `.cssloader{margin:50px;height:28px;width:28px;animation:rotate .8s infinite linear;border:8px solid #fff;border-right-color:transparent;border-radius:50%}@keyframes rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}div#spinner{display : block;position : fixed;z-index: 100;background-color: #000; opacity: 0.8; background-repeat : no-repeat;background-position : center;left : 0;bottom : 0;right : 0;  top : 0;}div#spinner > div{z-index : 101;position: absolute; top: 50%; left:50%; margin: -14px 0 0 -14px; opacity:1; color: #fff;}`,

        show: function() {
            if (typeof cssloader.loader === 'undefined') {
                toolbox.ui.addcss(cssloader.css);
                cssloader.loader = document.createElement('div');
                cssloader.loader.setAttribute('id', 'spinner');
                loader = document.createElement('div');
                loader.setAttribute('class', 'cssloader');
                cssloader.loader.appendChild(loader);

            }
            document.body.appendChild(cssloader.loader);
        },
        hide: function() {
            document.body.removeChild(cssloader.loader);

        }
    };

    /**
     * @link http://alertifyjs.com
     */
    notify = {
        settings: {
            // dialogs defaults
            autoReset: true,
            basic: false,
            closable: false,
            closableByDimmer: true,
            frameless: false,
            maintainFocus: true, // <== global default not per instance, applies to all dialogs
            maximizable: true,
            modal: true,
            movable: true,
            moveBounded: false,
            overflow: true,
            padding: true,
            pinnable: true,
            pinned: true,
            preventBodyShift: false, // <== global default not per instance, applies to all dialogs
            resizable: true,
            startMaximized: false,
            transition: 'pulse',

            // notifier defaults
            notifier: {
                // auto-dismiss wait time (in seconds)
                delay: 5,
                // default position
                position: 'bottom-right',
                // adds a close button to notifier messages
                closeButton: false
            },

            // language resources
            glossary: {
                // dialogs default title
                title: 'Userscript',
                // ok button text
                ok: 'Yes',
                // cancel button text
                cancel: 'No'
            },
            // theme settings
            theme: {
                // class name attached to prompt dialog input textbox.
                input: 'ajs-input',
                // class name attached to ok button
                ok: 'ajs-ok',
                // class name attached to cancel button
                cancel: 'ajs-cancel'
            }

        },
        ready: false,
        onready: function() {},
        loadsettings: function() {
            alertify.defaults = notify.settings;

        },
        init: function(fn = null) {
            if (notify.ready !== false) {
                return;
            }
            toolbox.ui.loadcss('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/css/alertify.min.css');
            toolbox.ui.loadcss('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/css/themes/default.min.css');
            toolbox.ui.addscript('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/alertify.min.js');
            if (typeof (fn) === 'function') {
                notify.onready = fn;
            }

            ninterval = setInterval(function() {
                if (typeof alertify !== 'undefined') {
                    clearInterval(ninterval);
                    notify.ready = true;
                    notify.loadsettings();
                    notify.onready();
                }
            }, toolbox.interval);
        }
    };

    toolbox.onload = function() {

        if (document.querySelector('img[alt = "KissCartoon"]') !== null || document.querySelector('img[alt = "jadopado"]') !== null) {
            console.debug('Running man, ignoring script execution');
            toolbox.load = function() {};
            toolbox.exec = true;
            return;
        }

        if (document.getElementById('containerRoot') === null) {
            console.debug('No Container root, stopping script execution');
            toolbox.load = function() {};
            toolbox.exec = true;
            return;
        }

        toolbox.loader.onshow = cssloader.show;
        toolbox.loader.onhide = cssloader.hide;
        toolbox.loader.show();
        toolbox.ui.addcss(kissasian.ui.css);
        //toolbox.cookies.onready = kissasian.init;
        toolbox.cookies.onready = notify.init;
        notify.onready = kissasian.init;

    };
    toolbox.init(toolbox.cookies.init);
})(document);

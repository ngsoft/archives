// ==UserScript==
// @name        ViKi+
// @namespace   https://github.com/ngsoft
// @version     6.0
// @description Viki+
// @author      daedelus
// @noframes
// @require     https://cdn.jsdelivr.net/npm/subtitle@latest/dist/subtitle.bundle.min.js
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/myviki.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/myviki.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// @match       *://www.viki.com/*
// @icon        https://www.viki.com/favicon.ico
// ==/UserScript==

(function(doc, $, undef) {

    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;


    /**
     * @link https://stackoverflow.com/questions/32225904/programmatical-click-on-a-tag-not-working-in-firefox
     * @param {string} text
     * @param {string} filename
     */
    function createBlob(text, filename) {
        let blob = new Blob([text], {type: "application/octet-stream"}),
                link = doc.createElement("a"),
                href = URL.createObjectURL(blob);
        link.href = href;
        link.download = filename;
        link.dispatchEvent(new MouseEvent(`click`));
    }
    /**
     * Convert vtt to SRT
     * @param {string} vtt
     * @returns {string|undefined}
     */
    function convertToSrt(vtt) {
        let parsed;
        if (Array.isArray((parsed = Subtitle.parse(vtt)))) {
            return Subtitle.stringify(parsed);
        }
    }


    function onReady(fn) {
        if (doc.readyState != 'loading') {
            fn();
        } else {
            doc.addEventListener('DOMContentLoaded', fn);
        }
    }

    function addCSS(css) {
        let s = document.createElement('style');
        s.setAttribute('type', "text/css");
        s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
        doc.head.appendChild(s);
    }

    function listLocales() {
        return Array.from($('link[hreflang][href*="locale="]')).map(x => x.hreflang);
    }

    function switchLocale(newlocale) {
        if (newlocale.length < 1) {
            doc.location.hash = '#modal-site-language';
            return;
        }
        if (typeof sessionStorage.activesession === "undefined") {
            sessionStorage.activesession = true;
            let url = new URL(doc.location.href);
            url.searchParams.set('locale', newlocale);
            doc.location.replace(url.href);
        }
    }

    class UserSettings {
        constructor(defaults) {
            if (typeof defaults === 'object') {
                Object.keys(defaults).forEach(function (k) {
                    if (typeof GM_getValue(k) !== typeof defaults[k]) {
                        this.set(k, defaults[k]);
                    }
                }, this);
            }
        }
        get(key) {
            return GM_getValue(key);
        }
        set(key, val) {
            GM_setValue(key, val);
            return this;
        }
    }

    /**
     * As 6.0  dropping support for server
     * using Subtiles.js to convert and corrected blob downloader
     */
    let defaults = {
        locale: '',
        langs: ['en', 'fr'],
        converter: false
    }, settings = new UserSettings(defaults);

    /**
     * Easy access to datasets
     */
    $.fn.dataset = function (k, v) {
        let r = this;

        if (typeof k === "string") {
            //set
            if (typeof v !== typeof undef) {
                this.each(function () {
                    if (v === null) {
                        delete(this.dataset[k]);
                        return;
                    }
                    if (this.dataset) {
                        this.dataset[k] = typeof v === "string" ? v : JSON.stringify(v);
                    }

                });
            } else if (arguments.length > 1) {
                console.warn('$.fn.dataset(' + k + ', undef) trying to set undefined value into dataset.', arguments, this);
                return r;
            } else if (this.length > 0) {
                r = undef;
                if (typeof this[0].dataset[k] !== typeof undef) {
                    try {
                        r = JSON.parse(this[0].dataset[k]);
                    } catch (e) {
                        r = this[0].dataset[k];
                    }
                }
            }
        } else if (typeof k === "object" && Object.keys(k).length > 0 && typeof v === typeof undef) {

            for (let key of Object.keys(k)) {
                let val = k[key];
                this.dataset(key, val);
            }
        }
        return r;
    };


    /**
     * trigger all events related to the target
     */
    $.fn.triggerAll = function (eventType, extraParameters) {
        if (typeof eventType === "string" && eventType.length > 0) {

            this.each(function () {
                let data = $._data(this, "events"),
                    that = this;
                if (typeof data === "object") {
                    eventType.split(' ').forEach(function (event) {
                        let aevent = event.split('.');
                        let evt = aevent.shift(),
                            ns = aevent.join('.');
                        if (data[evt]) {
                            data[evt].forEach(function (e) {
                                if (e.namespace !== ns) {
                                    return;
                                }
                                if (!e.selector) {
                                    $(that).trigger(event, extraParameters);
                                    return;
                                }
                                $(that).find(e.selector).trigger(event, extraParameters);
                            });
                        }
                    });

                }
            });
        }
        return this;
    };


    /**
     * App Style
     */
    addCSS(`
        div.ads, div.ad, div.ad-1, div[id*="-ad-"], .hidden{position: fixed; top:-100%;right: -100%; height:1px; width:1px; opacity: 0; z-index: -1;}
        /* CustomSelect Box */
        .select-wrapper{display: inline-block;position: relative; width: 100%;}
        .select-wrapper:not(.custom) > *:not(select){position: absolute;width: 1px;height: 1px;padding: 0;overflow: hidden;clip: rect(0, 0, 0, 0);white-space: nowrap;border: 0;}
        .select-wrapper select, .search-wrapper [type="text"]{-webkit-appearance: none;-moz-appearance: none;-ms-appearance: none;-o-appearance: none;appearance: none;width: 100%!important;border: 1px solid;height: calc(2.25rem + 2px);display: inline-block;}
        .select-wrapper:not(.no-caret):after{content: "▼";position: absolute;right:.35rem;top: 50%;line-height:0;transform: translate(0, -50%);pointer-events: none;}
        .select-wrapper{color: #0D5995;}
        .select-wrapper select {min-width: 12.5rem; }
        .select-wrapper select:not(.form-control){ padding: .375rem .75rem;font-size: 1rem;text-align: center;color: inherit;border-color: #0D5995;background-color: rgba(255,255,255,1);}
        .select-wrapper.rounded select {padding-left: 1.5rem;padding-right: 1.5rem;}
        .select-wrapper.rounded:after{transform: translate(-.2rem, 50%);}
        .select-wrapper.rounded select {border-radius: 2rem;}
        /* switch */
       .switch,.switch .slider {position: relative;display: inline-block;}
       .switch [type="checkbox"] {opacity: 0;z-index: 2;}
       .switch [type="checkbox"],.switch .slider:after {position: absolute;top: 0;right: 0;left: 0;bottom: 0;min-width: 100%;min-height: 100%;cursor: pointer;}
       .switch .slider:after,.switch .slider:before {-webkit-transition: 0.25s;transition: 0.25s;content: "";position: absolute;}
       .switch .slider {width: 4rem;height: 2rem;vertical-align: middle;}
       .switch .slider:before {z-index:1;height: 1.5rem;width: 1.5rem;left: .25rem;bottom: .25rem;}
       .switch [type="checkbox"]:checked + .slider:before {-webkit-transform: translateX(2rem);-ms-transform: translateX(2rem);transform: translateX(2rem);}
       .switch.round .slider:after{border-radius: 2rem;}
       .switch.round .slider:before {border-radius: 50%;}
       /** colors **/
       .switch [type="checkbox"]:checked + .slider:after {background-color: rgba(0, 123, 255, 1);}
       .switch [type="checkbox"]:focus + .slider:after {box-shadow: 0 0 1px rgba(0, 123, 255, 1);}
       .switch .slider:before {background-color: rgba(255, 255, 255, 1);}
       .switch .slider:after {background-color: rgba(108, 117, 125, 1);}
       /** sizes **/
       .switch .slider{transform: scale(.75,.75);}
       .switch-sm .slider{transform: scale(.55,.55);}
       .switch-md .slider{transform: scale(.9,.9);}
       .switch-lg .slider{transform: scale(1.1,1.1);}

        /** .dl-subs styles **/
        .dl-subs{position: relative;margin-top: -.8rem;font-size: 1.2rem;}
        .dl-subs .select-wrapper{padding: 0;}
        .dl-subs .select-wrapper select{font-size: 1.2rem;padding-top:0;font-style: normal !important;cursor: pointer;}
        .dl-subs .select-wrapper:after{font-size: 1rem;}
        .dl-subs .switch{padding:0; transform: translate(0,.25rem);}
        .dl-subs option{color: #000; font-weight: bold; }
        .dl-subs + a, .dl-subs .switch .label{display: none;}
        .dl-subs .switch:hover .label{display: inline-block;}
    `);


    $(doc).ready(function () {

        switchLocale(settings.get('locale'));


        /**
         * .switch
         */
        $(doc).on('init.switch', '.switch [type="checkbox"]', function () {
            this.checked = $(this).dataset('default') === true;
            let input = $(this),
                slider;
            if (input.length > 0) {
                slider = input.next('.slider');
                if (slider.length === 0) {
                    slider = $('<span class="slider" />');
                    input.after(slider);
                }
            }
            $(this).trigger('ready.switch');

        }).on('ready.doc', '.switch [type="checkbox"]', function () {
            $(this).trigger('init.switch');
            return false;
        }).on('reset.form', '.switch [type="checkbox"]', function () {
            this.checked = $(this).dataset('default') === true;
        });

        /**
         * .select-wrapper
         */
        $(doc).on('ready.doc', '.select-wrapper select', function (e) {
            $(this).trigger('init.select');
            return false;
        }).on('init.select', '.select-wrapper select', function () {
            let s = this;
            let p = $(s).dataset('placeholder') || "";
            if (p.length > 0) {
                $(s).children('option[value=""]').remove();
                $(s).addClass('placeholder');
                let o = $(`<option value="" disabled hidden selected/>`);
                $(s).prepend(o);
                o.html(p);
                this.selectedIndex = 0;
            }
            $(s).trigger('ready.select');

        }).on('reset.form', '.select-wrapper select', function () {
            this.selectedIndex = 0;
            $(this).trigger('init.select');
        }).on('change', '.select-wrapper select', function () {
            $(this).removeClass('placeholder');
        });

        /**
         * Locale Selection
         */
        $(doc).on('click', `div[data-react-class="modalApp.ModalSiteLanguage"] a.pad.inline-block`, function (e) {
            e.preventDefault();
            let url = new URL(this.href);
            let locale = url.searchParams.get('locale');
            if (listLocales().indexOf(locale) !== -1) {
                settings.set('locale', locale);
                sessionStorage.removeItem('activesession');
                setTimeout(x => switchLocale(locale), 200);
            }
            // Close Site Modal
            $(this).parents('.modal').find('.icon-x').click();
        });




        /**
         * Subtitles download
         */
        if (/^\/videos\//i.test(doc.location.pathname)) {

            console.debug(scriptname, "Started");

            //let target = $('.card .card-content .row div.info');
            let target = $(`.video-meta .video-title`);
            let sbox = $(`<div class="dl-subs">
                            <span class="select-wrapper col s9 m9 l9">
                                <label>Subtitles</label>
                                <select title="Select Subtitles" name="subdl"></select>
                            </span>
                            <span class="switch round col s3 m3 l3">
                                <input type="checkbox" name="subconvert" title="Convert SRT"/>
                                <span class="label">Use SRT</span>
                            </span>
                        </div>`);
            target.prepend(sbox);

            let select = $('select[name="subdl"]'),
                convert = $('input[name="subconvert"]');
            convert.dataset('default', settings.get('converter')).on('change', function () {
                settings.set('converter', this.checked);
                select.trigger('reset.form');
                return false;
            });

            select.dataset('placeholder', $('.video-meta .video-title a').text()).on('change', function () {
                if (!this.value) {
                    return;
                }
                let opt = $(this).find(':selected');
                let filename = opt.dataset('title');
                if (opt.dataset('type') !== 'episode') {
                    filename += '.' + opt.dataset('type');

                } else {
                    filename += '.E';
                    if (opt.dataset('number') < 10) {
                        filename += '0';
                    }
                    filename += opt.dataset('number');
                }

                filename += '.' + opt.dataset('locale');

                /**
                 * @link https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
                 */
                fetch(this.value, {cache: "no-store", redirect: 'follow'})
                        .then(r => {
                            if (r.status === 200) {
                                r.text().then(text => {
                                    let ext = ".vtt", txt = text;
                                    if (settings.get("converter") === true) {
                                        txt = convertToSrt(text);
                                        ext = ".srt";
                                    }
                                    createBlob(txt, filename + ext);
                                });
                            }
                            select.trigger('reset.form');
                        }).catch(ex => console.error(ex));

                return false;
            });


            /**
             * Populate select box
             */
            if (typeof parsedSubtitles !== typeof undef && typeof video_json !== typeof undef) {
                let subs = parsedSubtitles,
                    infos = video_json,
                    selection = [];
                if (settings.get('langs') && Array.isArray(settings.get('langs')) && settings.get('langs').length > 0) {
                    selection = settings.get('langs');
                }
                subs.forEach(function (x) {
                    if (selection.length > 0 && selection.indexOf(x.srclang) === -1) {
                        return;
                    }
                    let displaylang = x.label.split('<');
                    displaylang = displaylang[0].trim();
                    let opt = $('<option/>').val(x.src).dataset({
                        locale: x.srclang,
                        percent: x.percentage,
                        title: infos.container.titles[x.srclang] ? infos.container.titles[x.srclang] : infos.container.titles.en,
                        number: infos.number,
                        type: infos.type,
                        displaylang: displaylang

                    }).html(displaylang + ' (' + x.percentage + '%)');
                    select.append(opt);

                });

            }
        }
        $(doc).triggerAll('ready.doc');
    });



})(document, jQuery);
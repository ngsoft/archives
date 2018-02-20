// ==UserScript==
// @name         Viki Subs
// @namespace    https://github.com/ngsoft
// @version      2.0
// @description  Get Viki Subtitles
// @author       daedelus
// @match        https://www.viki.com/videos/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/viki.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/viki.user.js
// ==/UserScript==

window.open = function() {};
window.eval = function() {};

(function() {

    /**
     * Userscript library
     */

    var toolbox = {
        //runonce (prevent loop execution on error)
        exec: false,
        //interval for jquery check
        interval: 50,

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
            set: function(name, value) {
                toolbox.cookies.data[name] = value;
                if (toolbox.cookies.ready === false) {
                    return;
                }
                Cookies.set(name, value, {expires: toolbox.cookies.expire});
            },

            init: function() {
                toolbox.ui.addscript('https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js');
                waitforcookies = setInterval(function() {
                    if (typeof Cookies !== 'undefined') {
                        clearInterval(waitforcookies);
                        toolbox.cookies.ready = true;
                    }
                }, toolbox.interval);
            }
        },
        init: function(fn, interval = 50) {
            toolbox.interval = interval;
            toolbox.ready(fn);
        },
        onload: function() {},
        load: function() {},
        wait: function() {
            toolbox.onload();

            interval = setInterval(function() {
                if (toolbox.exec === true) {
                    clearInterval(interval);
                    return;
                }
                if (typeof jQuery !== 'undefined') {
                    if (toolbox.exec === false) {
                        clearInterval(interval);
                        (function($) {
                            $(document).ready(toolbox.load);
                            toolbox.exec = true;
                        })(jQuery);
                    }
                }
            }, toolbox.interval);
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

    var vikisubs = {
        //set your prefered country codes
        //if empty will display all available languages
        filter: ["en", "fr"],
        //country codes
        countries: '',
        //clone of the PLUS menu on top of the site
        dropdown: `<li class="navbar-dropdown-item navbar-more navbar-item uppercase"><a class="navbar-dropdown">Subtitles<i class="icon-caret-down mls"></i></a><ul class="navbar-dropdown-container"></ul></li>`,
        //mobile counterpart
        mobile: `<li class="navbar-divider hide-on-large"></li><li class="navbar-item hide-on-large"><a href="#">Subtitles</a><ul class="navbar-expanded-secondary"></ul></li>`,
        //contains the links
        dropdownitem: `<li><a class="subtitle-link-tamper" target="_blank"></a></li>`,
        //a divider, not used yet
        divider: `<li class="navbar-divider"></li>`,
        //some display fixes
        css: `
                .list-inline .navbar-more{vertical-align: middle;}
            `,
        //add a link to a subtitle
        addsub: function(src, lang, percent) {
            if (typeof vikisubs.countries[lang] !== 'undefined') {
                if (vikisubs.filter.length) {
                    if (vikisubs.filter.indexOf(lang) === -1) {
                        return;
                    }
                }
                displaylang = vikisubs.countries[lang].nativeName;
                displaylang = displaylang.split(',');
                displaylang = displaylang[0].trim();
                txt = displaylang + " (" + percent + "%)";
                link = vikisubs.dropdownitem.clone();
                link.find('a').attr('href', src).attr('data-lang', lang).html(txt);
                vikisubs.dropdown.find('ul').append(link);
            }
        },
        //initialize the blackscript
        run: function() {
            $(document).ready(function() {
                toolbox.ui.addcss(vikisubs.css);
                vikisubs.dropdown = $(vikisubs.dropdown);
                vikisubs.dropdownitem = $(vikisubs.dropdownitem);
                vikisubs.mobile = $(vikisubs.mobile);
                $('#secondary-navbar .list-inline').append(vikisubs.dropdown);
                $('.navbar-primary .navbar-group-start').append(vikisubs.mobile);
                vikisubs.countries = $.parseJSON('{"ab":{"name":"Abkhaz","nativeName":"\u0430\u04a7\u0441\u0443\u0430"},"aa":{"name":"Afar","nativeName":"Afaraf"},"af":{"name":"Afrikaans","nativeName":"Afrikaans"},"ak":{"name":"Akan","nativeName":"Akan"},"sq":{"name":"Albanian","nativeName":"Shqip"},"am":{"name":"Amharic","nativeName":"\u12a0\u121b\u122d\u129b"},"ar":{"name":"Arabic","nativeName":"\u0627\u0644\u0639\u0631\u0628\u064a\u0629"},"an":{"name":"Aragonese","nativeName":"Aragon\u00e9s"},"hy":{"name":"Armenian","nativeName":"\u0540\u0561\u0575\u0565\u0580\u0565\u0576"},"as":{"name":"Assamese","nativeName":"\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be"},"av":{"name":"Avaric","nativeName":"\u0430\u0432\u0430\u0440 \u043c\u0430\u0446\u04c0, \u043c\u0430\u0433\u04c0\u0430\u0440\u0443\u043b \u043c\u0430\u0446\u04c0"},"ae":{"name":"Avestan","nativeName":"avesta"},"ay":{"name":"Aymara","nativeName":"aymar aru"},"az":{"name":"Azerbaijani","nativeName":"az\u0259rbaycan dili"},"bm":{"name":"Bambara","nativeName":"bamanankan"},"ba":{"name":"Bashkir","nativeName":"\u0431\u0430\u0448\u04a1\u043e\u0440\u0442 \u0442\u0435\u043b\u0435"},"eu":{"name":"Basque","nativeName":"euskara, euskera"},"be":{"name":"Belarusian","nativeName":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f"},"bn":{"name":"Bengali","nativeName":"\u09ac\u09be\u0982\u09b2\u09be"},"bh":{"name":"Bihari","nativeName":"\u092d\u094b\u091c\u092a\u0941\u0930\u0940"},"bi":{"name":"Bislama","nativeName":"Bislama"},"bs":{"name":"Bosnian","nativeName":"bosanski jezik"},"br":{"name":"Breton","nativeName":"brezhoneg"},"bg":{"name":"Bulgarian","nativeName":"\u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438 \u0435\u0437\u0438\u043a"},"my":{"name":"Burmese","nativeName":"\u1017\u1019\u102c\u1005\u102c"},"ca":{"name":"Catalan; Valencian","nativeName":"Catal\u00e0"},"ch":{"name":"Chamorro","nativeName":"Chamoru"},"ce":{"name":"Chechen","nativeName":"\u043d\u043e\u0445\u0447\u0438\u0439\u043d \u043c\u043e\u0442\u0442"},"ny":{"name":"Chichewa; Chewa; Nyanja","nativeName":"chiChe\u0175a, chinyanja"},"zh":{"name":"Chinese","nativeName":"\u4e2d\u6587 (Zh\u014dngw\u00e9n), \u6c49\u8bed, \u6f22\u8a9e"},"cv":{"name":"Chuvash","nativeName":"\u0447\u04d1\u0432\u0430\u0448 \u0447\u04d7\u043b\u0445\u0438"},"kw":{"name":"Cornish","nativeName":"Kernewek"},"co":{"name":"Corsican","nativeName":"corsu, lingua corsa"},"cr":{"name":"Cree","nativeName":"\u14c0\u1426\u1403\u152d\u140d\u140f\u1423"},"hr":{"name":"Croatian","nativeName":"hrvatski"},"cs":{"name":"Czech","nativeName":"\u010desky, \u010de\u0161tina"},"da":{"name":"Danish","nativeName":"dansk"},"dv":{"name":"Divehi; Dhivehi; Maldivian;","nativeName":"\u078b\u07a8\u0788\u07ac\u0780\u07a8"},"nl":{"name":"Dutch","nativeName":"Nederlands, Vlaams"},"en":{"name":"English","nativeName":"English"},"eo":{"name":"Esperanto","nativeName":"Esperanto"},"et":{"name":"Estonian","nativeName":"eesti, eesti keel"},"ee":{"name":"Ewe","nativeName":"E\u028begbe"},"fo":{"name":"Faroese","nativeName":"f\u00f8royskt"},"fj":{"name":"Fijian","nativeName":"vosa Vakaviti"},"fi":{"name":"Finnish","nativeName":"suomi, suomen kieli"},"fr":{"name":"French","nativeName":"fran\u00e7ais, langue fran\u00e7aise"},"ff":{"name":"Fula; Fulah; Pulaar; Pular","nativeName":"Fulfulde, Pulaar, Pular"},"gl":{"name":"Galician","nativeName":"Galego"},"ka":{"name":"Georgian","nativeName":"\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8"},"de":{"name":"German","nativeName":"Deutsch"},"el":{"name":"Greek, Modern","nativeName":"\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac"},"gn":{"name":"Guaran\u00ed","nativeName":"Ava\u00f1e\u1ebd"},"gu":{"name":"Gujarati","nativeName":"\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0"},"ht":{"name":"Haitian; Haitian Creole","nativeName":"Krey\u00f2l ayisyen"},"ha":{"name":"Hausa","nativeName":"Hausa, \u0647\u064e\u0648\u064f\u0633\u064e"},"he":{"name":"Hebrew (modern)","nativeName":"\u05e2\u05d1\u05e8\u05d9\u05ea"},"hz":{"name":"Herero","nativeName":"Otjiherero"},"hi":{"name":"Hindi","nativeName":"\u0939\u093f\u0928\u094d\u0926\u0940, \u0939\u093f\u0902\u0926\u0940"},"ho":{"name":"Hiri Motu","nativeName":"Hiri Motu"},"hu":{"name":"Hungarian","nativeName":"Magyar"},"ia":{"name":"Interlingua","nativeName":"Interlingua"},"id":{"name":"Indonesian","nativeName":"Bahasa Indonesia"},"ie":{"name":"Interlingue","nativeName":"Originally called Occidental; then Interlingue after WWII"},"ga":{"name":"Irish","nativeName":"Gaeilge"},"ig":{"name":"Igbo","nativeName":"As\u1ee5s\u1ee5 Igbo"},"ik":{"name":"Inupiaq","nativeName":"I\u00f1upiaq, I\u00f1upiatun"},"io":{"name":"Ido","nativeName":"Ido"},"is":{"name":"Icelandic","nativeName":"\u00cdslenska"},"it":{"name":"Italian","nativeName":"Italiano"},"iu":{"name":"Inuktitut","nativeName":"\u1403\u14c4\u1483\u144e\u1450\u1466"},"ja":{"name":"Japanese","nativeName":"\u65e5\u672c\u8a9e (\u306b\u307b\u3093\u3054\uff0f\u306b\u3063\u307d\u3093\u3054)"},"jv":{"name":"Javanese","nativeName":"basa Jawa"},"kl":{"name":"Kalaallisut, Greenlandic","nativeName":"kalaallisut, kalaallit oqaasii"},"kn":{"name":"Kannada","nativeName":"\u0c95\u0ca8\u0ccd\u0ca8\u0ca1"},"kr":{"name":"Kanuri","nativeName":"Kanuri"},"ks":{"name":"Kashmiri","nativeName":"\u0915\u0936\u094d\u092e\u0940\u0930\u0940, \u0643\u0634\u0645\u064a\u0631\u064a\u200e"},"kk":{"name":"Kazakh","nativeName":"\u049a\u0430\u0437\u0430\u049b \u0442\u0456\u043b\u0456"},"km":{"name":"Khmer","nativeName":"\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a"},"ki":{"name":"Kikuyu, Gikuyu","nativeName":"G\u0129k\u0169y\u0169"},"rw":{"name":"Kinyarwanda","nativeName":"Ikinyarwanda"},"ky":{"name":"Kirghiz, Kyrgyz","nativeName":"\u043a\u044b\u0440\u0433\u044b\u0437 \u0442\u0438\u043b\u0438"},"kv":{"name":"Komi","nativeName":"\u043a\u043e\u043c\u0438 \u043a\u044b\u0432"},"kg":{"name":"Kongo","nativeName":"KiKongo"},"ko":{"name":"Korean","nativeName":"\ud55c\uad6d\uc5b4 (\u97d3\u570b\u8a9e), \uc870\uc120\ub9d0 (\u671d\u9bae\u8a9e)"},"ku":{"name":"Kurdish","nativeName":"Kurd\u00ee, \u0643\u0648\u0631\u062f\u06cc\u200e"},"kj":{"name":"Kwanyama, Kuanyama","nativeName":"Kuanyama"},"la":{"name":"Latin","nativeName":"latine, lingua latina"},"lb":{"name":"Luxembourgish, Letzeburgesch","nativeName":"L\u00ebtzebuergesch"},"lg":{"name":"Luganda","nativeName":"Luganda"},"li":{"name":"Limburgish, Limburgan, Limburger","nativeName":"Limburgs"},"ln":{"name":"Lingala","nativeName":"Ling\u00e1la"},"lo":{"name":"Lao","nativeName":"\u0e9e\u0eb2\u0eaa\u0eb2\u0ea5\u0eb2\u0ea7"},"lt":{"name":"Lithuanian","nativeName":"lietuvi\u0173 kalba"},"lu":{"name":"Luba-Katanga","nativeName":""},"lv":{"name":"Latvian","nativeName":"latvie\u0161u valoda"},"gv":{"name":"Manx","nativeName":"Gaelg, Gailck"},"mk":{"name":"Macedonian","nativeName":"\u043c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438 \u0458\u0430\u0437\u0438\u043a"},"mg":{"name":"Malagasy","nativeName":"Malagasy fiteny"},"ms":{"name":"Malay","nativeName":"bahasa Melayu, \u0628\u0647\u0627\u0633 \u0645\u0644\u0627\u064a\u0648\u200e"},"ml":{"name":"Malayalam","nativeName":"\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02"},"mt":{"name":"Maltese","nativeName":"Malti"},"mi":{"name":"M\u0101ori","nativeName":"te reo M\u0101ori"},"mr":{"name":"Marathi (Mar\u0101\u1e6dh\u012b)","nativeName":"\u092e\u0930\u093e\u0920\u0940"},"mh":{"name":"Marshallese","nativeName":"Kajin M\u0327aje\u013c"},"mn":{"name":"Mongolian","nativeName":"\u043c\u043e\u043d\u0433\u043e\u043b"},"na":{"name":"Nauru","nativeName":"Ekakair\u0169 Naoero"},"nv":{"name":"Navajo, Navaho","nativeName":"Din\u00e9 bizaad, Din\u00e9k\u02bceh\u01f0\u00ed"},"nb":{"name":"Norwegian Bokm\u00e5l","nativeName":"Norsk bokm\u00e5l"},"nd":{"name":"North Ndebele","nativeName":"isiNdebele"},"ne":{"name":"Nepali","nativeName":"\u0928\u0947\u092a\u093e\u0932\u0940"},"ng":{"name":"Ndonga","nativeName":"Owambo"},"nn":{"name":"Norwegian Nynorsk","nativeName":"Norsk nynorsk"},"no":{"name":"Norwegian","nativeName":"Norsk"},"ii":{"name":"Nuosu","nativeName":"\ua188\ua320\ua4bf Nuosuhxop"},"nr":{"name":"South Ndebele","nativeName":"isiNdebele"},"oc":{"name":"Occitan","nativeName":"Occitan"},"oj":{"name":"Ojibwe, Ojibwa","nativeName":"\u140a\u14c2\u1511\u14c8\u142f\u14a7\u140e\u14d0"},"cu":{"name":"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic","nativeName":"\u0469\u0437\u044b\u043a\u044a \u0441\u043b\u043e\u0432\u0463\u043d\u044c\u0441\u043a\u044a"},"om":{"name":"Oromo","nativeName":"Afaan Oromoo"},"or":{"name":"Oriya","nativeName":"\u0b13\u0b21\u0b3c\u0b3f\u0b06"},"os":{"name":"Ossetian, Ossetic","nativeName":"\u0438\u0440\u043e\u043d \u00e6\u0432\u0437\u0430\u0433"},"pa":{"name":"Panjabi, Punjabi","nativeName":"\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40, \u067e\u0646\u062c\u0627\u0628\u06cc\u200e"},"pi":{"name":"P\u0101li","nativeName":"\u092a\u093e\u0934\u093f"},"fa":{"name":"Persian","nativeName":"\u0641\u0627\u0631\u0633\u06cc"},"pl":{"name":"Polish","nativeName":"polski"},"ps":{"name":"Pashto, Pushto","nativeName":"\u067e\u069a\u062a\u0648"},"pt":{"name":"Portuguese","nativeName":"Portugu\u00eas"},"qu":{"name":"Quechua","nativeName":"Runa Simi, Kichwa"},"rm":{"name":"Romansh","nativeName":"rumantsch grischun"},"rn":{"name":"Kirundi","nativeName":"kiRundi"},"ro":{"name":"Romanian, Moldavian, Moldovan","nativeName":"rom\u00e2n\u0103"},"ru":{"name":"Russian","nativeName":"\u0440\u0443\u0441\u0441\u043a\u0438\u0439 \u044f\u0437\u044b\u043a"},"sa":{"name":"Sanskrit (Sa\u1e41sk\u1e5bta)","nativeName":"\u0938\u0902\u0938\u094d\u0915\u0943\u0924\u092e\u094d"},"sc":{"name":"Sardinian","nativeName":"sardu"},"sd":{"name":"Sindhi","nativeName":"\u0938\u093f\u0928\u094d\u0927\u0940, \u0633\u0646\u068c\u064a\u060c \u0633\u0646\u062f\u06be\u06cc\u200e"},"se":{"name":"Northern Sami","nativeName":"Davvis\u00e1megiella"},"sm":{"name":"Samoan","nativeName":"gagana faa Samoa"},"sg":{"name":"Sango","nativeName":"y\u00e2ng\u00e2 t\u00ee s\u00e4ng\u00f6"},"sr":{"name":"Serbian","nativeName":"\u0441\u0440\u043f\u0441\u043a\u0438 \u0458\u0435\u0437\u0438\u043a"},"gd":{"name":"Scottish Gaelic; Gaelic","nativeName":"G\u00e0idhlig"},"sn":{"name":"Shona","nativeName":"chiShona"},"si":{"name":"Sinhala, Sinhalese","nativeName":"\u0dc3\u0dd2\u0d82\u0dc4\u0dbd"},"sk":{"name":"Slovak","nativeName":"sloven\u010dina"},"sl":{"name":"Slovene","nativeName":"sloven\u0161\u010dina"},"so":{"name":"Somali","nativeName":"Soomaaliga, af Soomaali"},"st":{"name":"Southern Sotho","nativeName":"Sesotho"},"es":{"name":"Spanish; Castilian","nativeName":"espa\u00f1ol, castellano"},"su":{"name":"Sundanese","nativeName":"Basa Sunda"},"sw":{"name":"Swahili","nativeName":"Kiswahili"},"ss":{"name":"Swati","nativeName":"SiSwati"},"sv":{"name":"Swedish","nativeName":"svenska"},"ta":{"name":"Tamil","nativeName":"\u0ba4\u0bae\u0bbf\u0bb4\u0bcd"},"te":{"name":"Telugu","nativeName":"\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41"},"tg":{"name":"Tajik","nativeName":"\u0442\u043e\u04b7\u0438\u043a\u04e3, to\u011fik\u012b, \u062a\u0627\u062c\u06cc\u06a9\u06cc\u200e"},"th":{"name":"Thai","nativeName":"\u0e44\u0e17\u0e22"},"ti":{"name":"Tigrinya","nativeName":"\u1275\u130d\u122d\u129b"},"bo":{"name":"Tibetan Standard, Tibetan, Central","nativeName":"\u0f56\u0f7c\u0f51\u0f0b\u0f61\u0f72\u0f42"},"tk":{"name":"Turkmen","nativeName":"T\u00fcrkmen, \u0422\u04af\u0440\u043a\u043c\u0435\u043d"},"tl":{"name":"Tagalog","nativeName":"Wikang Tagalog, \u170f\u1712\u1703\u1705\u1714 \u1706\u1704\u170e\u1713\u1704\u1714"},"tn":{"name":"Tswana","nativeName":"Setswana"},"to":{"name":"Tonga (Tonga Islands)","nativeName":"faka Tonga"},"tr":{"name":"Turkish","nativeName":"T\u00fcrk\u00e7e"},"ts":{"name":"Tsonga","nativeName":"Xitsonga"},"tt":{"name":"Tatar","nativeName":"\u0442\u0430\u0442\u0430\u0440\u0447\u0430, tatar\u00e7a, \u062a\u0627\u062a\u0627\u0631\u0686\u0627\u200e"},"tw":{"name":"Twi","nativeName":"Twi"},"ty":{"name":"Tahitian","nativeName":"Reo Tahiti"},"ug":{"name":"Uighur, Uyghur","nativeName":"Uy\u01a3urq\u0259, \u0626\u06c7\u064a\u063a\u06c7\u0631\u0686\u06d5\u200e"},"uk":{"name":"Ukrainian","nativeName":"\u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430"},"ur":{"name":"Urdu","nativeName":"\u0627\u0631\u062f\u0648"},"uz":{"name":"Uzbek","nativeName":"zbek, \u040e\u0437\u0431\u0435\u043a, \u0623\u06c7\u0632\u0628\u06d0\u0643\u200e"},"ve":{"name":"Venda","nativeName":"Tshiven\u1e13a"},"vi":{"name":"Vietnamese","nativeName":"Ti\u1ebfng Vi\u1ec7t"},"vo":{"name":"Volap\u00fck","nativeName":"Volap\u00fck"},"wa":{"name":"Walloon","nativeName":"Walon"},"cy":{"name":"Welsh","nativeName":"Cymraeg"},"wo":{"name":"Wolof","nativeName":"Wollof"},"fy":{"name":"Western Frisian","nativeName":"Frysk"},"xh":{"name":"Xhosa","nativeName":"isiXhosa"},"yi":{"name":"Yiddish","nativeName":"\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9"},"yo":{"name":"Yoruba","nativeName":"Yor\u00f9b\u00e1"},"za":{"name":"Zhuang, Chuang","nativeName":"Sa\u026f cue\u014b\u0185, Saw cuengh"}}');
                subtitles.forEach(function(el) {
                    vikisubs.addsub(el.src, el.srclang, el.percentage);
                });
                //clone for mobile
                vikisubs.mobile.find('ul').append(vikisubs.dropdown.find('ul li').clone());
            });
        },
        //detect if jquery and subtitles are loaded
        init: function() {
            var interval = setInterval(function() {
                if (typeof subtitles !== 'undefined') {
                    vikisubs.run();
                    clearInterval(interval);
                }
            }, toolbox.interval);
        }

    };

    //initialize everything
    toolbox.init(vikisubs.init);
}());

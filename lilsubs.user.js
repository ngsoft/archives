// ==UserScript==
// @name         lilsubs
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  Subtitle downloader
// @author       daedelus
// @include     *://*lilsubs.com/*
// @grant none
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/lilsubs.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/lilsubs.user.js
// ==/UserScript==
if (window.location.href.indexOf('lilsubs.com') !== -1) {
    $(document).ready(function() {
        let url = new URL(location.href), search;
        if ((search = url.searchParams.get('url')) !== null) {
            history.replaceState(null, "", '/');
            $('#link').val(search);
            $('form .btn-primary').click();
        }
    });
}
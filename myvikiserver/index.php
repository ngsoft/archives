<?php

/**
 * Passtru $_POST['data'] or convert if .srt with a friendly filename
 * apache mod_rewrite must be enabled and allow override also
 * works also with dimsum
 * browser can post data on a localhost server without crossdomain errors
 */
if (isset($_POST['data'])) {

    $txt = $_POST['data'];
    if (preg_match('/.srt$/i', $_SERVER['REQUEST_URI']) || isset($_POST['convert'])) {
        include_once __DIR__ . '/vtt2srt.php';
        $txt = vtt2srt($txt);
    }

    header(sprintf('Content-Type: %s', 'application/octet-stream'));
    print $txt;
}
<?php

function timecodes(string $line) {
    $return = [];
    if (preg_match_all('/((?P<h>[0-9]{2}):)?((?P<m>[0-9]{2}):)((?P<s>[0-9]{2})\.)(?P<ms>[0-9]+)/', $line, $codes)) {
        foreach ($codes as $k => $array) {
            if (is_numeric($k))
                continue;
            switch ($k) {
                case "s":
                case "m":
                case "h":
                    if (count($array) != 2)
                        return null;
                    if (empty($array[0])) {
                        $code['start'][$k] = '00';
                        $code['end'][$k] = '00';
                    } else {
                        $code['start'][$k] = $array[0];
                        $code['end'][$k] = $array[1];
                    }
                    break;
                case "ms":
                    $code['start'][$k] = $array[0];
                    $code['end'][$k] = $array[1];
                    break;
            }
        }
        if (isset($code)) {
            foreach ($code as $k => $v) {
                $return[$k] = sprintf("%s:%s:%s,%s", $v['h'], $v['m'], $v['s'], $v['ms']);
            }
        }
    }
    return $return;
}

function vtt2srt(string $contents) {
    if (strpos($contents, 'WEBVTT') === false)
        return null;
    $lines = explode("\n", $contents);
    $stream = [];
    $entry = 1;
    $timecodes = null;
    $txt = [];
    foreach ($lines as $line) {
        //first entry
        if (is_null($timecodes)) {
            if ($timecodes = timecodes($line)) {
                $stream[$entry] = $timecodes;
                continue;
                print "$entry\n";
            }
            $timecodes = null;
            continue;
        }
        //next entry
        if ($timecodes = timecodes($line)) {
            $stream[$entry]['text'] = $txt;
            $txt = [];
            $entry++;

            $stream[$entry] = $timecodes;
            continue;
        }
        //capture text (must contain letters
        if (!preg_match('/[a-z]+/i', $line)) {
            continue;
        }

        $txt[] = $line;
    }
    //last entry
    if (count($txt)) {
        $stream[$entry]['text'] = $txt;
    }

    //build srt
    $srt = '';
    foreach ($stream as $entry => $val) {
        if ($entry > 1)
            $srt .= "\n";
        $srt .= sprintf("%d\n%s --> %s\n%s\n", $entry, $val['start'], $val['end'], implode("\n", $val['text']));
    }

    return $srt;
}

<?php

mb_internal_encoding("UTF-8");

//========================== Base Constants ==========================//
@define('ds', DIRECTORY_SEPARATOR);
@define('ns', "\\");
@define('dot', '.');
@define('eol', PHP_EOL);

@define('minute', 60);
@define('hour', 3600);
@define('day', 86400);
@define('week', 604800);
@define('mounth', 2592000);
@define('year', 31536000);
@define('now', time());

//========================== Base 64 Serialize ==========================//

/**
 * Serialize and encode string to base 64
 * \Serializable Objects and arrays will be saved into that format into the database
 * @param mixed $value
 * @return string
 */
function b64serialize($value): string {
    if (is_object($value)) {
        if (!($value instanceof \Serializable)) {
            $value = '';
            return $value;
        }
    }
    $value = serialize($value);
    $value = base64_encode($value);
    return $value;
}

/**
 * Unserialize a base 64 serialized string
 * will return \Serializable Objects or array
 * @param string $str
 * @return mixed
 */
function b64unserialize(string $str) {
    $obj = null;
    if (!empty($str)) {
        $str = base64_decode($str);
        $obj = unserialize($str);
    }
    return $obj;
}

/**
 * Check if string is base 64 serialized
 * @param string $str
 * @return bool
 */
function isb64Serialized(string $str): bool {
    if ($obj = b64unserialize($str)) {
        return $str == b64serialize($obj);
    }
    return false;
}

//========================== String Functions ==========================//

/**
 * Checks whenever $haystack contains $needle
 * @param string $haystack The string being checked.
 * @param string $needle The string to find in haystack
 * @return bool
 */
function str_contains(string $haystack, string $needle, bool $insensitive = false): bool {
    return $insensitive ? mb_stripos($haystack, $needle) !== false : mb_strpos($haystack, $needle) !== false;
}

/**
 * Checks whenever $haystack begins with $needle
 * @param string $haystack
 * @param string $needle
 * @param bool $insensitive
 * @return bool
 */
function str_starts(string $haystack, string $needle, bool $insensitive = false): bool {
    return $needle === '' || substr_compare($haystack, $needle, 0, strlen($needle), $insensitive) === 0;
}

/**
 * Check whenever $haystack ends with $needle
 * @param string $haystack
 * @param type $needle
 * @param bool $insensitive
 * @return bool
 */
function str_ends(string $haystack, $needle, bool $insensitive = false): bool {
    return $needle === '' || substr_compare($haystack, $needle, -strlen($needle), null, $insensitive) === 0;
}

/**
 * Perform a regular expression match
 * @param string $pattern The pattern to search for, as a string.
 * @param string $subject The input string
 * @param bool $global Perform a global regular expression match instead
 * @return array
 */
function str_match(string $pattern, string $subject, bool $global = false): array {
    return $global ? (preg_match_all($pattern, $subject, $matches) ? $matches : []) : (preg_match($pattern, $subject, $matches) ? $matches : []);
}

/**
 * Check whenever string is valid json
 * @param string $json
 * @return bool
 */
function is_json(string $json): bool {
    return is_array(@json_decode($json, true)) ? (json_last_error() === JSON_ERROR_NONE) : false;
}

//========================== Files Functions ==========================//

/**
 * Check if file is a linux hidden file
 * @param string $file
 * @return bool
 */
function is_hidden_file(string $file): bool {
    return str_starts(basename($file), '.');
}

/**
 * Advanced version of php scandir
 * @param string $dir The directory that will be scanned
 * @param bool $hiddenfiles add files beginning by '.' to the results
 * @param bool $prepend add $dir before the files to the results
 * @return array
 */
function scan_dir(string $dir, bool $hiddenfiles = false, bool $prepend = false): array {
    if (!file_exists($dir) or ! is_dir($dir)) {
        return [];
    }
    $scan = scan_dir($dir);
    $result = [];
    foreach ($scan as $file) {
        //prevent . and .. from showing
        if ($file == '.' or $file == '..') {
            continue;
        }
        //prevent .hidden files from showing
        if (!$hiddenfiles and str_starts($file, '.')) {
            continue;
        }

        $result[] = $prepend ? $dir . ds . $file : $file;
    }
    return $result;
}

/**
 * Include all files in $dir with a given $extension
 * @param string $dir directory containing the files to include
 * @param bool $once include only once
 * @param string $extensions file extensions separated by '|'
 */
function include_all(string $dir, bool $once = false, string $extensions = 'php') {
    $extensions = explode('|', $extensions);
    foreach (scan_dir($dir, false, true) as $filename) {
        if (is_dir($filename)) {
            continue;
        }
        if ($ext = pathinfo($filename, PATHINFO_EXTENSION) and in_array($ext, $extensions)) {
            $once ? include_once $filename : include $filename;
        }
    }
}

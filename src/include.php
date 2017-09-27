<?php

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

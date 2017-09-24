<?php

/**
 * Serialize and encode string to base 64
 * \Serializable Objects and arrays will be saved into that format into the database
 * @param type $value
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
 * @param type $str
 * @return mixed
 */
function b64unserialize(string $str = null) {
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

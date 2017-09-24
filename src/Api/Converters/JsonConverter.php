<?php

namespace NGSOFT\Api\Converters;

use NGSOFT\Api\Contracts\Converter;
use NGSOFT\Api\Exception\InvalidFormatException;

class JsonConverter extends NullConverter {

    /**
     * {@inheritdoc}
     */
    public static function decode(string $formatted) {
        $return = null;
        if (!static::isJson($formatted)) {
            throw new InvalidFormatException('Cannot decode data, invalid json.');
        }
        if ($data = json_decode($formatted, true)) {
            $return = $data;
        }
        return $return;
    }

    /**
     * {@inheritdoc}
     */
    public static function encode($var, $options = null): string {
        $return = '';
        if ($data = json_encode($var, $options) and static::isJson($data)) {
            $return = $data;
        } else
            throw new InvalidFormatException('Cannot encode data to json');
        return $return;
    }

    /**
     * Check if string is valid json
     * @param string $json
     * @return boolean
     */
    public static function isJson(string $json) {
        if ($data = json_decode($json)) {
            return $json == json_encode($data);
        }
        return false;
    }

}

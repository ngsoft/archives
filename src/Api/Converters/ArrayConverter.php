<?php

namespace NGSOFT\Api\Converters;

use NGSOFT\Api\Exception\InvalidFormatException;
use NGSOFT\Api\Exception\InvalidArgumentException;

class ArrayConverter extends NullConverter {

    /**
     * {@inheritdoc}
     */
    public static function decode(string $formatted) {

        if (!isb64Serialized($formatted)) {
            throw new InvalidFormatException('Cannot decode Base 64 serialized string');
        }
        if ($data = b64unserialize($formatted)) {
            if (!is_array($data)) {
                throw new InvalidFormatException("Base 64 serialized string doesn't return an array, %s given", gettype($data));
            }
            return $data;
        }
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public static function encode($var, $options = null): string {
        if (!is_array($var)) {
            throw new InvalidArgumentException('first argument must be an array, %s given', gettype($var));
        }

        if ($formatted = b64serialize($var)) {
            return $formatted;
        }
        throw new InvalidFormatException('Cannot encode array to Base 64 serialized string');
    }

    public static function getFormat(): string {
        return 'array';
    }

}

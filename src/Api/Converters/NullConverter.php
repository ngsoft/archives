<?php

namespace NGSOFT\Api\Converters;

use NGSOFT\Api\Contracts\Converter;

/**
 * Will return the same values as inputed
 * for files will return file contents
 */
class NullConverter extends BaseConverter implements Converter {

    /**
     * {@inheritdoc}
     */
    public static function decode(string $formatted) {
        return $formatted;
    }

    /**
     * {@inheritdoc}
     */
    public static function decodeFromFile(string $filename) {
        if ($contents = static::getFileContents($filename)) {
            return static::decode($contents);
        }
        return null;
    }

    /**
     * {@inheritdoc}
     */
    public static function encode($var, $options = null): string {
        //convert everything to string
        switch (gettype($var)) {
            case "boolean":
            case "integer":
            case "double":
            case "string":
                return (string) $var;
            case "array":
                return serialize($var);
            case "object":
                if ($var instanceof \Serializable) {
                    return serialize($var);
                } elseif ($var instanceof \JsonSerializable) {
                    return json_encode($var);
                }
        }
        return "";
    }

    /**
     * {@inheritdoc}
     */
    public static function encodeToFile(string $filename, $var, $options = null): bool {
        if (static::createFileTree($filename) and $contents = static::encode($var, $options)) {
            return static::setFileContents($filename, $contents);
        }
        return false;
    }

}

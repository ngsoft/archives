<?php

namespace NGSOFT\Api\Converters;

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;
use NGSOFT\Api\Exception\InvalidFormatException;
use NGSOFT\Api\Contracts\Converter;

/**
 * Convert Arrays to YAML and vice-versa
 * @link https://symfony.com/doc/current/components/yaml.html The Yaml Component
 */
class YamlConverter extends BaseConverter implements Converter {

    /**
     * {@inheritdoc}
     */
    public static function decode(string $formatted) {
        try {
            if ($data = Yaml::parse($formatted, Yaml::PARSE_EXCEPTION_ON_INVALID_TYPE)) {
                return $data;
            }
            return null;
        } catch (ParseException $e) {
            throw new InvalidFormatException('Cannot decode yaml string, %s', $e->getMessage());
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function decodeFromFile(string $filename) {
        if ($formatted = static::getFileContents($filename)) {

        }
    }

    /**
     * {@inheritdoc}
     */
    public static function encode($var, $options = null): string {

    }

    /**
     * {@inheritdoc}
     */
    public static function encodeToFile(string $filename, $var, $options = null): bool {

    }

}

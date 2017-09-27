<?php

namespace NGSOFT\Api\Converters;

use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;
use NGSOFT\Api\Exception\InvalidFormatException;

/**
 * Convert Arrays to YAML and vice-versa
 * @link https://symfony.com/doc/current/components/yaml.html The Yaml Component
 */
class YamlConverter extends NullConverter {

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
    public static function encode($var, ...$options): string {
        try {
            if ($data = Yaml::dump($var, 2, 4, Yaml::DUMP_EXCEPTION_ON_INVALID_TYPE)) {
                return $data;
            }
            return "";
        } catch (ParseException $e) {
            throw new InvalidFormatException('Cannot encode YAML string, %s', $e->getMessage());
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function getFormat(): string {
        return 'yaml';
    }

}

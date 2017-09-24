<?php

namespace NGSOFT\Api\Contracts;

interface Converter {

    public static function encode($var, $options = null): string;

    public static function encodeToFile(string $filename, $var, $options = null): bool;

    public static function decode(string $formatted);

    public static function decodeFromFile(string $filename);
}

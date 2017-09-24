<?php

namespace NGSOFT\Api\Contracts;

interface Converter {

    /**
     * Encode $var into formatted string
     * @param mixed $var
     * @param mixed $options
     */
    public static function encode($var, $options = null): string;

    /**
     * Encode $var and save to file
     * @param string $filename
     * @param mixed $var
     * @param mixed $options
     */
    public static function encodeToFile(string $filename, $var, $options = null): bool;

    /**
     * decode formatted string
     * @param string $formatted
     */
    public static function decode(string $formatted);

    /**
     * decode contents from file
     * @param string $filename
     */
    public static function decodeFromFile(string $filename);

    /**
     * Get the format name
     * @return string Format
     */
    public static function getFormat(): string;
}

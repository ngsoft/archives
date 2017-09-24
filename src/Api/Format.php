<?php

namespace NGSOFT\Api;

use NGSOFT\Api\Contracts\Converter;
use NGSOFT\Api\Exception\InvalidFormatException;
use NGSOFT\Api\Exception\UnexpectedValueException;

abstract class Format {

    /**
     * @var Converter[]
     */
    protected static $formatters = [];

    /**
     * Add a formatter to the pool
     * @param Converter $converter converter class
     */
    public function addFormatter(Converter $converter) {

        static::$formatters[$converter::getFormat()] = $converter;
    }

    /**
     * Check if formatter exists
     * @param string $format
     */
    public function hasFormatter(string $format): bool {
        return isset(static::$formatters[$format]);
    }

    /**
     * Get the converter
     * @param string $format
     * @return Converter
     * @throws InvalidFormatException
     */
    public function getFormatter(string $format): Converter {

        if (!static::hasFormatter($format)) {
            throw new InvalidFormatException('Format %s is not defined.', $format);
        }
        return static::$formatters[$format];
    }

    /**
     * Add multiple converters
     * @param Converter[] $converters
     */
    public function addFormatters(array $converters) {
        foreach ($converters as $converter) {
            if (!($converter instanceof Converter)) {
                throw new UnexpectedValueException('Cannot add formatter, not instance of %s', Converter::class);
            }
            static::addFormatter($converter);
        }
    }

}

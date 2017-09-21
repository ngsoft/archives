<?php

namespace NGSOFT\Api\Contracts;

/**
 * Interface Jsonable
 *
 * Modified version of Jsonable to allow importing and exporting json string
 * Jsonserializable interface exists but you need to use json_encode($class) to convert from array
 *
 */
interface Jsonable {

    /**
     * Import json string to object
     * @param string $json json formated string
     * @throws InvalidArgumentException if json string is not the same as json_encode(json_decode($json))
     * @throws UnexpectedValueException if json string don't correspond to the accepted values for the given class
     * @link http://php.net/manual/fr/spl.exceptions.php php native exception list
     */
    public function fromJson(string $json);

    /**
     * Convert object to its json representation
     * @param int $options JSON_ options
     * @throws InvalidArgumentException if int value is incorrect
     * @return string Json String
     */
    public function toJson(int $options = 128): string;
}

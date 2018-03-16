<?php

namespace NGSOFT\Api;

use NGSOFT\Api\Contracts\Exportable;
use NGSOFT\Api\Exception\InvalidArgumentException;
use NGSOFT\Api\Exception\UnexpectedValueException;
use NGSOFT\Api\Exception\InvalidFormatException;
use NGSOFT\Api\Exception\NotFoundException;
use NGSOFT\Api\Exception\BadMethodCallException;
use NGSOFT\Api\Converters\ArrayConverter,
    NGSOFT\Api\Converters\JsonConverter,
    NGSOFT\Api\Converters\NeonConverter,
    NGSOFT\Api\Converters\YamlConverter;

/**
 * @method string toJson() Get the json representation from the class
 * @method string toNeon() Get the neon representation from the class
 * @method string toYaml() Get the yaml representation from the class
 */
class Exporter extends Format {

    /**
     * @var Exportable $object
     */
    private $object;

    /**
     * Get a new instance from Exporter
     * @param Exportable $object
     * @return Exporter
     */
    public static function getNewExporter(Exportable $object): Exporter {
        return new static($object);
    }

    /**
     * @param Exportable $object
     */
    public function __construct(Exportable $object) {
        if (!count(static::$formatters)) {
            $this->addFormatters([
                new ArrayConverter,
                new JsonConverter,
                new NeonConverter,
                new YamlConverter
            ]);
        }
        $this->object = $object;
    }

    /**
     * Get the array representation from the class
     * @return array
     * @throws InvalidFormatException
     */
    public function toArray(): array {
        if ($array = $this->object->__getData()) {
            if (!is_array($array)) {
                throw new InvalidFormatException('class %s did not return an array, %s given', get_class($this->object), gettype($array));
            }
            return $array;
        }
        return [];
    }

    public function toObject(): \stdClass {
        if ($array = $this->object->__getData()) {
            if (!is_array($array)) {
                throw new InvalidFormatException('class %s did not return an array, %s given', get_class($this->object), gettype($array));
            }
            return $this->_arrayToObj($array);
        }
        return new \stdClass();
    }

    private function _arrayToObj(array $array): \stdClass {
        $obj = new \stdClass();
        foreach ($obj as $k => $v) {
            if (is_array($v)) {
                $obj->{$k} = $this->_arrayToObj($v);
                continue;
            }
            $obj->{$k} = $v;
        }
        return $obj;
    }

    /**
     * Save formatted data from class to file
     * @param string $filename
     * @param string|null $format
     * @return Exportable
     * @throws InvalidFormatException
     * @throws NotFoundException
     */
    public function toFile(string $filename, string $format = null): Exportable {
        if (!is_string($format)) {
            $format = "";
            $path_parts = pathinfo($format);
            if (!isset($path_parts['extension'])) {
                throw new InvalidFormatException("Cannot define format from filename %s, doesn't have an extension", $filename);
            } else {
                $format = $path_parts['extension'];
            }
        }
        if (!$this->hasFormatter($format)) {
            throw new InvalidFormatException('format %s for file %s is not invalid.', $format, $filename);
        }
        if ($data = $this->object->__getData()) {
            if (!$this->getFormatter($format)::encodeToFile($filename, $data)) {
                throw new NotFoundException('cannot create file %s', $filename);
            }
        }
        return $this->object;
    }

    public function __call($method, $args) {
        if (preg_match('/^to(?P<format>[A-Z][a-zA-Z0-9]+)$/', $method, $matches)) {
            $format = $matches['format'];
            if ($this->hasFormatter($format)) {
                if (count($args) != 0) {
                    throw new InvalidArgumentException('Method %s expect 0 arguments, %d given', $method, count($args));
                } else {
                    if ($data = $this->object->__getData()) {
                        return $this->getFormatter($format)::encode($data);
                    }
                    throw new UnexpectedValueException('class %s did not return a value', get_class($this->object));
                }
            }
        }

        throw new BadMethodCallException('Method %s does not exists.', $method);
    }

}

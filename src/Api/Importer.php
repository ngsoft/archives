<?php

namespace NGSOFT\Api;

use NGSOFT\Api\Exception\BadMethodCallException;
use NGSOFT\Api\Exception\InvalidArgumentException;
use NGSOFT\Api\Exception\UnexpectedValueException;
use NGSOFT\Api\Exception\InvalidFormatException;
use NGSOFT\Api\Contracts\Importable;
use NGSOFT\Api\Converters\JsonConverter,
    NGSOFT\Api\Converters\NeonConverter,
    NGSOFT\Api\Converters\YamlConverter,
    NGSOFT\Api\Converters\ArrayConverter;

/**
 * @method Importable fromJson(string $json) Import class data from json string
 * @method Importable fromNeon(string $neon) Import class data from neon string
 * @method Importable fromYaml(string $yaml) Import class data from yaml string
 */
class Importer extends Format {

    /**
     * @var Importable $object
     */
    private $object;

    /**
     * Get a new instance from Importer
     * @param \NGSOFT\Api\Importable $object
     * @return Importer
     */
    public static function getNewImporter(Importable $object): Importer {
        return new static($object);
    }

    /**
     * @param Importable $object
     */
    public function __construct(Importable $object) {
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
     * Import data from array
     * @param array $array
     * @return Importable
     */
    public function fromArray(array $array): Importable {
        $this->object->__setData($array, $this);
        return $this->object;
    }

    /**
     * Imports data from object
     * @param object $obj
     * @throws UnexpectedValueException
     * @return Importable
     */
    public function fromObject($obj) {
        if (!is_object($obj)) {
            throw new UnexpectedValueException('Argument 1 for method fromObject is expected to be an object, %s given', $method, gettype($obj));
        }
        $data = [];
        if ($obj instanceof Contracts\Exportable) {
            $data = $obj->export()->toArray();
        } elseif ($obj instanceof \JsonSerializable || $obj instanceof \stdClass) {
            if ($json = JsonConverter::encode($obj)) {
                $data = JsonConverter::decode($json);
            }
        } else {
            foreach ($obj as $prop => $val) {
                $data[$prop] = $val;
            }
        }
        $this->object->__setData($data, $this);
        return $this->object;
    }

    /**
     * Import class data from array
     * @param string $filename file to import
     * @param string|null $format if format not defined, method will get the format from the file extension
     */
    public function fromFile(string $filename, string $format = null): Importable {
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
            throw new InvalidFormatException('format %s for file %s is invalid.', $format, $filename);
        }

        if ($data = $this->getFormatter($format)::decodeFromFile($filename)) {
            $this->object->__setData($data, $this);
        }
        return $this->object;
    }

    public function __call($method, $args) {
        if (preg_match('/^from(?P<format>[A-Z][a-zA-Z0-9]+)$/', $method, $matches)) {
            $format = $matches['format'];
            if ($this->hasFormatter($format)) {
                if (count($args) != 1) {
                    throw new InvalidArgumentException('Method %s expect only 1 argument, %d given', $method, count($args));
                } elseif (!is_string($args[0])) {
                    throw new UnexpectedValueException('Argument 1 for method %s is expected to be a string, %s given', $method, gettype($args[0]));
                } else {
                    $formatted = $args[0];
                    if ($data = $this->getFormatter($format)::decode($formatted)) {
                        $this->object->__setData($data, $this);
                    }
                    return $this->object;
                }
            }
        }

        throw new BadMethodCallException('Method %s does not exists.', $method);
    }

}

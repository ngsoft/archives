<?php

namespace NGSOFT\Api;

use NGSOFT\Api\Exception\BadMethodCallException;
use NGSOFT\Api\Exception\InvalidArgumentException;
use NGSOFT\Api\Contracts\Importable;
use NGSOFT\Api\Contracts\Converter,
    NGSOFT\Api\Converters\JsonConverter,
    NGSOFT\Api\Converters\NeonConverter,
    NGSOFT\Api\Converters\YamlConverter;

class Importer {

    /**
     * @var Importable $object
     */
    private $object;

    /**
     * @var Converter[]
     */
    private static $formats = [];

    /**
     * Get a new instance from Importer
     * @param \NGSOFT\Api\Importable $object
     * @param array $valid_requests ['array','json','string','file']
     * @return Importer
     */
    public static function getNewImporter(Importable $object) {
        return new static($object);
    }

    public static function addFormat(Converter $converter, string $format = null) {

    }

    /**
     * @param Importable $object
     */
    public function __construct(Importable $object) {
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
     * import data from json string
     * @param string $json
     * @return Importable
     */
    public function fromJson(string $json): Importable {
        if ($data = JsonConverter::decode($json)) {
            $this->object->__setData($data, $this);
        }
        return $this->object;
    }

    /**
     * import data from neon string
     * @param string $neon
     * @return Importable
     */
    public function fromNeon(string $neon): Importable {
        if ($data = NeonConverter::decode($neon)) {
            $this->object->__setData($data, $this);
        }
        return $this->object;
    }

    /**
     * import data from yaml string
     * @param string $yaml
     * @return Importable
     */
    public function fromYaml(string $yaml): Importable {
        if ($data = NeonConverter::decode($yaml)) {
            $this->object->__setData($data, $this);
        }
        return $this->object;
    }

    public function fromFile(string $filename, string $format = null): Importable {

    }

}

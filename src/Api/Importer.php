<?php

namespace NGSOFT\Api;

use NGSOFT\Api\Exception\BadMethodCallException;
use NGSOFT\Api\Exception\InvalidArgumentException;
use NGSOFT\Api\Contracts\Importable;

class Importer {

    /**
     * @var Importable $object
     */
    private $object;

    /**
     * @var array $valid_requests array, string, json, file
     */
    private $valid_requests = [];

    /**
     * Get a new instance from Importer
     * @param \NGSOFT\Api\Importable $object
     * @param array $valid_requests ['array','json','string','file']
     * @return Importer
     */
    public static function getNewImporter(Importable $object, array $valid_requests = ['array', 'json']) {
        return new static($object, $valid_requests);
    }

    public function __construct(Importable $object, array $valid_requests = ['array', 'json']) {
        $this->object = $object;
        call_user_func_array([$this, 'setValidRequests'], $valid_requests);
    }

    /**
     * Import data from an array into Importable
     * @param array $array
     * @return \NGSOFT\Api\Importable
     */
    public function fromArray(array $array): Importable {
        if (!in_array('array', $this->valid_requests)) {
            throw new BadMethodCallException('Method %s cannot be called for %s', __METHOD__, get_class($this->object));
        }
        $this->object->__setData($array, $this);
        return $this->object;
    }

    /**
     * Import data into Importable from a string
     * @param string $string
     * @return \NGSOFT\Api\Importable
     */
    public function fromString(string $string): Importable {
        if (!in_array('string', $this->valid_requests)) {
            throw new BadMethodCallException('Method %s cannot be called for %s', __METHOD__, get_class($this->object));
        }
        $this->object->__setData($string, $this);
        return $this->object;
    }

    /**
     * Import data from json encoded data into Importable
     * @param string $json
     * @return \NGSOFT\Api\Importable
     */
    public function fromJson(string $json): Importable {
        if (!in_array('json', $this->valid_requests)) {
            throw new BadMethodCallException('Method %s cannot be called for %s', __METHOD__, get_class($this->object));
        }
        if (!$this->checkJson($json)) {
            return $this->object;
        }
        $data = json_decode($json, true);
        if (is_array($data))
            $this->fromArray($data);
        elseif (is_string($data)) {
            $this->fromString($data);
        }
        return $this->object;
    }

    /**
     * Import data from file into object
     * @param string $filename
     * @return \NGSOFT\Api\Importable
     */
    public function fromFile(string $filename): Importable {
        if (!in_array('file', $this->valid_requests)) {
            throw new BadMethodCallException('Method %s cannot be called for %s', __METHOD__, get_class($this->object));
        }
        if (file_exists($filename)) {
            if ($data = file_get_contents($filename)) {
                $this->object->__setData($data, $this);
            }
        }
        return $this->object;
    }

    /**
     * Set the accepted import requests
     * @param string [$arg1,...arg2....]
     */
    protected function setValidRequests(...$requests) {
        $valid = ['array', 'string', 'json', 'file'];
        array_map(function($x)use($valid) {
            if (!in_array($x, $valid)) {
                throw new InvalidArgumentException('argument %s for method %s, is not valid ( accepted : %s )', $x, __METHOD__, implode(', ', $valid));
            }
            return $x;
        }, $requests);
        $this->valid_requests = $requests;
    }

    /**
     * check if json is valid
     * @param string $json
     * @return bool
     */
    protected function checkJson(string $json): bool {
        $tmp = json_decode($json);
        return (json_encode($tmp) == $json);
    }

}

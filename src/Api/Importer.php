<?php

namespace NGSOFT\Api;

class Importer {

    /**
     * @var Importable $object
     */
    private $object;

    /**
     *
     * @var array $valid_requests
     */
    private $valid_requests = [];

    public function __construct(Importable $object, array $valid_requests = ['array']) {
        $this->object = $object;
        $this->valid_requests = $valid_requests;
    }

    /**
     * Import data from an array into Importable
     * @param array $array
     * @return \NGSOFT\Api\Importable
     */
    public function fromArray(array $array): Importable {
        if (!in_array('array', $this->valid_requests)) {

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
        $this->object->__setData($string, $this);
        return $this->object;
    }

    /**
     * Import data from json encoded data into Importable
     * @param string $json
     * @return \NGSOFT\Api\Importable
     */
    public function fromJson(string $json): Importable {
        if (!$this->checkJson($json)) {
            return $this->object;
        }
        $data = json_decode($json, true);
        if (is_array($data))
            $this->fromArray($array);
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
        if (file_exists($filename)) {
            if ($data = file_get_contents($filename)) {
                $this->object->__setData($data, $this);
            }
        }
        return $this->object;
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

<?php

namespace NGSOFT\Api;

use NGSOFT\Api\Exception\BadMethodCallException;
use NGSOFT\Api\Exception\InvalidArgumentException;
use NGSOFT\Api\Contracts\Importable,
    NGSOFT\Api\Contracts\Importable\Arrayable,
    NGSOFT\Api\Contracts\Importable\Jsonable,
    NGSOFT\Api\Contracts\Importable\Neonable,
    NGSOFT\Api\Contracts\Importable\Yamlable;

class Importer {

    /**
     * @var Importable $object
     */
    private $object;

    /**
     * @var array
     */
    private $capabilities = [];

    /**
     * Get a new instance from Importer
     * @param \NGSOFT\Api\Importable $object
     * @param array $valid_requests ['array','json','string','file']
     * @return Importer
     */
    public static function getNewImporter(Importable $object) {
        return new static($object);
    }

    public function __construct(Importable $object) {
        $this->object = $object;
        $this->setCapabilities();
    }

    private function setCapabilities() {

        if ($this->object instanceof Arrayable)
            $this->capabilities[] = 'array';
        if ($this->object instanceof Jsonable)
            $this->capabilities[] = 'json';
        if ($this->object instanceof Neonable)
            $this->capabilities[] = 'neon';
        if ($this->object instanceof Yamlable)
            $this->capabilities[] = 'yaml';
    }

    public function hasCapability(string $keyword): bool {
        return in_array($keyword, $this->capabilities);
    }

}

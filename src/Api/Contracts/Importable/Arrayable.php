<?php

namespace NGSOFT\Api\Contracts\Importable;

interface Arrayable {

    /**
     * Import Array to object
     * @param array $array
     */
    public function fromArray(array $array);
}

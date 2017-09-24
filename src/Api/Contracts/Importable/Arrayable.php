<?php

namespace NGSOFT\Api\Contracts\Importable;

interface Arrayable {

    /**
     * Import class data from array
     * @param array $array
     */
    public function fromArray(array $array);
}

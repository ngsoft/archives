<?php

namespace NGSOFT\Api\Contracts\Importable;

interface Jsonable {

    /**
     * Import class data from json format
     * @param string $json
     */
    public function fromJson(string $json);
}

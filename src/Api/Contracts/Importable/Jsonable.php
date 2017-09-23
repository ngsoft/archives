<?php

namespace NGSOFT\Api\Contracts\Importable;

interface Jsonable {

    /**
     * Import json string to object
     *
     * @param string $json json formated string
     */
    public function fromJson(string $json);
}

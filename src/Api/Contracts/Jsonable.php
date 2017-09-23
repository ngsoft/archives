<?php

namespace NGSOFT\Api\Contracts;

interface Jsonable {

    /**
     * Export class data to json format
     * @param int $options
     */
    public function toJson(int $options = 0): string;
}

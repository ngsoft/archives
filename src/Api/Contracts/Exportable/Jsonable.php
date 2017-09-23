<?php

namespace NGSOFT\Api\Contracts\Exportable;

interface Jsonable {

    /**
     * Convert object to its json representation
     *
     * @param int $options JSON_ options
     * @return string Json String
     */
    public function toJson(int $options = 128): string;
}

<?php

namespace NGSOFT\Api\Contracts\Exportable;

interface Arrayable {

    /**
     * Convert Object to an array.
     *
     * @return array
     */
    public function toArray(): array;
}

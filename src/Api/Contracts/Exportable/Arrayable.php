<?php

namespace NGSOFT\Api\Contracts\Exportable;

interface Arrayable {

    /**
     * Export class data to array
     *
     * @return array
     */
    public function toArray(): array;
}

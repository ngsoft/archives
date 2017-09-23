<?php

namespace NGSOFT\Api\Contracts;

interface Arrayable {

    /**
     * Export class data to array format
     * 
     * @return array
     */
    public function toArray(): array;
}

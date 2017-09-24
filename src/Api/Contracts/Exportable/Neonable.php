<?php

namespace NGSOFT\Api\Contracts\Exportable;

interface Neonable {

    /**
     * Export class data to neon format
     * @link https://doc.nette.org/en/2.4/neon Neon Syntax
     */
    public function toNeon(): string;
}

<?php

namespace NGSOFT\Api\Contracts\Importable;

interface Neonable extends Arrayable {

    /**
     * Import class data from neon format
     * @link https://doc.nette.org/en/2.4/neon Neon Syntax
     * @param string $neon
     */
    public function fromNeon(string $neon);
}

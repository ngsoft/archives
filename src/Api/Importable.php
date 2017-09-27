<?php

namespace NGSOFT\Api;

trait Importable {

    /**
     * {@inheritdoc}
     */
    public function import(): Importer {
        return new Importer($this);
    }

}

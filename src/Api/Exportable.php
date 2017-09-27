<?php

namespace NGSOFT\Api;

trait Exportable {

    /**
     * {@inheritdoc}
     */
    public function export(): Exporter {
        return new Exporter($this);
    }

}

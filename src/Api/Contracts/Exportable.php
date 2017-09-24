<?php

namespace NGSOFT\Api\Contracts;

use NGSOFT\Api\Exporter;

interface Exportable {

    /**
     * Register with the exporter and return an instance
     */
    public function export(): Exporter;

    /**
     * Method used by Exporter to get data from object
     */
    public function __getData();
}

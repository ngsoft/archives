<?php

namespace NGSOFT\Api;

interface Exportable {

    /**
     * Gives access to a new Exporter instance
     */
    public function export(): Exporter;

    /**
     * Method used by Exporter to get data from object
     * @param string $requested_type
     */
    public function __getData(string $requested_type);
}

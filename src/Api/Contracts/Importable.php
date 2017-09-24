<?php

namespace NGSOFT\Api\Contracts;

use NGSOFT\Api\Importer;

interface Importable {

    /**
     * Register with the importer and return an instance
     */
    public function import(): Importer;

    /**
     * Used by Importer to inject data into the class
     *
     * @param mixed $data
     * @param string $format The format used for importation
     * @param Importer $importer
     */
    public function __setData($data, string $format, Importer $importer);
}

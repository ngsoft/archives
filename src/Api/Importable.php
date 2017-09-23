<?php

namespace NGSOFT\Api;

interface Importable {

    /**
     * Register with the importer and return an instance
     */
    public function import(): Importer;

    /**
     * Used by Importer to inject data into the class
     *
     * @param mixed $data
     * @param Importer $importer
     */
    public function __setData($data, Importer $importer);
}

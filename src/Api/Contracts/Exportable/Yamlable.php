<?php

namespace NGSOFT\Api\Contracts\Exportable;

interface Yamlable {

    /**
     * Export class data to yaml format
     * @link http://www.yaml.org/ YAML Syntax
     */
    public function toYAML(): string;
}

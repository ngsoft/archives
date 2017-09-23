<?php

namespace NGSOFT\Api\Contracts;

interface Yamlable {

    /**
     * Export class data to yaml format
     * @link http://docs.ansible.com/ansible/latest/YAMLSyntax.html YAML Syntax
     */
    public function toYAML(): string;
}

<?php

namespace NGSOFT\Api\Contracts\Importable;

interface Yamlable extends Arrayable {

    /**
     * Import class data from yaml format
     * @link http://docs.ansible.com/ansible/latest/YAMLSyntax.html YAML Syntax
     * @param string $yaml
     */
    public function fromYAML(string $yaml);
}

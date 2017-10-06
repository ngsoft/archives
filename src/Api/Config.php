<?php

namespace NGSOFT\Api;

class Config {

    /**
     * @var array $params
     */
    protected $params = [];

    /**
     *
     * @var Config $defaults
     */
    protected $defaults;

    /**
     * Initialize the config
     * @param array $params
     * @param Config $defaults
     */
    public function __construct(array $params = [], Config $defaults = null) {
        $this->params = $params;
        if ($defaults)
            $this->setDefaults($defaults);
    }

    /**
     * Set a param
     * @param string $key
     * @param mixed $value
     * @return $this
     */
    public function set(string $key, $value) {
        $this->params[$key] = $value;
        return $this;
    }

    /**
     * Check if param exists
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool {
        return $this->hasParam($key) ?: $this->hasDefaults($key);
    }

    /**
     * Get a param
     * @param string $key
     * @param type $defaults
     * @return type
     */
    public function get(string $key, $defaults = null) {
        if ($this->hasParam($key)) {
            return $this->params[$key];
        }
        return $this->getDefaults($key, $defaults);
    }

    /**
     * Get default value for a param
     * @param string $key
     * @param type $defaults
     * @return type
     */
    protected function getDefaults(string $key, $defaults) {
        if ($this->defaults instanceof self) {
            return $this->defaults->get($key, $defaults);
        }

        return $defaults;
    }

    /**
     * Set default params
     * @param Config $defaults
     * @return $this
     */
    protected function setDefaults(Config $defaults) {
        $this->defaults = $defaults;
        return $this;
    }

    /**
     * check if default param exists
     * @param string $key
     * @return bool
     */
    protected function hasDefaults(string $key): bool {
        return ($this->defaults instanceof self) ? $this->defaults->has($key) : false;
    }

    /**
     * Check if param exists
     * @param string $key
     * @return bool
     */
    protected function hasParam(string $key): bool {
        return array_key_exists($key, $this->params);
    }

}

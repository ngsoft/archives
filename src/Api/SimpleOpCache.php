<?php

namespace NGSOFT\Api;

use Psr\SimpleCache\CacheInterface;
use NGSOFT\Api\Exception\Cache\InvalidArgumentException,
    NGSOFT\Api\Exception\Cache\CacheException;

class SimpleOpCache implements CacheInterface {

    public function __construct($path) {

    }

    /**
     * {@inheritdoc}
     */
    public function clear() {

    }

    /**
     * {@inheritdoc}
     */
    public function delete($key) {

    }

    /**
     * {@inheritdoc}
     */
    public function deleteMultiple($keys) {

    }

    /**
     * {@inheritdoc}
     */
    public function get($key, $default = null) {

    }

    /**
     * {@inheritdoc}
     */
    public function getMultiple($keys, $default = null) {

    }

    /**
     * {@inheritdoc}
     */
    public function has($key) {

    }

    /**
     * {@inheritdoc}
     */
    public function set($key, $value, $ttl = null) {

    }

    /**
     * {@inheritdoc}
     */
    public function setMultiple($values, $ttl = null) {

    }

}

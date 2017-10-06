<?php

namespace NGSOFT\Api;

use Psr\SimpleCache\CacheInterface;
use NGSOFT\Api\Exception\Cache\InvalidArgumentException,
    NGSOFT\Api\Exception\Cache\CacheException;
use DateTime,
    DateInterval;

class SimpleOpCache implements CacheInterface {

    /**
     * @var Contracts\FileSystem
     */
    protected $path = '';

    /**
     * @param Contracts\FileSystem|string|null $path
     */
    public function __construct($path = null) {
        if (is_null($path)) {
            $path = sys_get_temp_dir() . '/cache';
        }
        if (is_string($path)) {
            $path = new FileSystem($path);
        }
        if ($path instanceof Contracts\FileSystem) {
            $this->path = $path;
        }
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

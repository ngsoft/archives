<?php

namespace NGSOFT\Api;

class FileSystemManager implements Contracts\FilePathManager {

    /**
     * @var Contracts\FileSystem
     */
    protected $filesystems = [];

    /**
     * Check if prefix is valid
     * @param string $prefix
     * @return bool
     */
    protected function isValidPrefix(string $prefix): bool {
        return preg_match(static::VALID_PREFIX, $prefix);
    }

    /**
     * {@inheritdoc}
     */
    public function addFilesystem(string $prefix, Contracts\FileSystem $filesystem) {

    }

    /**
     * {@inheritdoc}
     */
    public function getFileSystem(string $prefix): Contracts\FileSystem {

    }

    /**
     * {@inheritdoc}
     */
    public function hasFileSystem(string $prefix): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function append(string $path, string $contents = null): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function copy(string $path, string $destination): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function createDir(string $dir): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function delete(string $path): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function deleteDir(string $dir): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function getFileInfos(string $path) {

    }

    /**
     * {@inheritdoc}
     */
    public function getSize(string $path) {

    }

    /**
     * {@inheritdoc}
     */
    public function getTimestamp(string $path) {

    }

    /**
     * {@inheritdoc}
     */
    public function has(string $path): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function listDir(string $dir = null, bool $recursive = false): array {

    }

    /**
     * {@inheritdoc}
     */
    public function move(string $path, string $destination): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function prepend(string $path, string $contents = null): bool {

    }

    /**
     * {@inheritdoc}
     */
    public function read(string $path) {

    }

    /**
     * {@inheritdoc}
     */
    public function write(string $path, string $contents = null): bool {

    }

}

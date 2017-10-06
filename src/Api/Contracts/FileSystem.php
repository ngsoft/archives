<?php

namespace NGSOFT\Api\Contracts;

use NGSOFT\Api\Exception\Filesystem\FileNotFound;

interface FileSystem {

    /**
     * Check if file exists and is a file
     * @param string $path
     */
    public function has(string $path): bool;

    /**
     * Reads a file
     * @throws FileNotFound
     * @param string $path
     * @return string|false
     */
    public function read(string $path);

    /**
     * Get file size
     * @param string $path
     * @return int|false
     */
    public function getSize(string $path);

    /**
     * Get File Timestamp
     * @throws FileNotFound
     * @param string $path
     * @return int|false
     */
    public function getTimestamp(string $path);

    /**
     * Get File infos
     * @throws FileNotFound
     * @param string $path
     * @return array|false
     */
    public function getFileInfos(string $path);

    /**
     * Appends contents to a file
     * @throws FileNotFound
     * @param string $path
     * @param string $contents
     */
    public function append(string $path, string $contents = null): bool;

    /**
     * Prepend contents to a file
     * @throws FileNotFound
     * @param string $path
     * @param string $contents
     */
    public function prepend(string $path, string $contents = null): bool;

    /**
     * Write or update a file
     * @param string $path
     * @param string $contents
     */
    public function write(string $path, string $contents = null): bool;

    /**
     * Remove a file
     * @param string $path
     */
    public function delete(string $path): bool;

    /**
     * Move a file
     * @throws FileNotFound
     * @throws FileExists
     * @param string $path
     * @param string $destination
     */
    public function move(string $path, string $destination): bool;

    /**
     * Copy a file
     * @throws FileNotFound
     * @throws FileExists
     * @param string $path
     * @param string $destination
     */
    public function copy(string $path, string $destination): bool;

    /**
     * List directory contents
     * @param string $dir
     * @param bool $recursive
     */
    public function listDir(string $dir = null, bool $recursive = false): array;

    /**
     * Recursively create a dir
     * @param string $dir
     */
    public function createDir(string $dir): bool;

    /**
     * Remove a dir
     * @param string $dir
     */
    public function deleteDir(string $dir): bool;
}

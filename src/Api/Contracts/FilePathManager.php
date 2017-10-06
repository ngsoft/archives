<?php

namespace NGSOFT\Api\Contracts;

use NGSOFT\Api\Exception\NotFoundException;
use NGSOFT\Api\Exception\UnexpectedValueException;

interface FilePathManager extends FileSystemAdapter {

    const VALID_PREFIX = '/^[a-z][a-z0-9]+$/';
    const SEPARATOR = '://';

    /**
     * Get a filesystem
     * @throws NotFoundException
     * @throws UnexpectedValueException
     * @param string $prefix
     */
    public function getFileSystem(string $prefix): FileSystem;

    /**
     * Add a filesystem to the stack
     * @throws UnexpectedValueException
     * @param string $prefix
     * @param FileSystem $filesystem
     */
    public function addFilesystem(string $prefix, FileSystem $filesystem);

    /**
     * Check if filesystem exists
     * @param string $prefix
     */
    public function hasFileSystem(string $prefix): bool;
}

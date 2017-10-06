<?php

namespace NGSOFT\Api\Contracts;

interface FilePathManager {

    const VALID_PREFIX = '/^[a-z][a-z0-9]+$/';
    const SEPARATOR = '://';

    public function getFileSystem(string $prefix): FileSystem;

    public function addFilesystem(string $prefix, FileSystem $filesystem);

    public function hasFileSystem(string $prefix): bool;
}

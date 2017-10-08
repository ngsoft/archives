<?php

namespace NGSOFT\Api\Converters;

use NGSOFT\Api\Exception\NotFoundException;

/**
 * Utility class for converters
 */
abstract class BaseConverter {

    /**
     * Try to create file tree if file and/or parent folder does not exists
     * @param string $filename
     * @return bool
     */
    public static function createFileTree(string $filename): bool {
        if (file_exists($filename)) {
            if (is_dir($filename))
                return false;
            return is_writable($filename);
        }

        $dirname = dirname($filename);
        if (!file_exists($dirname))
            @ mkdir($dirname, 0777, true);
        return touch($filename);
    }

    /**
     * Open a file and get its contents
     * @param string $filename
     * @return string
     * @throws NotFoundException
     */
    public static function getFileContents(string $filename) {
        if (!file_exists($filename)) {
            throw new NotFoundException('filename %s supplied does not exists.', $filename);
        }

        if ($data = @file_get_contents($filename)) {
            return $data;
        }
        return "";
    }

    /**
     * open a file and write contents
     * @param string $filename
     * @param string $contents
     * @return bool
     */
    public static function setFileContents(string $filename, string $contents): bool {
        if (static::createFileTree($filename)) {
            return @file_put_contents($filename, $contents, LOCK_EX);
        }
        return false;
    }

}

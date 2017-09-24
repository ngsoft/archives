<?php

namespace NGSOFT\Api\Converters;

use NGSOFT\Api\Exception\InvalidFormatException;
use Nette\Neon\Neon;
use Nette\Neon\Exception;

class NeonConverter extends NullConverter {

    /**
     * {@inheritdoc}
     */
    public static function decode(string $formatted) {
        try {
            if ($data = Neon::decode($formatted)) {
                return $data;
            }
            return null;
        }
        //throws \InvalidArgumentException and Nette\Neon\Exception
        catch (\Exception $e) {
            throw new InvalidFormatException('Cannot decode NEON string, %s', $e->getMessage());
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function encode($var, $options = null): string {
        try {
            if ($formatted = Neon::encode($var, Neon::BLOCK)) {
                return $formatted;
            }
            return "";
        }
        //encoder doesn't throw exception, but we never know, here to prevent BC break
        catch (\Exception $e) {
            throw new InvalidFormatException('Cannot encode NEON string, %s', $e->getMessage());
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function getFormat(): string {
        return 'neon';
    }

}

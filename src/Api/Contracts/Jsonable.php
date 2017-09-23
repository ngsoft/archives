<?php

namespace NGSOFT\Api\Contracts;

interface Jsonable {

    const JSON_HEX_TAG = 1;
    const JSON_HEX_AMP = 2;
    const JSON_HEX_APOS = 4;
    const JSON_HEX_QUOT = 8;
    const JSON_FORCE_OBJECT = 16;
    const JSON_NUMERIC_CHECK = 32;
    const JSON_UNESCAPED_SLASHES = 64;
    const JSON_PRETTY_PRINT = 128;
    const JSON_UNESCAPED_UNICODE = 256;
    const JSON_PARTIAL_OUTPUT_ON_ERROR = 512;
    const JSON_PRESERVE_ZERO_FRACTION = 1024;
    const JSON_UNESCAPED_LINE_TERMINATORS = 12345;

    /**
     * Export class data to json format
     * @param int $options
     */
    public function toJson(int $options = 0): string;
}

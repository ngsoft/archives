<?php

namespace NGSOFT\Api\Converters;

use NGSOFT\Api\Contracts\Exportable\Jsonable;
use NGSOFT\Api\Exception\InvalidFormatException;
use NGSOFT\Api\Exception\UnexpectedValueException;
use Webmozart\Json\JsonDecoder;
use Webmozart\Json\JsonEncoder;
use Webmozart\Json\DecodingFailedException;
use Webmozart\Json\EncodingFailedException;

class JsonConverter extends NullConverter {

    /**
     * @var JsonEncoder
     */
    private static $encoder;

    /**
     * @var JsonDecoder
     */
    private static $decoder;

    /**
     * {@inheritdoc}
     */
    public static function decode(string $formatted) {
        self::initialize();
        try {
            if ($data = self::$decoder->decode($formatted)) {
                return $data;
            }
            return null;
        } catch (DecodingFailedException $e) {
            throw new InvalidFormatException($e->getMessage());
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function encode($var, $options = null): string {
        self::initialize();
        if (is_array($options)) {
            self::setOptions($options);
        }

        try {
            if ($formatted = self::$encoder->encode($var)) {
                return $formatted;
            }
            return "";
        } catch (EncodingFailedException $e) {
            throw new InvalidFormatException($e->getMessage());
        }
    }

    /**
     * {@inheritdoc}
     */
    public static function getFormat(): string {
        return 'json';
    }

    private static function initialize() {

        $decoder = &self::$decoder;
        $encoder = &self::$encoder;

        //configure decoder
        $decoder = new JsonDecoder();
        $decoder->setObjectDecoding($decoder::ASSOC_ARRAY);
        $decoder->setBigIntDecoding($decoder::STRING);
        //configure encoder
        $encoder = new JsonEncoder();
        $encoder->setPrettyPrinting(true);
    }

    /**
     * JsonEncoder Adapter
     * @param array $options
     */
    private static function setOptions(array $options) {
        if (!count($options)) {
            return;
        }

        $encoder = &self::$encoder;
        $encoder = new JsonEncoder;

        $methods = [
            Jsonable::JSON_HEX_TAG => ["setEscapeGtLt" => true],
            Jsonable::JSON_HEX_AMP => ["setEscapeAmpersand" => true],
            Jsonable::JSON_HEX_APOS => ["setEscapeSingleQuote" => true],
            Jsonable::JSON_HEX_QUOT => ["setEscapeDoubleQuote" => true],
            Jsonable::JSON_FORCE_OBJECT => ["setArrayEncoding" => $encoder::JSON_OBJECT],
            Jsonable::JSON_NUMERIC_CHECK => ["setNumericEncoding" => $encoder::JSON_NUMBER],
            Jsonable::JSON_UNESCAPED_SLASHES => ["setEscapeSlash" => false],
            Jsonable::JSON_PRETTY_PRINT => ["setPrettyPrinting" => true],
            Jsonable::JSON_UNESCAPED_UNICODE => ["setEscapeUnicode" => false],
            //not in webmozart class
            Jsonable::JSON_PARTIAL_OUTPUT_ON_ERROR => [],
            Jsonable::JSON_PRESERVE_ZERO_FRACTION => [],
            Jsonable::JSON_UNESCAPED_LINE_TERMINATORS => [],
        ];


        array_map(function($int)use($encoder, $methods) {
            if (!is_int($int)) {
                throw new UnexpectedValueException('Expected option value in array is integer type, %s given', gettype($int));
            }
            if (!array_key_exists($int, $methods)) {
                throw new UnexpectedValueException('Expected option value is incorrect %d', $int);
            }
            if (!count($methods[$int])) {
                return;
            }
            $method = key($methods[$int]);
            $value = current($methods[$int]);
            $encoder->$method($value);
            return;
        }, $options);
    }

}

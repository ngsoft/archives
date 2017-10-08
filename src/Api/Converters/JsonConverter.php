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
     * {@inheritdoc}
     */
    public static function decode(string $formatted) {
        try {
            $decoder = new JsonDecoder();
            $decoder->setObjectDecoding($decoder::ASSOC_ARRAY);
            $decoder->setBigIntDecoding($decoder::STRING);
            if ($data = $decoder->decode($formatted)) {
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
    public static function encode($var, ...$options): string {
        $options = count($options) ?: [];

        try {
            $encoder = self::getEncoder($options);
            if ($formatted = $encoder->encode($var)) {
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

    /**
     * JsonEncoder Adapter
     * @param array $options
     * @return JsonEncoder
     */
    private static function getEncoder(array $options) {
        $encoder = new JsonEncoder;
        if (!count($options)) {
            return $encoder;
        }



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
        if (!count($options))
            return $encoder;


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

        return $encoder;
    }

}

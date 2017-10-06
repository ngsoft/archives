<?php

namespace NGSOFT\Api\Exception;

trait Exception {

    public function __construct(string $message = null, ...$args) {
        if (!($this instanceof \Throwable)) {
            return;
        }



        $message = count($args) ? call_user_func_array('sprintf', array_merge([$message], $args)) : $message;
        parent::__construct($message, 0);
    }

}

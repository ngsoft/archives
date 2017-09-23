<?php

namespace NGSOFT\API\Exception;

trait Exception {

    public function __construct(...$args) {
        if (!($this instanceof \Throwable)) {
            return;
        }
        $message = count($args) ? call_user_func_array('sprintf', $args) : null;
        parent::__construct($message, 0);
    }

}

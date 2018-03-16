<?php

namespace NGSOFT\Api\Exception;

use Psr\Container\ContainerExceptionInterface;

class ContainerException extends \Exception implements ContainerExceptionInterface {

    use Exception;
}

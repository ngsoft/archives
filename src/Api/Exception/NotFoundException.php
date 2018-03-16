<?php

namespace NGSOFT\Api\Exception;

use Psr\Container\NotFoundExceptionInterface;

class NotFoundException extends \Exception implements NotFoundExceptionInterface {

    use Exception;
}

<?php

/**
 * Class loader for NGSOFT Projects
 * Will detect composer and use it or declare it's own method to load classes
 * Be sure to declare the project corresponding namespace and the list of classes below
 */

namespace NGSOFT;

/**
 * Detect Composer
 */
call_user_func_array(function($check, $has_dependencies = false) {
    $composer = "Composer\\Autoload\\ClassLoader";
    //try to find composer
    if (!class_exists($composer)) {
        call_user_func(function () {
            $paths = [
                //is main project
                realpath(dirname(__DIR__) . '/vendor'),
                //is dependency
                realpath(dirname(dirname(dirname(__DIR__))))
            ];
            foreach ($paths as $dir) {
                if ($dir) {
                    $filename = sprintf("%s/autoload.php", $dir);
                    if (file_exists($filename)) {
                        return include_once $filename;
                    }
                }
            }
        });
    }
    $check = is_array($check) ? $check : [$check];

    $count = 0;
    foreach ($check as $classname) {
        if (!class_exists($classname)) {
            break;
        }
        $count++;
    }
    if (count($check) == $count) {
        return;
    }
    //use composer autoloader
    if (class_exists($composer)) {
        $loader = new $composer;
        $loader->addPsr4(sprintf("%s\\", __NAMESPACE__), __DIR__);
        $loader->register();
    }
    //Project has dependencies
    elseif ($has_dependencies) {
        throw new \Exception("Composer not found, please run composer install where composer.json file is located.\n");
        exit(1);
    }
    //use PSR-4 custom loader
    else {
        call_user_func_array(function($prefix, $path) {
            if ($path = realpath($path) and is_dir($path)) {
                spl_autoload_register(function ($class)use($prefix, $path) {
                    if (strpos($class, $prefix) === 0) {
                        $relative = substr($class, strlen($prefix));
                        $relative = str_replace('\\', DIRECTORY_SEPARATOR, $relative);
                        $filename = $path . DIRECTORY_SEPARATOR . $relative . '.php';
                        if ($filename = realpath($filename)) {
                            include $filename;
                        }
                    }
                });
            }
        }, [__NAMESPACE__, __DIR__]);
    }
}, [[
//list of classes to detect
__NAMESPACE__ . "\\Api\\Contracts\Jsonable"
    ],
    //project has dependencies that needs composer autoloader
    false
]);

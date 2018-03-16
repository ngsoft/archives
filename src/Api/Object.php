<?php

namespace NGSOFT\Api;

use NGSOFT\Api\Exception\ContainerException,
    NGSOFT\Api\Exception\NotFoundException,
    Psr\Container\ContainerInterface;

class Object implements \ArrayAccess, \Countable, \IteratorAggregate, \JsonSerializable, \Serializable, ContainerInterface, Contracts\Importable, Contracts\Exportable {

    /**
     * @var array
     */
    protected $properties = [];

    use Importable,
        Exportable;

    /**
     * @param array $properties Properties to import
     */
    public function __construct(array $properties = null) {
        if (is_array($properties)) {
            $this->import()->fromArray($properties);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function &__get($prop) {
        $result = null;
        if (!$this->offsetExists($prop))
            return $result;
        $result = &$this->properties[$prop];
        return $result;
    }

    /**
     * {@inheritdoc}
     */
    public function __isset($prop) {
        return $this->offsetExists($prop);
    }

    /**
     * {@inheritdoc}
     */
    public function __set($prop, $value) {
        $this->offsetSet($prop, $value);
    }

    /**
     * {@inheritdoc}
     */
    public function __toString() {
        return $this->export()->toJson();
    }

    /**
     * {@inheritdoc}
     */
    public function __unset($prop) {
        $this->offsetUnset($prop);
    }

    /**
     * {@inheritdoc}
     */
    public function __getData() {
        return $this->properties;
    }

    /**
     * {@inheritdoc}
     */
    public function __setData($data, Importer $importer) {
        if (is_array($data)) {
            foreach ($data as $key => $val) {
                if (is_array($val)) {
                    $this->offsetSet($key, new Object($val));
                    continue;
                }
                $this->$key = $val;
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function get($id) {
        if (!$this->offsetExists($id)) {
            throw new NotFoundException('%s Not Found', $id);
        }

        $data = $this->offsetGet($id);
        if (is_null($data)) {
            throw new ContainerException('%s invalid data returned', $id);
        }
        return $data;
    }

    /**
     * {@inheritdoc}
     */
    public function has($id) {
        return $this->offsetExists($id);
    }

    /**
     * {@inheritdoc}
     */
    public function offsetExists($offset) {
        return array_key_exists($offset, $this->properties);
    }

    /**
     * {@inheritdoc}
     */
    public function offsetGet($offset) {
        if ($this->offsetExists($offset))
            return $this->properties[$offset];
        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function offsetSet($offset, $value) {
        if (is_array($value)) {
            $value = new Object($value);
        }
        if (is_null($offset)) {
            $this->properties[] = $value;
            return;
        }
        $this->properties[$offset] = $value;
    }

    /**
     * {@inheritdoc}
     */
    public function offsetUnset($offset) {
        if ($this->offsetExists($offset))
            unset($this->properties[$offset]);
    }

    /**
     * {@inheritdoc}
     */
    public function count() {
        return count($this->properties);
    }

    /**
     * {@inheritdoc}
     */
    public function getIterator() {
        return new \ArrayIterator($this->properties);
    }

    /**
     * {@inheritdoc}
     */
    public function jsonSerialize() {
        return $this->export()->toArray();
    }

    /**
     * {@inheritdoc}
     */
    public function serialize() {
        return serialize($this->properties);
    }

    /**
     * {@inheritdoc}
     */
    public function unserialize($serialized) {
        $data = unserialize($serialized);
        if (is_array($data)) {
            $this->import()->fromArray($data);
        }
    }

}

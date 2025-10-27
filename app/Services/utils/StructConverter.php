<?php

namespace App\Services\utils;

use Google\Protobuf\ListValue;
use Google\Protobuf\Struct;
use Google\Protobuf\Value;

class StructConverter
{
    public static function convert(Struct $struct): array
    {
        $array = [];
        foreach ($struct->getFields() as $key => $value) {
            $array[$key] = self::convertValue($value);
        }

        return $array;
    }

    private static function convertValue(Value $value): mixed
    {
        if ($value->hasNullValue()) {
            return null;
        }
        if ($value->hasBoolValue()) {
            return $value->getBoolValue();
        }
        if ($value->hasNumberValue()) {
            return $value->getNumberValue();
        }
        if ($value->hasStringValue()) {
            return $value->getStringValue();
        }
        if ($value->hasStructValue()) {
            return self::convert($value->getStructValue());
        }
        if ($value->hasListValue()) {
            return self::convertList($value->getListValue());
        }
    }

    private static function convertList(ListValue $listValue): array
    {
        $array = [];
        foreach ($listValue->getValues() as $value) {
            $array[] = self::convertValue($value);
        }

        return $array;
    }
}

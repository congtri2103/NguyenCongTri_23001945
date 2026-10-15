<?php
declare(strict_types=1);

/**
 * @return array<string, string>
 */
function validateProduct(string $name, string $price, string $quantity): array
{
    $errors = [];

    if (trim($name) === '') {
        $errors['name'] = 'Tên sản phẩm không được để trống.';
    } elseif (
        function_exists('mb_strlen')
        ? mb_strlen(trim($name), 'UTF-8') > 100
        : strlen(trim($name)) > 100
    ) {
        $errors['name'] = 'Tên sản phẩm không được vượt quá 100 ký tự.';
    }

    if (!is_numeric($price) || !is_finite((float) $price) || (float) $price <= 0) {
        $errors['price'] = 'Giá phải là số lớn hơn 0.';
    } elseif ((float) $price > 99999999.99) {
        $errors['price'] = 'Giá không được vượt quá 99.999.999,99.';
    }

    $validatedQuantity = filter_var($quantity, FILTER_VALIDATE_INT);
    if ($validatedQuantity === false || $validatedQuantity < 0) {
        $errors['quantity'] = 'Số lượng phải là số nguyên lớn hơn hoặc bằng 0.';
    }

    return $errors;
}

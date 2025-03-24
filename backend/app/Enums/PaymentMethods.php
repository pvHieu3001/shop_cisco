<?php
namespace App\Enums;

enum PaymentMethods: string
{
    case COD = 'Thanh toán khi nhận hàng';
    case VNPAY = 'Thanh toán bằng VNPAY';

    public static function getValues(): array
    {
        return array_column(PaymentMethods::cases(), 'value');
    }

    public static function getOrder(PaymentMethods $type): string
    {
        return match($type) {
            self::COD => 1,
            self::VNPAY => 2,
        };
    }
}

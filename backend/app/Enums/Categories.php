<?php
namespace App\Enums;

enum Categories: string
{
    case LIVR = 'Nội Thất Phòng Khách';
    case BEDR = 'Nội Thất Phòng Ngủ';
    case KTCH = 'Nội Thất Nhà Bếp';
    case ART = 'Đồ Gỗ Mỹ Nghệ';

    public static function getValues(): array
    {
        return array_column(Categories::cases(), 'value');
    }

    public static function getSlug(string $name): string
    {
        return match($name) {
            'Nội Thất Phòng Khách' => "LIVR",
            'Nội Thất Phòng Ngủ' => "BEDR",
            'Nội Thất Nhà Bếp' => "KTCH",
            'Đồ Gỗ Mỹ Nghệ' => "ART",
        };
    }
}

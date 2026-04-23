<?php

declare(strict_types=1);

namespace App\Domain\Carts\Services;

use App\Domain\Coupons\Services\CouponService;
use App\Domain\Products\Services\ProductService;

class CartPageService
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly CouponService $couponService,
        private readonly ProductService $productService,
    ) {}

    public function getPageData(bool $preferBuyNow): array
    {
        $cart = $this->cartService->getCart();
        $isBuyNow = $preferBuyNow && $this->cartService->hasBuyNowItem();

        return [
            'cart' => $isBuyNow ? $this->cartService->getBuyNowItem() : $cart,
            'isBuyNow' => $isBuyNow,
            'popularProducts' => $this->productService->getCartPopularProducts(),
            'coupon' => $this->couponService->refreshSessionCoupon($cart['total']),
        ];
    }
}

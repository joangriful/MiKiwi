<?php

declare(strict_types=1);

namespace Tests\Feature\Exceptions;

use App\Exceptions\CartEmptyException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidOrderException;
use Illuminate\Http\Request;
use Tests\TestCase;

class ExceptionsTest extends TestCase
{
    public function test_insufficient_stock_exception_has_correct_data(): void
    {
        $exception = new InsufficientStockException(
            'Test Product',
            5,
            10,
            'SKU-123'
        );

        $this->assertEquals('Test Product', $exception->getProductName());
        $this->assertEquals(5, $exception->getAvailableStock());
        $this->assertEquals(10, $exception->getRequestedQuantity());
        $this->assertEquals('SKU-123', $exception->getProductIdentifier());
        $this->assertEquals(5, $exception->getShortage());
        $this->assertFalse($exception->isOutOfStock());
    }

    public function test_insufficient_stock_exception_detects_out_of_stock(): void
    {
        $exception = new InsufficientStockException(
            'Test Product',
            0,
            10,
            'SKU-123'
        );

        $this->assertTrue($exception->isOutOfStock());
    }

    public function test_insufficient_stock_exception_renders_json(): void
    {
        $exception = new InsufficientStockException(
            'Test Product',
            5,
            10,
            'SKU-123'
        );

        $request = new Request;
        $response = $exception->render($request);

        $this->assertEquals(422, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertEquals('insufficient_stock', $data['error']);
        $this->assertEquals('Test Product', $data['product']['name']);
        $this->assertEquals(5, $data['stock']['available']);
        $this->assertEquals(10, $data['stock']['requested']);
    }

    public function test_cart_empty_exception_has_context(): void
    {
        $exception = new CartEmptyException('checkout');

        $this->assertEquals('checkout', $exception->getContext());
    }

    public function test_cart_empty_exception_renders_json(): void
    {
        $exception = new CartEmptyException('checkout');

        $request = new Request;
        $response = $exception->render($request);

        $this->assertEquals(422, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertEquals('cart_empty', $data['error']);
        $this->assertEquals('checkout', $data['context']);
    }

    public function test_invalid_order_exception_has_reason(): void
    {
        $exception = new InvalidOrderException('not_found', 'ORD-123');

        $this->assertEquals('not_found', $exception->getReason());
        $this->assertEquals('ORD-123', $exception->getOrderNumber());
    }

    public function test_invalid_order_exception_renders_json(): void
    {
        $exception = new InvalidOrderException('not_found', 'ORD-123');

        $request = new Request;
        $response = $exception->render($request);

        $this->assertEquals(422, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertEquals('invalid_order', $data['error']);
        $this->assertEquals('not_found', $data['reason']);
        $this->assertEquals('ORD-123', $data['order_number']);
    }
}

<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Domain\Orders\Actions\GenerateOrderInvoice;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class GenerateOrderInvoiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_order_invoice_pdf_download(): void
    {
        $order = Order::factory()->create([
            'order_number' => 'ORD-20260506-TEST1',
        ]);

        $this->expectPdfLoadViewForOrder($order);

        $response = app(GenerateOrderInvoice::class)->execute($order);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringContainsString(
            'factura-ORD-20260506-TEST1.pdf',
            (string) $response->headers->get('Content-Disposition')
        );
    }

    private function expectPdfLoadViewForOrder(Order $order): void
    {
        $this->shouldReceivePdfLoadView()
            ->once()
            ->with('invoices.order', Mockery::on(fn (array $data): bool => $data['order']->is($order)))
            ->andReturn($this->fakePdfDownload());
    }

    private function shouldReceivePdfLoadView(): mixed
    {
        $facadeClass = 'Barryvdh\\DomPDF\\Facade\\Pdf';

        if (! class_exists($facadeClass)) {
            class_alias(TestPdfFacade::class, $facadeClass);
        }

        return $facadeClass::shouldReceive('loadView');
    }

    private function fakePdfDownload(): mixed
    {
        $pdfClass = 'Barryvdh\\DomPDF\\PDF';

        if (! class_exists($pdfClass)) {
            return new class
            {
                public function download(string $filename)
                {
                    return response('fake pdf', 200, [
                        'Content-Type' => 'application/pdf',
                        'Content-Disposition' => 'attachment; filename="'.$filename.'"',
                    ]);
                }
            };
        }

        $pdf = Mockery::mock($pdfClass);
        $pdf->shouldReceive('download')
            ->once()
            ->andReturnUsing(fn (string $filename) => response('fake pdf', 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            ]));

        return $pdf;
    }
}

class TestPdfFacade
{
    private static ?\Mockery\MockInterface $mock = null;

    public static function shouldReceive(string $method): mixed
    {
        self::$mock = Mockery::mock();

        return self::$mock->shouldReceive($method);
    }

    public static function __callStatic(string $method, array $arguments): mixed
    {
        return self::$mock->{$method}(...$arguments);
    }
}

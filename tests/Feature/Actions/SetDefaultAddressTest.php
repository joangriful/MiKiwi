<?php

declare(strict_types=1);

namespace Tests\Feature\Actions;

use App\Actions\Addresses\SetDefaultAddress;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SetDefaultAddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_set_address_as_default(): void
    {
        $user = User::factory()->create();

        $address1 = UserAddress::factory()->create([
            'user_id' => $user->id,
            'is_default' => true,
        ]);

        $address2 = UserAddress::factory()->create([
            'user_id' => $user->id,
            'is_default' => false,
        ]);

        $action = app(SetDefaultAddress::class);
        $action->execute($address2->id, (string) $user->id);

        $this->assertFalse($address1->fresh()->is_default);
        $this->assertTrue($address2->fresh()->is_default);
    }
}

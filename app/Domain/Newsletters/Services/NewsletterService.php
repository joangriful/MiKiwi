<?php

declare(strict_types=1);

namespace App\Domain\Newsletters\Services;

use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsletterService
{
    public function subscribe(string $email, ?string $gender): string
    {
        $genderMsg = ($gender === 'vulva')
            ? 'Esperamos que disfrutes de nuestros consejos especializados para el cuidado y placer de tu vulva.'
            : 'Esperamos que disfrutes de nuestros consejos especializados para el cuidado y placer de tu pene.';

        try {
            $user = User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'name' => $this->resolveUserName($email),
                    'password' => Str::random(40),
                ]
            );

            NewsletterSubscriber::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'email' => $email,
                    'subscribed_at' => now(),
                ]
            );

            $htmlContent = $this->getEmailTemplate($genderMsg);
            $apiKey = config('services.resend.key');

            if (! empty($apiKey)) {
                $response = Http::withToken($apiKey)->post('https://api.resend.com/emails', [
                    'from' => 'MiKiwi <onboarding@resend.dev>',
                    'to' => [$email],
                    'subject' => '¡Bienvenidx a MiKiwi! Tu regalo te espera 🎁',
                    'html' => $htmlContent,
                ]);

                if (! $response->successful()) {
                    Log::error('Resend API Error: '.$response->body());
                }
            } else {
                Log::warning('Resend API Key is missing in configuration.');
            }

            return '¡Gracias por suscribirte! Datos guardados correctamente.';
        } catch (\Exception $e) {
            Log::error('Newsletter Error: '.$e->getMessage());
            return '¡Gracias! Te hemos anotado en nuestra lista.';
        }
    }

    private function resolveUserName(string $email): string
    {
        $candidate = trim(Str::before($email, '@'));

        return $candidate !== '' ? $candidate : 'newsletter-user';
    }

    private function getEmailTemplate(string $genderMsg): string
    {
        return <<<HTML
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h1 style="color: #d697c8; text-align: center;">¡Bienvenidx a MiKiwi! 🥝​</h1>
            <p>Hola, gracias por suscribirte a nuestra newsletter.</p>

            <p><strong>$genderMsg</strong></p>

            <div style="background: #f8f5f0; padding: 20px; text-align: center; border: 2px dashed #d697c8; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0;">Tu cupón de bienvenida del 10% es:</p>
                <h2 style="color: #d697c8; margin: 10px 0;">MIKIWI10</h2>
                <p style="font-size: 12px;">Úsalo en tu primera compra en mikiwi.com</p>
            </div>

            <h3>Productos destacados que te encantarán:</h3>
            <ul>
                <li><strong>Satisfyer Pro 2:</strong> El favorito indiscutible.</li>
                <li><strong>Lelo Dot:</strong> Innovación y placer preciso.</li>
                <li><strong>Aceites y Lubricantes:</strong> Para una experiencia completa.</li>
            </ul>

            <div style="text-align: center; margin-top: 30px;">
                <a href="http://127.0.0.1:8000" style="background: #d697c8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold;">IR A LA TIENDA</a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="font-size: 10px; color: #999; text-align: center;">
                Has recibido este correo porque te has suscrito en mikiwi.com.<br>
                © 2026 MiKiwi. Todos los derechos reservados.
            </p>
        </div>
HTML;
    }
}

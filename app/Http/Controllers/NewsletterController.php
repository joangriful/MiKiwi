<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Subscriber;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ], [
            'email.required' => 'El campo de correo electrónico es obligatorio.',
            'email.email' => 'Introduce una dirección de correo válida.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors([
                'newsletter' => $validator->errors()->first('email')
            ]);
        }

        $email = $request->email;
        $gender = $request->gender; // selection: vulva or pene

        // Determinar mensaje basado en género
        $genderMsg = ($gender === 'vulva')
            ? "Esperamos que disfrutes de nuestros consejos especializados para el cuidado y placer de tu vulva."
            : "Esperamos que disfrutes de nuestros consejos especializados para el cuidado y placer de tu pene.";

        try {
            // 1. Guardar en Base de Datos (Seguridad ante todo)
            Subscriber::updateOrCreate(
                ['email' => $email],
                ['gender' => $gender]
            );

            // 2. Intentar enviar correo con Resend
            $htmlContent = $this->getEmailTemplate($genderMsg);
            $apiKey = env('RESEND_API_KEY');

            if (!empty($apiKey)) {
                $response = Http::withToken($apiKey)->post('https://api.resend.com/emails', [
                    'from' => 'MiKiwi <onboarding@resend.dev>',
                    'to' => [$email],
                    'subject' => '¡Bienvenidx a MiKiwi! Tu regalo te espera 🎁',
                    'html' => $htmlContent,
                ]);
            }

            return back()->with('success', '¡Gracias por suscribirte! Datos guardados correctamente.');
        } catch (\Exception $e) {
            Log::error('Newsletter Error: ' . $e->getMessage());
            return back()->with('success', '¡Gracias! Te hemos anotado en nuestra lista.');
        }
    }

    /**
     * Aquí puedes tocar el mensaje de correo para poner lo que tú quieras.
     */
    private function getEmailTemplate($genderMsg)
    {
        return <<<HTML
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h1 style="color: #d697c8; text-align: center;">¡Bienvenidx a MiKiwi! ✨</h1>
            <p>Hola, gracias por suscribirte a nuestra newsletter.</p>
            
            <p><strong>$genderMsg</strong></p>

            <div style="background: #f8f5f0; padding: 20px; text-align: center; border: 2px dashed #d697c8; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0;">Tu cupón de bienvenida del 10% es:</p>
                <h2 style="color: #d697c8; margin: 10px 0;">MIKIWI10</h2>
                <p style="font-size: 12px;">Úsalo en tu primera compra en mikiwi.com</p>
            </div>

            <h3>🔥 Productos destacados que te encantarán:</h3>
            <ul>
                <li><strong>Satisfyer Pro 2:</strong> El favorito indiscutible.</li>
                <li><strong>Lelo Dot:</strong> Innovación y placer preciso.</li>
                <li><strong>Aceites y Lubricantes:</strong> Para una experiencia completa.</li>
            </ul>

            <div style="text-align: center; margin-top: 30px;">
                <a href="https://mikiwi.com" style="background: #d697c8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold;">IR A LA TIENDA</a>
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

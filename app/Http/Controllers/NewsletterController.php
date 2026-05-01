<?php

namespace App\Http\Controllers;

use App\Domain\Newsletters\Services\NewsletterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    protected NewsletterService $newsletterService;

    public function __construct(NewsletterService $newsletterService)
    {
        $this->newsletterService = $newsletterService;
    }

    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ], [
            'email.required' => 'El campo de correo electrónico es obligatorio.',
            'email.email' => 'Introduce una dirección de correo válida.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors([
                'newsletter' => $validator->errors()->first('email')
            ]);
        }

        try {
            $message = $this->newsletterService->subscribe($request->email, $request->gender);

            return back()->with('success', $message);
        } catch (\Throwable $exception) {
            Log::error('Newsletter subscription failed: '.$exception->getMessage());

            return back()->withErrors([
                'newsletter' => 'No pudimos completar tu suscripción ahora mismo. Inténtalo de nuevo en unos minutos.',
            ]);
        }
    }
}

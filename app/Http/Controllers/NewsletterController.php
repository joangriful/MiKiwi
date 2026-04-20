<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Domain\Newsletters\Services\NewsletterService;

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

        $message = $this->newsletterService->subscribe($request->email, $request->gender);

        return back()->with('success', $message);
    }
}

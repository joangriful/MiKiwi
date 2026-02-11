<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:newsletter_subscribers,email'
        ]);

        if ($validator->fails()) {
            return back()->withErrors([
                'newsletter' => $validator->errors()->first('email')
            ]);
        }

        NewsletterSubscriber::create([
            'email' => $request->email
        ]);

        return back()->with('success', '¡Gracias por suscribirte a nuestro newsletter!');
    }
}

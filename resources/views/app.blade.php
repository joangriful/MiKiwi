<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_balance_wallet,add,add_card,arrow_back,bolt,calendar_month,card_giftcard,check,check_circle,chevron_left,chevron_right,close,cloud_upload,content_copy,credit_card,credit_card_off,delete,download,edit,error,event_busy,expand_more,favorite,image,inventory_2,keyboard_arrow_down,keyboard_arrow_left,keyboard_arrow_right,link,list,location_on,logout,magic_button,payments,person,priority_high,quiz,refresh,remove,rotate_left,rotate_right,science,search,security,shield_moon,shopping_cart,star,star_border,tune,upload,verified_user,visibility,warning,widgets,group,zoom_in" />

        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="{{ asset('assets/icons/mikiwi_kiwi.svg') }}" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

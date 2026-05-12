<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura {{ $order->order_number }}</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #222b24;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .container {
            padding: 40px;
        }
        .header {
            background-color: #f8f5f0;
            padding: 40px;
            margin-bottom: 30px;
            border-bottom: 2px solid #99b849;
        }
        .header-table {
            width: 100%;
        }
        .logo {
            width: 80px;
            height: auto;
        }
        .brand-name {
            font-size: 24px;
            font-weight: bold;
            color: #222b24;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 5px;
        }
        .invoice-title {
            font-size: 36px;
            font-weight: 900;
            color: #222b24;
            margin: 0;
            text-align: right;
        }
        .invoice-meta {
            text-align: right;
            margin-top: 10px;
            color: #66672a;
            font-size: 14px;
        }
        .invoice-number-box {
            display: inline-block;
            background: #99b849;
            color: white;
            padding: 5px 15px;
            font-weight: bold;
            margin-top: 10px;
            border-radius: 4px;
        }
        
        .info-grid {
            width: 100%;
            margin-bottom: 40px;
        }
        .info-grid td {
            vertical-align: top;
            width: 50%;
        }
        .section-label {
            color: #99b849;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        .info-box {
            font-size: 14px;
            line-height: 1.5;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .items-table th {
            background-color: #222b24;
            color: #ffffff;
            text-align: left;
            padding: 12px 15px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e0db;
            font-size: 14px;
        }
        .items-table tr:nth-child(even) {
            background-color: #fcfbf9;
        }
        
        .totals-container {
            width: 100%;
        }
        .totals-table {
            width: 300px;
            margin-left: auto;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 10px;
            font-size: 14px;
        }
        .totals-table .label {
            text-align: right;
            color: #66672a;
        }
        .totals-table .value {
            text-align: right;
            font-weight: bold;
        }
        .totals-table .grand-total {
            background-color: #f8f5f0;
            font-size: 18px;
            color: #222b24;
            border-top: 2px solid #99b849;
        }
        
        .payment-status {
            margin-top: 40px;
            padding: 20px;
            background-color: #f8f5f0;
            border-radius: 8px;
            width: 300px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #99b849;
            color: white;
        }
        
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e2e0db;
        }
    </style>
</head>
<body>
    <div class="header">
        <table class="header-table">
            <tr>
                <td>
                    <svg width="60" height="60" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.626 20.0244C22.626 20.1904 22.5967 20.3271 22.5381 20.4346C22.4795 20.542 22.3623 20.5957 22.1865 20.5957H19.0957C18.9883 20.5957 18.8955 20.542 18.8174 20.4346C18.749 20.3174 18.7148 20.1807 18.7148 20.0244V5.08301C18.7148 4.37988 18.8613 3.7207 19.1543 3.10547C19.4473 2.49023 19.8428 1.95312 20.3408 1.49414C20.8486 1.02539 21.4297 0.65918 22.084 0.395508C22.748 0.131836 23.4463 0 24.1787 0C24.833 0 25.458 0.107422 26.0537 0.322266C26.6592 0.537109 27.2061 0.834961 27.6943 1.21582C28.1729 0.834961 28.71 0.537109 29.3057 0.322266C29.9111 0.107422 30.5459 0 31.21 0C31.9424 0 32.6406 0.131836 33.3047 0.395508C33.9688 0.65918 34.5498 1.02539 35.0479 1.49414C35.5459 1.95312 35.9414 2.49023 36.2344 3.10547C36.5371 3.7207 36.6885 4.37988 36.6885 5.08301V20.0098C36.6885 20.1562 36.6543 20.293 36.5859 20.4199C36.5176 20.5371 36.4004 20.5957 36.2344 20.5957H33.2607C33.1045 20.5957 32.9873 20.5371 32.9092 20.4199C32.8311 20.3027 32.792 20.166 32.792 20.0098V5.30273C32.792 5.06836 32.7529 4.84863 32.6748 4.64355C32.6064 4.42871 32.5039 4.24316 32.3672 4.08691C32.2402 3.9209 32.0791 3.78906 31.8838 3.69141C31.6885 3.59375 31.4688 3.54492 31.2246 3.54492C30.9805 3.54492 30.7607 3.59375 30.5654 3.69141C30.3799 3.7793 30.2188 3.90137 30.082 4.05762C29.9551 4.21387 29.8525 4.39453 29.7744 4.59961C29.7061 4.80469 29.667 5.01953 29.6572 5.24414V20.0391C29.6572 20.1953 29.6279 20.3271 29.5693 20.4346C29.5205 20.542 29.4082 20.5957 29.2324 20.5957H26.1416C26.0342 20.5957 25.9414 20.542 25.8633 20.4346C25.7852 20.3174 25.7461 20.1807 25.7461 20.0244V5.30273C25.7461 5.06836 25.7119 4.84863 25.6436 4.64355C25.5752 4.42871 25.4727 4.24316 25.3359 4.08691C25.209 3.9209 25.0479 3.78906 24.8525 3.69141C24.6572 3.59375 24.4375 3.54492 24.1934 3.54492C23.9395 3.54492 23.7148 3.59375 23.5195 3.69141C23.334 3.78906 23.1729 3.9209 23.0361 4.08691C22.8994 4.24316 22.7969 4.42871 22.7285 4.64355C22.6602 4.84863 22.626 5.06836 22.626 5.30273V20.0244Z" fill="#99b849" />
                        <path d="M38.6807 0.893555C38.6807 0.717773 38.7197 0.581055 38.7979 0.483398C38.8857 0.375977 39.0078 0.322266 39.1641 0.322266H42.0938C42.2598 0.322266 42.3818 0.375977 42.46 0.483398C42.5381 0.581055 42.5771 0.717773 42.5771 0.893555V20.0391C42.5771 20.4102 42.416 20.5957 42.0938 20.5957H39.1641C38.8418 20.5957 38.6807 20.4102 38.6807 20.0391V0.893555Z" fill="#99b849" />
                        <path d="M0 22.8936C0 22.7178 0.0390625 22.5811 0.117188 22.4834C0.205078 22.376 0.332031 22.3223 0.498047 22.3223H3.41309C3.5791 22.3223 3.70117 22.376 3.7793 22.4834C3.85742 22.5811 3.89648 22.7178 3.89648 22.8936V30.6719C4.50195 30.623 5.00488 30.4814 5.40527 30.2471C5.80566 30.0127 6.12305 29.7051 6.35742 29.3242C6.60156 28.9434 6.77246 28.4941 6.87012 27.9766C6.96777 27.459 7.0166 26.8926 7.0166 26.2773V22.9961C7.0166 22.7715 7.08496 22.6055 7.22168 22.498C7.36816 22.3809 7.52441 22.3223 7.69043 22.3223H10.4004C10.5957 22.3223 10.7324 22.3955 10.8105 22.542C10.8887 22.6787 10.9277 22.8154 10.9277 22.9521V26.7168C10.9277 27.9668 10.7129 29.0703 10.2832 30.0273C9.85352 30.9746 9.24805 31.7705 8.4668 32.415C9.31641 33.0596 9.9707 33.875 10.4297 34.8613C10.8984 35.8379 11.1328 36.9805 11.1328 38.2891V41.9805C11.1328 42.1172 11.0938 42.2539 11.0156 42.3906C10.9375 42.5273 10.8008 42.5957 10.6055 42.5957H7.88086C7.71484 42.5957 7.56348 42.542 7.42676 42.4346C7.29004 42.3271 7.22168 42.1611 7.22168 41.9365V38.7432C7.22168 38.1084 7.16797 37.5273 7.06055 37C6.96289 36.4727 6.78223 36.0186 6.51855 35.6377C6.26465 35.2568 5.92285 34.9541 5.49316 34.7295C5.07324 34.5049 4.54102 34.3779 3.89648 34.3486V42.0391C3.89648 42.4102 3.74023 42.5957 3.42773 42.5957H0.498047C0.166016 42.5957 0 42.4102 0 42.0391V22.8936Z" fill="#99b849" />
                        <path d="M12.8613 22.8936C12.8613 22.7178 12.9004 22.5811 12.9785 22.4834C13.0664 22.376 13.1885 22.3223 13.3447 22.3223H16.2744C16.4404 22.3223 16.5625 22.376 16.6406 22.4834C16.7188 22.5811 16.7578 22.7178 16.7578 22.8936V42.0391C16.7578 42.4102 16.5967 42.5957 16.2744 42.5957H13.3447C13.0225 42.5957 12.8613 42.4102 12.8613 42.0391V22.8936Z" fill="#99b849" />
                        <path d="M29.707 37.6152C29.707 37.8496 29.7412 38.0742 29.8096 38.2891C29.8779 38.4941 29.9756 38.6797 30.1025 38.8457C30.2393 39.0117 30.4053 39.1436 30.6006 39.2412C30.7959 39.3389 31.0205 39.3877 31.2744 39.3877C31.5283 39.3877 31.7529 39.3389 31.9482 39.2412C32.1436 39.1436 32.3047 39.0117 32.4316 38.8457C32.5684 38.6797 32.6709 38.4941 32.7393 38.2891C32.8076 38.0742 32.8418 37.8496 32.8418 37.6152V22.9082C32.8418 22.752 32.8809 22.6152 32.959 22.498C33.0371 22.3809 33.1494 22.3223 33.2959 22.3223H36.2695C36.4355 22.3223 36.5527 22.3857 36.6211 22.5127C36.6992 22.6299 36.7383 22.7617 36.7383 22.9082V37.835C36.7383 38.5381 36.6211 39.1973 36.3867 39.8125C36.1523 40.4277 35.8057 40.9697 35.3467 41.4385C34.8975 41.8975 34.3457 42.2588 33.6914 42.5225C33.0371 42.7861 32.2949 42.918 31.4648 42.918C30.6152 42.918 29.8926 42.7471 29.2969 42.4053C28.7012 42.0537 28.2275 41.585 27.876 40.999C27.5049 41.585 27.0117 42.0537 26.3965 42.4053C25.791 42.7471 25.0684 42.918 24.2285 42.918C23.3496 42.918 22.5684 42.7861 21.8848 42.5225C21.2109 42.2588 20.6396 41.8975 20.1709 41.4385C19.7119 40.9697 19.3604 40.4277 19.1162 39.8125C18.8818 39.1973 18.7646 38.5381 18.7646 37.835V22.8936C18.7646 22.7373 18.7988 22.6055 18.8672 22.498C18.9453 22.3809 19.0381 22.3223 19.1455 22.3223H22.2363C22.4023 22.3223 22.5146 22.3809 22.5732 22.498C22.6416 22.6055 22.6758 22.7373 22.6758 22.8936V37.6152C22.6758 37.8496 22.71 38.0742 22.7783 38.2891C22.8467 38.4941 22.9443 38.6797 23.0713 38.8457C23.208 39.0117 23.3691 39.1436 23.5547 39.2412C23.75 39.3389 23.9697 39.3877 24.2139 39.3877C24.4678 39.3877 24.6924 39.3389 24.8877 39.2412C25.0928 39.1436 25.2588 39.0117 25.3857 38.8457C25.5225 38.6797 25.625 38.4941 25.6934 38.2891C25.7617 38.0742 25.7959 37.8496 25.7959 37.6152V22.8936C25.7959 22.7373 25.835 22.6055 25.9131 22.498C25.9912 22.3809 26.084 22.3223 26.1914 22.3223H29.2676C29.4434 22.3223 29.5605 22.3809 29.6191 22.498C29.6777 22.6055 29.707 22.7373 29.707 22.8936V37.6152Z" fill="#99b849" />
                        <path d="M38.7305 22.8936C38.7305 22.7178 38.7695 22.5811 38.8477 22.4834C38.9355 22.376 39.0576 22.3223 39.2139 22.3223H42.1436C42.3096 22.3223 42.4316 22.376 42.5098 22.4834C42.5879 22.5811 42.627 22.7178 42.627 22.8936V42.0391C42.627 42.4102 42.4658 42.5957 42.1436 42.5957H39.2139C38.8916 42.5957 38.7305 42.4102 38.7305 42.0391V22.8936Z" fill="#99b849" />
                    </svg>
                    <div class="brand-name">MiKiwi</div>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                    <h1 class="invoice-title">FACTURA</h1>
                    <div class="invoice-meta">Fecha: {{ date('d/m/Y') }}</div>
                    <div class="invoice-number-box">Nº {{ $order->order_number }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="container">
        <table class="info-grid">
            <tr>
                <td>
                    <div class="section-label">Cliente</div>
                    <div class="info-box">
                        @if($order->billingAddress)
                            <strong>{{ $order->billingAddress->full_name }}</strong><br>
                            {{ $order->billingAddress->street_address }}<br>
                            {{ $order->billingAddress->postal_code }} {{ $order->billingAddress->city }}<br>
                            {{ $order->billingAddress->country }}<br>
                            T: {{ $order->billingAddress->phone }}
                        @else
                            <strong>{{ $order->user->name }}</strong><br>
                            {{ $order->user->email }}
                        @endif
                    </div>
                </td>
                <td style="padding-left: 40px;">
                    <div class="section-label">Emisor</div>
                    <div class="info-box">
                        <strong>MiKiwi SL</strong><br>
                        Calle de la Innovación 1<br>
                        28001 Madrid, España<br>
                        CIF: B12345678<br>
                        E: info@mikiwi.com
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Descripción del Producto</th>
                    <th style="text-align: center;">Cant.</th>
                    <th style="text-align: right;">Precio</th>
                    <th style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product_name_snapshot }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->unit_price, 2) }} €</td>
                    <td style="text-align: right;">{{ number_format($item->quantity * $item->unit_price, 2) }} €</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals-container">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal (Base Imponible)</td>
                    <td class="value">{{ number_format($order->total_amount / 1.21, 2) }} €</td>
                </tr>
                <tr>
                    <td class="label">IVA (21%)</td>
                    <td class="value">{{ number_format($order->total_amount - ($order->total_amount / 1.21), 2) }} €</td>
                </tr>
                <tr class="grand-total">
                    <td class="label" style="font-weight: bold; color: #222b24;">TOTAL</td>
                    <td class="value" style="font-size: 20px;">{{ number_format($order->total_amount, 2) }} €</td>
                </tr>
            </table>
        </div>

        <div class="payment-status">
            <div class="section-label">Información de Pago</div>
            <div style="font-size: 14px; margin-bottom: 10px;">
                Método: {{ ucfirst($order->payment_method ?? 'stripe') }}<br>
                Referencia: {{ $order->order_number }}
            </div>
            <div class="status-badge">
                {{ strtoupper($order->payment_status) }}
            </div>
        </div>
    </div>

    <div class="footer">
        Esta es una factura generada automáticamente. Gracias por confiar en MiKiwi.<br>
        <strong>www.mikiwi.com</strong>
    </div>
</body>
</html>

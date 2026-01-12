erDiagram
%% ============================================
%% MÓDULO: USUARIOS Y AUTENTICACIÓN
%% ============================================

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string role "customer | admin | support"
        date birth_date
        boolean age_verified
        timestamp age_verified_at
        boolean is_active
        timestamp created_at
        timestamp updated_at "NEW: Requisito HU"
        timestamp deleted_at
    }

    USER_PREFERENCES {
        uuid id PK
        uuid user_id FK
        boolean discreet_packaging
        boolean discreet_billing_name
        string preferred_delivery_time
        boolean email_notifications
        boolean sms_notifications
        timestamp created_at
        timestamp updated_at "NEW"
    }

    USER_ADDRESSES {
        uuid id PK
        uuid user_id FK
        string address_type "shipping | billing"
        string full_name
        string phone
        string street_address
        string city
        string state
        string postal_code
        string country
        boolean is_default
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    USER_PAYMENT_METHODS {
        uuid id PK
        uuid user_id FK
        string method_type
        string gateway_provider "Stripe/Redsys"
        string gateway_token_id
        string last_4_digits
        boolean is_default
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    %% ============================================
    %% MÓDULO: CATÁLOGO Y PRODUCTOS
    %% ============================================

    CATEGORIES {
        uuid id PK
        uuid parent_id FK
        string name
        string slug UK
        text description
        string meta_description
        string icon_url
        integer display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    SUPPLIERS {
        uuid id PK
        string company_name
        string tax_id UK
        string contact_email
        string phone
        jsonb address
        boolean is_active
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    PRODUCTS {
        uuid id PK
        uuid category_id FK
        uuid supplier_id FK
        string name
        string sku UK
        text description
        text meta_description
        decimal base_price
        integer stock_quantity
        decimal avg_rating "NEW: Para Índice"
        integer review_count "NEW: Para Índice"
        jsonb images
        jsonb attributes
        boolean is_featured
        boolean is_adult_only
        boolean requires_age_verification
        integer view_count
        integer sales_count
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    PRODUCT_VARIANTS {
        uuid id PK
        uuid product_id FK
        string sku UK
        string variant_name
        jsonb attributes
        integer stock_quantity
        decimal price_modifier
        string image_url
        boolean is_active
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    %% ============================================
    %% MÓDULO: CARRITO Y WISHLIST
    %% ============================================

    CARTS {
        uuid id PK
        uuid user_id FK
        timestamp created_at
        timestamp updated_at
    }

    CART_ITEMS {
        uuid id PK
        uuid cart_id FK
        uuid product_id FK
        uuid variant_id FK
        int quantity
        timestamp created_at
        timestamp updated_at "NEW"
    }

    WISHLISTS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        timestamp created_at
        timestamp updated_at "NEW"
    }

    %% ============================================
    %% MÓDULO: PEDIDOS Y VENTAS
    %% ============================================

    COUPONS {
        uuid id PK
        string code UK
        string discount_type "percentage | fixed"
        decimal discount_value
        decimal min_purchase_amount
        integer max_uses
        integer current_uses
        timestamp valid_from
        timestamp valid_until
        boolean is_active
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        uuid coupon_id FK
        uuid payment_method_id FK
        uuid shipping_address_id FK
        uuid billing_address_id FK
        string order_number UK
        string status "pending | processing | shipped | delivered | cancelled"
        string payment_status "pending | paid | failed | refunded"
        decimal subtotal_amount
        decimal discount_amount
        decimal shipping_cost
        decimal tax_amount
        decimal total_amount
        string tracking_number
        string shipping_carrier
        boolean discreet_packaging
        jsonb shipping_address_snapshot
        jsonb billing_address_snapshot
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp paid_at
        timestamp shipped_at
        timestamp delivered_at
        timestamp cancelled_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        uuid variant_id FK
        string product_name_snapshot
        decimal unit_price_at_purchase
        jsonb variant_snapshot
        int quantity
        timestamp created_at
        timestamp updated_at "NEW"
    }

    %% ============================================
    %% MÓDULO: REVIEWS Y VALORACIONES
    %% ============================================

    REVIEWS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        uuid order_id FK
        int rating "1-5"
        text comment
        boolean is_verified_purchase
        boolean is_approved
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp deleted_at
    }

    %% ============================================
    %% MÓDULO: SOPORTE Y TICKETS
    %% ============================================

    SUPPORT_TICKETS {
        uuid id PK
        uuid user_id FK
        uuid order_id FK
        string ticket_number UK
        string priority "low | medium | high | urgent"
        string status "open | in_progress | resolved | closed"
        string subject
        string category "product | shipping | payment | other"
        timestamp created_at
        timestamp updated_at "NEW"
        timestamp resolved_at
        timestamp closed_at
        timestamp deleted_at
    }

    TICKET_MESSAGES {
        uuid id PK
        uuid ticket_id FK
        uuid sender_id FK
        text message_body
        jsonb attachments
        boolean is_internal_note
        timestamp created_at
        timestamp updated_at "NEW"
    }

    %% ============================================
    %% MÓDULO: NOTIFICACIONES Y ALERTAS
    %% ============================================

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type "order_status | restock | promotion | review"
        string title
        text message
        jsonb data
        boolean is_read
        timestamp read_at
        timestamp created_at
        timestamp updated_at "NEW"
    }

    RESTOCK_ALERTS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        uuid variant_id FK
        boolean notified
        timestamp notified_at
        timestamp created_at
        timestamp updated_at "NEW"
    }

    %% ============================================
    %% MÓDULO: MARKETING
    %% ============================================

    PROMOTIONS {
        uuid id PK
        string title
        text description
        string banner_image_url
        string link_url
        integer display_order
        timestamp valid_from
        timestamp valid_until
        boolean is_active
        timestamp created_at
        timestamp updated_at "NEW"
    }

    %% ============================================
    %% MÓDULO: AUDITORÍA
    %% ============================================

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string table_name
        string action "create | update | delete"
        uuid record_id
        jsonb old_values
        jsonb new_values
        string ip_address
        timestamp created_at
    }

    %% ============================================
    %% RELACIONES
    %% ============================================

    USERS ||--|| USER_PREFERENCES : has
    USERS ||--o{ USER_ADDRESSES : has
    USERS ||--o{ USER_PAYMENT_METHODS : saves
    USERS ||--|| CARTS : owns
    USERS ||--o{ WISHLISTS : keeps
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ SUPPORT_TICKETS : opens
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ RESTOCK_ALERTS : requests
    USERS ||--o{ TICKET_MESSAGES : sends
    USERS ||--o{ AUDIT_LOGS : triggers

    CATEGORIES ||--o{ CATEGORIES : parent
    CATEGORIES ||--o{ PRODUCTS : classifies

    SUPPLIERS ||--o{ PRODUCTS : supplies

    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ CART_ITEMS : in
    PRODUCTS ||--o{ WISHLISTS : saved_in
    PRODUCTS ||--o{ ORDER_ITEMS : listed_in
    PRODUCTS ||--o{ REVIEWS : reviewed_in
    PRODUCTS ||--o{ RESTOCK_ALERTS : watched_in

    PRODUCT_VARIANTS ||--o{ CART_ITEMS : specifies
    PRODUCT_VARIANTS ||--o{ ORDER_ITEMS : specifies
    PRODUCT_VARIANTS ||--o{ RESTOCK_ALERTS : specifies

    CARTS ||--o{ CART_ITEMS : contains

    COUPONS ||--o{ ORDERS : discounts

    USER_PAYMENT_METHODS ||--o{ ORDERS : pays
    USER_ADDRESSES ||--o{ ORDERS : ships_to
    USER_ADDRESSES ||--o{ ORDERS : bills_to

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ REVIEWS : enables
    ORDERS ||--o{ SUPPORT_TICKETS : references

    SUPPORT_TICKETS ||--o{ TICKET_MESSAGES : history

[Abrir en Mermaid Live Editor](https://mermaid.live/edit)

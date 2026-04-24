# MiKiwi Entity-Relationship Model

```mermaid
flowchart TB
    USER[user]
    ADDRESS[address]
    NEWSLETTER_SUBSCRIBER[newsletter_subscriber]
    CART[cart]
    CART_ITEM[cart_item]
    CHAT_SESSION[chat_session]
    CHAT_MESSAGE[chat_message]
    CLAIM[claim]
    CLAIM_ATTACHMENT[claim_attachment]

    CATEGORY[category]
    COLLECTION[collection]
    PRODUCT[product]
    PRODUCT_IMAGE[product_image]
    PRODUCT_IMAGE_ZONE[product_image_zone]
    PRODUCT_ACCESSORY[product_accessory]
    REVIEW[review]
    COLLECTION_PRODUCT[collection_product]

    ORDER[order]
    ORDER_ITEM[order_item]
    COUPON[coupon]
    PAYMENT_METHOD[payment_method]
    PAYMENT[payment]
    SHIPMENT[shipment]
    PICKUP_POINT[pickup_point]

    DOLL_SECTION[doll_section]
    IMAGE_HOME[image_home]
    KNOW_YOU_SECTION[know_you_section]
    BLOG_POST[blog_post]

    DOLL_SETTING[doll_setting]
    DOLL_PART_POSITION[doll_part_position]

    USER -->|"1 : N"| HAS_ADDRESS{tiene}
    HAS_ADDRESS --> ADDRESS

    ADDRESS -->|"1 : N"| IS_USED_FOR_SHIPPING{se usa para envío}
    IS_USED_FOR_SHIPPING --> ORDER

    ADDRESS -->|"1 : N"| IS_USED_FOR_BILLING{se usa para facturación}
    IS_USED_FOR_BILLING --> ORDER

    USER -->|"1 : 1"| HAS_CART{tiene}
    HAS_CART --> CART

    USER -->|"1 : 1"| SUBSCRIBES_TO{se suscribe a}
    SUBSCRIBES_TO --> NEWSLETTER_SUBSCRIBER

    CART -->|"1 : N"| CONTAINS_CART_ITEM{contiene}
    CONTAINS_CART_ITEM --> CART_ITEM

    PRODUCT -->|"1 : N"| APPEARS_IN_CART{aparece en}
    APPEARS_IN_CART --> CART_ITEM

    USER -->|"1 : N"| PLACES{realiza}
    PLACES --> ORDER

    USER -->|"1 : N"| WRITES{escribe}
    WRITES --> REVIEW

    USER -->|"1 : N"| OPENS{abre}
    OPENS --> CHAT_SESSION

    USER -->|"1 : N"| HAS_CLAIM{tiene}
    HAS_CLAIM --> CLAIM

    PRODUCT -->|"1 : N"| IS_RELATED_TO_CLAIM{se relaciona con}
    IS_RELATED_TO_CLAIM --> CLAIM

    CATEGORY -->|"1 : N"| CLASSIFIES{clasifica}
    CLASSIFIES --> PRODUCT

    PRODUCT -->|"1 : N"| HAS_PRODUCT_IMAGE{tiene}
    HAS_PRODUCT_IMAGE --> PRODUCT_IMAGE

    PRODUCT_IMAGE -->|"1 : N"| HAS_IMAGE_ZONE{tiene}
    HAS_IMAGE_ZONE --> PRODUCT_IMAGE_ZONE

    PRODUCT -->|"1 : N"| HAS_ACCESSORY{tiene}
    HAS_ACCESSORY --> PRODUCT_ACCESSORY

    ORDER -->|"1 : N"| CONTAINS{contiene}
    CONTAINS --> ORDER_ITEM

    COUPON -->|"1 : N"| APPLIES_TO{se aplica a}
    APPLIES_TO --> ORDER

    PRODUCT -->|"1 : N"| APPEARS_IN{aparece en}
    APPEARS_IN --> ORDER_ITEM

    PRODUCT -->|"1 : N"| RECEIVES{recibe}
    RECEIVES --> REVIEW

    CHAT_SESSION -->|"1 : N"| CONTAINS_MESSAGE{contiene}
    CONTAINS_MESSAGE --> CHAT_MESSAGE

    USER -->|"1 : N"| HAS_PAYMENT_METHOD{tiene}
    HAS_PAYMENT_METHOD --> PAYMENT_METHOD

    USER -->|"1 : N"| MAKES_PAYMENT{realiza}
    MAKES_PAYMENT --> PAYMENT

    PAYMENT_METHOD -->|"1 : N"| IS_USED_BY_PAYMENT{se usa en}
    IS_USED_BY_PAYMENT --> PAYMENT

    ORDER -->|"1 : 1"| HAS_SHIPMENT{tiene}
    HAS_SHIPMENT --> SHIPMENT

    ORDER -->|"1 : N"| HAS_ORDER_CLAIM{tiene}
    HAS_ORDER_CLAIM --> CLAIM

    ORDER -->|"1 : N"| RECEIVES_PAYMENT{recibe}
    RECEIVES_PAYMENT --> PAYMENT

    CLAIM -->|"1 : N"| INCLUDES_ATTACHMENT{incluye}
    INCLUDES_ATTACHMENT --> CLAIM_ATTACHMENT

    COLLECTION -->|"1 : N"| GROUPS{agrupa}
    GROUPS --> COLLECTION_PRODUCT

    PRODUCT -->|"1 : N"| BELONGS_TO_COLLECTION{pertenece a}
    BELONGS_TO_COLLECTION --> COLLECTION_PRODUCT

    IMAGE_HOME -->|"1 : N"| IS_USED_IN_DOLL_SECTION{se usa en}
    IS_USED_IN_DOLL_SECTION --> DOLL_SECTION

    IMAGE_HOME -->|"1 : N"| IS_USED_IN_KNOW_YOU_SECTION{se usa en}
    IS_USED_IN_KNOW_YOU_SECTION --> KNOW_YOU_SECTION

    PICKUP_POINT -->|"1 : N"| IS_USED_FOR{se usa para}
    IS_USED_FOR --> SHIPMENT
```

Este archivo es el modelo entidad-relación conceptual:
- entidades/tablas
- relaciones entre ellas
- cardinalidades

Sin columnas, sin IDs y sin claves foráneas.

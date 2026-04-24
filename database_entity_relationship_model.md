# MiKiwi Entity-Relationship Model

```mermaid
flowchart TB
    USER[User]
    ADDRESS[Address]
    NEWSLETTER_SUBSCRIBER[Newsletter_Subscriber]
    CART[Cart]
    CART_ITEM[Cart_Item]
    CHAT_SESSION[Chat_Session]
    CHAT_MESSAGE[Chat_Message]
    REVIEW[Review]
    CLAIM[Claim]
    CLAIM_ATTACHMENT[Claim_Attachment]
    PAYMENT_METHOD[Payment_Method]
    PAYMENT[Payment]

    CATEGORY[Category]
    PRODUCT[Product]
    PRODUCT_IMAGE[Product_Image]
    DOLL_ACCESSORY[Doll_Accessory]
    COLLECTION[Collection]

    ORDER[Order]
    ORDER_ITEM[Order_Item]
    COUPON[Coupon]
    SHIPMENT[Shipment]
    PICKUP_POINT[Pickup_Point]

    DOLL_SECTION[Doll_Section]
    IMAGE_HOME[Image_Home]
    KNOW_YOU_SECTION[Know_You_Section]
    BLOG_POST[Blog_Post]

    DOLL_SETTING[Doll_Setting]
    DOLL_PART_POSITION[Doll_Part_Position]

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

    CATEGORY -->|"1 : N"| ORGANIZES{es padre de}
    ORGANIZES --> CATEGORY

    CATEGORY -->|"1 : N"| CLASSIFIES{clasifica}
    CLASSIFIES --> PRODUCT

    PRODUCT -->|"1 : N"| HAS_PRODUCT_IMAGE{tiene}
    HAS_PRODUCT_IMAGE --> PRODUCT_IMAGE

    PRODUCT -->|"1 : N"| HAS_ACCESSORY{tiene}
    HAS_ACCESSORY --> DOLL_ACCESSORY

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

    COLLECTION -->|"N : N"| GROUPS{agrupa}
    GROUPS --> PRODUCT

    DOLL_SECTION -->|"1 : N"| DISPLAYS_HOME_IMAGE{muestra}
    DISPLAYS_HOME_IMAGE --> IMAGE_HOME

    IMAGE_HOME -->|"1 : N"| INCLUDES_KNOW_YOU_SECTION{incluye}
    INCLUDES_KNOW_YOU_SECTION --> KNOW_YOU_SECTION

    PICKUP_POINT -->|"1 : N"| IS_USED_FOR{se usa para}
    IS_USED_FOR --> SHIPMENT
```

Este archivo es el modelo entidad-relación conceptual:
- entidades/tablas
- relaciones entre ellas
- cardinalidades

Sin columnas, sin IDs y sin claves foráneas.

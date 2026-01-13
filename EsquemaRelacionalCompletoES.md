erDiagram
%% ============================================
%% MÓDULO: USUARIOS Y AUTENTICACIÓN
%% ============================================

    USUARIOS {
        uuid id PK
        string email UK
        string hash_contrasena
        string rol "cliente | admin | soporte"
        date fecha_nacimiento
        boolean edad_verificada
        timestamp fecha_verificacion_edad
        boolean esta_activo
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO: Requisito HU"
        timestamp fecha_eliminacion
    }

    PREFERENCIAS_USUARIO {
        uuid id PK
        uuid usuario_id FK
        boolean paquete_discreto
        boolean nombre_facturacion_discreto
        string horario_entrega_preferido
        boolean notificaciones_email
        boolean notificaciones_sms
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    DIRECCIONES_USUARIO {
        uuid id PK
        uuid usuario_id FK
        string tipo_direccion "envio | facturacion"
        string nombre_completo
        string telefono
        string direccion_calle
        string ciudad
        string estado_provincia
        string codigo_postal
        string pais
        boolean es_predeterminada
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    METODOS_PAGO_USUARIO {
        uuid id PK
        uuid usuario_id FK
        string tipo_metodo
        string proveedor_pasarela "Stripe/Redsys"
        string id_token_pasarela
        string ultimos_4_digitos
        boolean es_predeterminado
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    %% ============================================
    %% MÓDULO: CATÁLOGO Y PRODUCTOS
    %% ============================================

    CATEGORIAS {
        uuid id PK
        uuid id_padre FK
        string nombre
        string slug UK
        text descripcion
        string meta_descripcion
        string url_icono
        integer orden_visualizacion
        boolean esta_activa
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    PROVEEDORES {
        uuid id PK
        string nombre_empresa
        string cif_nif UK
        string email_contacto
        string telefono
        jsonb direccion
        boolean esta_activo
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    PRODUCTOS {
        uuid id PK
        uuid categoria_id FK
        uuid proveedor_id FK
        string nombre
        string sku UK
        text descripcion
        text meta_descripcion
        decimal precio_base
        integer cantidad_stock
        decimal promedio_valoracion "NUEVO: Para Índice"
        integer conteo_resenas "NUEVO: Para Índice"
        jsonb imagenes
        jsonb atributos
        boolean es_destacado
        boolean solo_adultos
        boolean requiere_verificacion_edad
        integer conteo_vistas
        integer conteo_ventas
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    VARIANTES_PRODUCTO {
        uuid id PK
        uuid producto_id FK
        string sku UK
        string nombre_variante
        jsonb atributos
        integer cantidad_stock
        decimal modificador_precio
        string url_imagen
        boolean esta_activa
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    %% ============================================
    %% MÓDULO: CARRITO Y LISTA DE DESEOS
    %% ============================================

    CARRITOS {
        uuid id PK
        uuid usuario_id FK
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    ITEMS_CARRITO {
        uuid id PK
        uuid carrito_id FK
        uuid producto_id FK
        uuid variante_id FK
        int cantidad
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    LISTAS_DESEOS {
        uuid id PK
        uuid usuario_id FK
        uuid producto_id FK
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    %% ============================================
    %% MÓDULO: PEDIDOS Y VENTAS
    %% ============================================

    CUPONES {
        uuid id PK
        string codigo UK
        string tipo_descuento "porcentaje | fijo"
        decimal valor_descuento
        decimal monto_minimo_compra
        integer maximo_usos
        integer usos_actuales
        timestamp valido_desde
        timestamp valido_hasta
        boolean esta_activo
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    PEDIDOS {
        uuid id PK
        uuid usuario_id FK
        uuid cupon_id FK
        uuid metodo_pago_id FK
        uuid direccion_envio_id FK
        uuid direccion_facturacion_id FK
        string numero_pedido UK
        string estado "pendiente | procesando | enviado | entregado | cancelado"
        string estado_pago "pendiente | pagado | fallido | reembolsado"
        decimal monto_subtotal
        decimal monto_descuento
        decimal costo_envio
        decimal monto_impuestos
        decimal monto_total
        string numero_seguimiento
        string transportista
        boolean paquete_discreto
        jsonb snapshot_direccion_envio
        jsonb snapshot_direccion_facturacion
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp pagado_en
        timestamp enviado_en
        timestamp entregado_en
        timestamp cancelado_en
    }

    ITEMS_PEDIDO {
        uuid id PK
        uuid pedido_id FK
        uuid producto_id FK
        uuid variante_id FK
        string snapshot_nombre_producto
        decimal precio_unitario_compra
        jsonb snapshot_variante
        int cantidad
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    %% ============================================
    %% MÓDULO: RESEÑAS Y VALORACIONES
    %% ============================================

    RESENAS {
        uuid id PK
        uuid usuario_id FK
        uuid producto_id FK
        uuid pedido_id FK
        int puntuacion "1-5"
        text comentario
        boolean es_compra_verificada
        boolean esta_aprobada
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp fecha_eliminacion
    }

    %% ============================================
    %% MÓDULO: SOPORTE Y TICKETS
    %% ============================================

    TICKETS_SOPORTE {
        uuid id PK
        uuid usuario_id FK
        uuid pedido_id FK
        string numero_ticket UK
        string prioridad "baja | media | alta | urgente"
        string estado "abierto | en_progreso | resuelto | cerrado"
        string asunto
        string categoria "producto | envio | pago | otro"
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
        timestamp resuelto_en
        timestamp cerrado_en
        timestamp fecha_eliminacion
    }

    MENSAJES_TICKET {
        uuid id PK
        uuid ticket_id FK
        uuid remitente_id FK
        text cuerpo_mensaje
        jsonb adjuntos
        boolean es_nota_interna
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    %% ============================================
    %% MÓDULO: NOTIFICACIONES Y ALERTAS
    %% ============================================

    NOTIFICACIONES {
        uuid id PK
        uuid usuario_id FK
        string tipo "estado_pedido | stock | promocion | resena"
        string titulo
        text mensaje
        jsonb datos
        boolean es_leida
        timestamp leida_en
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    ALERTAS_STOCK {
        uuid id PK
        uuid usuario_id FK
        uuid producto_id FK
        uuid variante_id FK
        boolean notificado
        timestamp notificado_en
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    %% ============================================
    %% MÓDULO: MARKETING
    %% ============================================

    PROMOCIONES {
        uuid id PK
        string titulo
        text descripcion
        string url_imagen_banner
        string url_enlace
        integer orden_visualizacion
        timestamp valido_desde
        timestamp valido_hasta
        boolean esta_activa
        timestamp fecha_creacion
        timestamp fecha_actualizacion "NUEVO"
    }

    %% ============================================
    %% MÓDULO: AUDITORÍA
    %% ============================================

    LOGS_AUDITORIA {
        uuid id PK
        uuid usuario_id FK
        string nombre_tabla
        string accion "crear | actualizar | eliminar"
        uuid registro_id
        jsonb valores_antiguos
        jsonb valores_nuevos
        string direccion_ip
        timestamp fecha_creacion
    }

    %% ============================================
    %% RELACIONES
    %% ============================================

    USUARIOS ||--|| PREFERENCIAS_USUARIO : tiene
    USUARIOS ||--o{ DIRECCIONES_USUARIO : tiene
    USUARIOS ||--o{ METODOS_PAGO_USUARIO : guarda
    USUARIOS ||--|| CARRITOS : posee
    USUARIOS ||--o{ LISTAS_DESEOS : mantiene
    USUARIOS ||--o{ PEDIDOS : realiza
    USUARIOS ||--o{ RESENAS : escribe
    USUARIOS ||--o{ TICKETS_SOPORTE : abre
    USUARIOS ||--o{ NOTIFICACIONES : recibe
    USUARIOS ||--o{ ALERTAS_STOCK : solicita
    USUARIOS ||--o{ MENSAJES_TICKET : envia
    USUARIOS ||--o{ LOGS_AUDITORIA : provoca

    CATEGORIAS ||--o{ CATEGORIAS : padre
    CATEGORIAS ||--o{ PRODUCTOS : clasifica

    PROVEEDORES ||--o{ PRODUCTOS : suministra

    PRODUCTOS ||--o{ VARIANTES_PRODUCTO : tiene
    PRODUCTOS ||--o{ ITEMS_CARRITO : esta_en
    PRODUCTOS ||--o{ LISTAS_DESEOS : guardado_en
    PRODUCTOS ||--o{ ITEMS_PEDIDO : listado_en
    PRODUCTOS ||--o{ RESENAS : valorado_en
    PRODUCTOS ||--o{ ALERTAS_STOCK : vigilado_en

    VARIANTES_PRODUCTO ||--o{ ITEMS_CARRITO : especifica
    VARIANTES_PRODUCTO ||--o{ ITEMS_PEDIDO : especifica
    VARIANTES_PRODUCTO ||--o{ ALERTAS_STOCK : especifica

    CARRITOS ||--o{ ITEMS_CARRITO : contiene

    CUPONES ||--o{ PEDIDOS : descuenta

    METODOS_PAGO_USUARIO ||--o{ PEDIDOS : paga
    DIRECCIONES_USUARIO ||--o{ PEDIDOS : envio_a
    DIRECCIONES_USUARIO ||--o{ PEDIDOS : factura_a

    PEDIDOS ||--o{ ITEMS_PEDIDO : contiene
    PEDIDOS ||--o{ RESENAS : habilita
    PEDIDOS ||--o{ TICKETS_SOPORTE : referencia

    TICKETS_SOPORTE ||--o{ MENSAJES_TICKET : historial
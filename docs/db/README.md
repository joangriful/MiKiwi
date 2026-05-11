<a href="../index.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>

# <img src="../assets/icons/db.svg" width="32" height="32" /> Base de Datos MiKiwi (PostgreSQL + Supabase)

El sistema de persistencia de MiKiwi utiliza **PostgreSQL** como motor principal, alojado en **Supabase** para el entorno de producción y desarrollo compartido. La integridad de los datos y la escalabilidad del esquema son prioridades fundamentales, utilizando **UUIDs** para todos los identificadores y manteniendo una separación estricta entre los datos reales y los de pruebas.

### Estrategia de Persistencia
Nuestra base de datos se gestiona íntegramente mediante **Migraciones de Laravel**, asegurando que el esquema sea reproducible y versionable. Para garantizar la seguridad del flujo de trabajo, mantenemos dos entornos aislados: un entorno remoto para validación y un entorno local de alto rendimiento exclusivo para **Tests Automatizados**. Cualquier cambio estructural debe validarse primero contra los modelos relacionales definidos en la carpeta raíz.

---

## 📂 Documentación de Referencia

*   **[Guía de Conexión y Entornos](DATABASE_CONNECTIONS_GUIDE.md)**: Configuración de accesos remotos y locales.
*   **[Instrucciones de la Base de Datos](INSTRUCCIONES_BD.md)**: Cómo levantar el esquema y gestionar migraciones.
*   **[Modelo Relacional oficial](../../database/database_relational_model.md)**: Estructura técnica de tablas y columnas.
*   **[Diagrama de Entidades](../../database/database_entity_relationship_model.md)**: Mapa visual de las relaciones del sistema.

---

## 🚀 Reglas de Oro
- **Migraciones Primero**: Nunca modificar el esquema manualmente en la base de datos; usar siempre `php artisan migrate`.
- **Aislamiento de Tests**: Los tests automatizados deben correr siempre contra la base local `mikiwi_testing`.
- **Fuente de Verdad**: Antes de refactorizar, consultar siempre los archivos `.md` de la carpeta `/database`.
- **Compatibilidad**: Mantener las queries compatibles con PostgreSQL y el entorno de CI (MySQL).

---
*Última actualización: Mayo 2026*

![Footer](../assets/img/footer.png)
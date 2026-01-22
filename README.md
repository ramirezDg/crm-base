# CRM Base

Este proyecto es una base para un sistema de **Gestión de Relaciones con Clientes (CRM)**. Incluye la configuración inicial del backend y está listo para integrarse con un frontend moderno (por ejemplo, React con Vite).

## Características

- Arquitectura modular y escalable.
- Preparado para integración con APIs REST.
- Listo para conectar con un frontend moderno (React, Remix, etc.).
- Soporte para desarrollo con Docker.

## Requisitos

- Node.js (versión recomendada: >=18)
- pnpm (gestor de paquetes)
- Docker (opcional, para despliegue y desarrollo)

## Instalación

1. Clona el repositorio:

    ```
    git clone https://github.com/ramirezDg/crm-base.git
    cd crm-base
    ```

2. Instala las dependencias:

    ```
    pnpm install
    ```

3. (Opcional) Levanta los servicios con Docker:

    ```
    docker compose up -d
    ```

## Uso

- Para iniciar el backend:

    ```
    pnpm run dev
    ```

- Para iniciar el frontend (si usas React + Vite):

    ```
    cd frontend
    pnpm install
    pnpm run dev
    ```

## Estructura del Proyecto

```
crm-base/
│
├── backend/        # Código fuente del backend
├── frontend/       # Código fuente del frontend (React, Vite, etc.)
├── docker/         # Archivos de configuración para Docker
├── README.md
└── ...
```

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.

---

**Autor:** ramirezDg

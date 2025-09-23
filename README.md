# Rincón Verde - Tienda de Útiles Escolares

Una moderna tienda en línea de útiles escolares construida con Next.js, diseñada para ofrecer una experiencia de compra fluida y eficiente. Rincón Verde permite a los usuarios navegar por un catálogo completo de productos escolares, gestionar su carrito de compras y realizar pedidos a través de WhatsApp.

## Características Principales

- 🛍️ **Tienda en línea completa** con catálogo de productos y sistema de categorías
- 🛒 **Carrito de compras** con persistencia local y gestión de cantidades
- 📱 **Integración con WhatsApp** para procesamiento de pedidos
- 👨‍💼 **Panel de administración** para gestión de productos, categorías y pedidos
- 🔐 **Sistema de autenticación** para administradores
- 📱 **Diseño responsivo** optimizado para móviles y escritorio
- 🎨 **Interfaz moderna** con componentes de shadcn/ui
- 🗄️ **Base de datos PostgreSQL** con Neon para almacenamiento escalable

## Tecnologías Utilizadas

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de datos**: PostgreSQL (Neon)
- **Autenticación**: JWT con cookies seguras
- **Gestión de estado**: React Context API
- **Validación**: Zod
- **Iconos**: Lucide React

## Requisitos del Sistema

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** versión 18.0 o superior
- **Bun** versión 1.0 o superior (gestor de paquetes)
- **Git** para clonar el repositorio
- **Cuenta de Neon** para la base de datos PostgreSQL

## Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone <url-del-repositorio>
cd rincon-verde-store
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
bun install
\`\`\`

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`env
# Base de datos Neon
DATABASE_URL="postgresql://..."
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Configuración JWT
JWT_SECRET="tu-clave-secreta-muy-segura"

# WhatsApp (opcional)
WHATSAPP_PHONE="521234567890"
\`\`\`

### 4. Configurar la base de datos

Ejecuta los scripts de configuración para crear las tablas necesarias:

\`\`\`bash
# Crear usuario administrador
bun run scripts/create-admin-user.js

# Crear tablas adicionales
bun run scripts/create_additional_tables.sql
\`\`\`

### 5. Verificar la instalación

Ejecuta el proyecto en modo desarrollo para verificar que todo funcione correctamente:

\`\`\`bash
bun dev
\`\`\`

## Comandos Disponibles

### Desarrollo

Para ejecutar el proyecto en modo de desarrollo:

\`\`\`bash
bun dev
\`\`\`

El servidor se iniciará en `http://localhost:3000`

### Producción

Para construir el proyecto para producción:

\`\`\`bash
bun run build
\`\`\`

Para ejecutar la versión de producción:

\`\`\`bash
bun start
\`\`\`

### Otros comandos útiles

\`\`\`bash
# Linter
bun run lint

# Verificar tipos de TypeScript
bun run type-check

# Limpiar caché de Next.js
bun run clean
\`\`\`

## Estructura del Proyecto

\`\`\`
rincon-verde-store/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── blog/              # Página del blog
│   ├── contacto/          # Página de contacto
│   ├── nosotros/          # Página sobre nosotros
│   └── productos/         # Catálogo de productos
├── components/            # Componentes reutilizables
│   ├── admin/            # Componentes del admin
│   └── ui/               # Componentes de shadcn/ui
├── lib/                  # Utilidades y configuraciones
├── public/               # Archivos estáticos
└── scripts/              # Scripts de configuración
\`\`\`

## Uso del Sistema

### Panel de Administración

1. Accede a `/admin/login`
2. Usa las credenciales por defecto:
   - Email: `admin@rinconverde.com`
   - Contraseña: `admin123`
3. Gestiona productos, categorías y pedidos desde el dashboard

### Tienda Pública

- **Página principal**: Productos destacados y categorías
- **Catálogo**: `/productos` - Navegación completa con filtros
- **Categorías**: `/categorias` - Vista por categorías
- **Carrito**: Accesible desde el header, persiste entre sesiones
- **Pedidos**: Se envían automáticamente por WhatsApp

## Configuración de WhatsApp

Para habilitar la integración con WhatsApp:

1. Configura la variable `WHATSAPP_PHONE` con tu número de WhatsApp
2. Los pedidos se formatearán automáticamente y abrirán WhatsApp Web
3. Los clientes podrán enviar sus pedidos directamente

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que la base de datos esté conectada correctamente
4. Consulta los logs del servidor para errores específicos

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ para Rincón Verde

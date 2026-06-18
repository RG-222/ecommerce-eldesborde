# 👟 E-commerce "El Desborde"

Proyecto Full-Stack para la gestión de ventas de bolsos, desarrollado para la asignatura **Taller Aplicado de Programación**.

## 🚀 Funcionalidades Actuales
*   **Gestión de Productos:** Panel administrativo para agregar productos con nombre, descripción, precio, imagen y stock.
*   **Subida de Imágenes:** Integración real con la API de **Cloudinary** para el almacenamiento de fotos en la nube.
*   **Base de Datos:** Persistencia de datos en MySQL mediante JPA/Hibernate.
*   **Frontend Dinámico:** Interfaz construida en React con navegación mediante React Router.

## 🛠️ Tecnologías Utilizadas
*   **Backend:** Java 17, Spring Boot 3, Spring Data JPA.
*   **Frontend:** React (Vite), JavaScript, CSS.
*   **Base de Datos:** MySQL (XAMPP).
*   **Servicios Externos:** Cloudinary (Imágenes).

## ⚙️ Configuración para Evaluar
1.  **Base de Datos:** Base de datos en MySQL llamada `eldesborde_db`.
2.  **Backend:** Credenciales de Cloudinary y MySQL en el archivo `application.properties`.
.\mvnw spring-boot:run
3.  **Frontend:** 
    - Ejecutar `npm install` para descargar dependencias.
    cd C:\Users\DELL\Desktop\Proyecto-El-Desborde\frontend-eldesborde
    - Ejecutar `npm run dev` para iniciar la interfaz.

## Para probar WEBPAY
1. Tarjeta de prueba aprobada
    Número tarjeta: 4051885600446623
    CVV: 123
    Fecha vencimiento: cualquier fecha futura (ej. 12/30)

    Después te pedirá autenticación bancaria:

    RUT: 11.111.111-1
    Clave: 123
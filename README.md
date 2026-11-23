# Recursos de desarrollo del CECyTE

Documentación pública del **CECyTE Design System**: los componentes, las guías de uso y las plantillas de pantalla que comparten las plataformas del CECyTE.

### 👉 [odes-cecyte.github.io/recursos-de-desarrollo](https://odes-cecyte.github.io/recursos-de-desarrollo/)

## Qué encuentras en el sitio

- **Fundamentos:** color, tipografía, espaciado, sombras, iconos y logos, en tema claro y oscuro.
- **Guías:** principios, espaciado por contexto, rejilla, estructura de pantalla, estados y qué hacer y qué no.
- **Componentes:** cada uno con sus variantes, sus estados, el código para copiar y notas de accesibilidad.
- **Gráficas y mapas.**
- **Plantillas:** pantallas completas (inicio, panel, detalle y edición) como punto de partida.

## Usar los paquetes

La librería se distribuye en cinco paquetes `@odes-cecyte/*` (tokens, assets, ui, charts y maps) desde GitHub Packages. Para instalarlos se necesita acceso a la organización.

Los pasos están en la [Introducción del sitio](https://odes-cecyte.github.io/recursos-de-desarrollo/?path=/docs/introducci%C3%B3n--docs).

## Cómo se actualiza

El sitio siempre muestra la **última versión publicada** de la librería. Cuando sale una versión nueva, el responsable lo actualiza a mano desde **Actions → Publicar Storybook → Run workflow**.

El workflow:

1. descarga la versión publicada con una llave de solo lectura;
2. compila los paquetes y Storybook;
3. revisa que el resultado no contenga nada interno (`scripts/revisar-build.mjs`);
4. lo publica en GitHub Pages.

Este repositorio no guarda el código de la librería ni el sitio compilado: solo el workflow, el script de revisión y este archivo.

---

© CECyTE. Todos los derechos reservados. Los logos institucionales no pueden usarse fuera de las plataformas del CECyTE.

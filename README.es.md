# ng-hub-ui-action-sheet

**Español** | [English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-action-sheet.svg)](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
[![License](https://img.shields.io/npm/l/ng-hub-ui-action-sheet.svg)](LICENSE)

> Hojas de acciones accesibles y pensadas para móvil, parte del ecosistema Hub UI.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/action-sheet/overview/
- Ejemplos en vivo: https://hubui.dev/en/action-sheet/examples/
- Hub UI: https://hubui.dev/en/

> **Nota:** Las páginas de documentación y los ejemplos en vivo se están preparando mientras la biblioteca está en desarrollo.

## 🧩 Familia `ng-hub-ui`

Esta biblioteca forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleto — usa ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet) ← Estás aquí
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 📦 Descripción

`ng-hub-ui-action-sheet` presenta una lista corta de acciones sobre la pantalla actual: la hoja
que sube desde el borde inferior cuando se mantiene pulsada una fila o se toca un botón de
"más". Se abre desde un servicio, así que en la página no queda nada de una hoja cerrada, y la
llamada se resuelve con lo que haya elegido quien la usa.

Componentes standalone, sin NgModules y sin más dependencia en tiempo de ejecución que Angular.

## ✨ Características

- **Acciones con rol** — `cancel` se separa al final la declares donde la declares, `destructive`
  se lee en el color de peligro, `selected` queda marcada, y cualquier otra cadena viaja intacta
  hasta el resultado.
- **Handlers que pueden negarse** — devolver `false`, o una promesa de `false`, mantiene la hoja
  abierta.
- **Acciones agrupadas** con título opcional por bloque, más cabecera y subcabecera.
- **Tres salidas** — el fondo, `Escape` y arrastrar la hoja hacia abajo, cada una informando de su
  propio rol y ejecutando antes el handler de la acción de cancelar.
- **Accesible** — `role="dialog"` con `aria-modal`, nombrada por su cabecera; el foco entra al
  abrir, queda atrapado mientras la hoja vive y vuelve al elemento que la abrió.
- **Tematizable por variables CSS** mediante `--hub-action-sheet-*`, con el acento semántico del
  resto de la familia, y una animación que se aparta con `prefers-reduced-motion`.

## 🚀 Instalación

```bash
npm install ng-hub-ui-action-sheet
```

## ⚙️ Uso

### Abrir una hoja

```typescript
import { Component, inject } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';

@Component({
	selector: 'app-invoice-row',
	standalone: true,
	template: `<button type="button" (click)="openActions()">Más</button>`
})
export class InvoiceRowComponent {
	readonly #sheet = inject(HubActionSheet);

	async openActions(): Promise<void> {
		const { role, data } = await this.#sheet.open<string>({
			header: 'Factura 2026-0184',
			subHeader: 'Emitida el 12 de agosto · 1.240,00 €',
			buttons: [
				{ text: 'Descargar PDF', icon: 'fa-solid fa-download', data: 'pdf' },
				{ text: 'Enviar por correo', icon: 'fa-solid fa-envelope', data: 'email' },
				{ text: 'Eliminar', role: 'destructive', icon: 'fa-solid fa-trash' },
				{ text: 'Cancelar', role: 'cancel' }
			]
		}).result;

		if (role === 'destructive') {
			this.delete();
		} else if (data === 'pdf') {
			this.download();
		}
	}
}
```

La promesa se resuelve una sola vez, pase lo que pase: con el rol y el dato de la acción elegida,
o con `{ role: 'backdrop' | 'escape' | 'swipe' }` si la hoja se cerró sin elegir.

### Un handler que se niega a cerrar

```typescript
this.#sheet.open({
	buttons: [
		{
			text: 'Eliminar',
			role: 'destructive',
			// La hoja sigue abierta mientras corre la petición, y sigue abierta si falla.
			handler: async () => {
				const deleted = await this.api.delete(this.invoice.id);
				return deleted;
			}
		},
		{ text: 'Cancelar', role: 'cancel' }
	]
});
```

### Acciones agrupadas

```typescript
this.#sheet.open({
	header: 'Documento',
	buttons: [
		{ title: 'Compartir', buttons: [{ text: 'Copiar enlace' }, { text: 'Enviar por correo' }] },
		{ title: 'Zona de peligro', buttons: [{ text: 'Eliminar', role: 'destructive' }] },
		{ text: 'Cancelar', role: 'cancel' }
	]
});
```

### Valores por defecto para toda la aplicación

```typescript
import { provideHubActionSheet } from 'ng-hub-ui-action-sheet';

export const appConfig: ApplicationConfig = {
	providers: [provideHubActionSheet({ swipeToClose: false })]
};
```

## 🪄 Referencia de API

### `HubActionSheet` (servicio, `providedIn: 'root'`)

| Método | Firma | Descripción |
| ------ | ----- | ----------- |
| `open` | `open<D>(options: HubActionSheetOptions<D>): HubActionSheetRef<D>` | Monta una hoja en el documento y devuelve el manejador de su resultado. |

### `HubActionSheetRef<D>`

| Miembro | Tipo | Descripción |
| ------- | ---- | ----------- |
| `result` | `Promise<HubActionSheetResult<D>>` | Se resuelve una vez, con la acción elegida o con el cierre. |
| `closed$` | `Observable<HubActionSheetResult<D>>` | El mismo valor, para quien trabaje con flujos. |
| `dismiss` | `(role?) => void` | Cierra la hoja desde fuera: un cambio de ruta, un mensaje que deja las acciones sin sentido. |
| `settled` | `boolean` | Si la hoja ya ha producido su resultado. |

### `HubActionSheetOptions<D>`

| Propiedad | Tipo | Por defecto | Descripción |
| --------- | ---- | ----------- | ----------- |
| `buttons` | `(HubActionSheetButton<D> \| HubActionSheetGroup<D>)[]` | — | Las acciones, sueltas o en grupos con título. |
| `header` | `string` | `undefined` | Título de la hoja, y su nombre accesible. |
| `subHeader` | `string` | `undefined` | Línea secundaria bajo la cabecera. |
| `variant` | `string` | `undefined` | Acento semántico, leído como `--hub-sys-color-<variant>`. |
| `backdropDismiss` | `boolean` | `true` | Pulsar el fondo cierra la hoja. |
| `keyboard` | `boolean` | `true` | `Escape` cierra la hoja. |
| `swipeToClose` | `boolean` | `true` | Arrastrar la hoja hacia abajo más allá del umbral la cierra. |
| `animation` | `boolean` | `true` | Anima entrada y salida. Se ignora con `prefers-reduced-motion`. |
| `panelClass` | `string \| string[]` | `undefined` | Clases adicionales en el elemento de la hoja. |
| `ariaLabel` | `string` | `undefined` | Nombre accesible cuando no hay cabecera que lo dé. |

### `HubActionSheetButton<D>`

| Propiedad | Tipo | Descripción |
| --------- | ---- | ----------- |
| `text` | `string` | Texto visible, y nombre accesible. |
| `role` | `'cancel' \| 'destructive' \| 'selected' \| string` | Decide dónde se sitúa y cómo se lee. |
| `icon` | `string` | Clase de icono que se pinta antes del texto. |
| `disabled` | `boolean` | Deja la acción inerte. |
| `data` | `D` | Carga que vuelve en el resultado. |
| `cssClass` | `string \| string[]` | Clases adicionales en la acción. |
| `handler` | `() => boolean \| void \| Promise<boolean \| void>` | Se ejecuta al elegirla; devolver `false` mantiene la hoja abierta. |

### `HubActionSheetGroup<D>`

| Propiedad | Tipo | Descripción |
| --------- | ---- | ----------- |
| `title` | `string` | Encabezado opcional del bloque. |
| `buttons` | `HubActionSheetButton<D>[]` | Las acciones del bloque. |

### Resultado y roles

`result` se resuelve con `{ role?, data? }`. `role` es el rol de la acción elegida, o `'backdrop'`,
`'escape'` o `'swipe'` si la hoja se cerró. El handler de una acción `cancel` se ejecuta en los
tres cierres, y puede negarse a ellos devolviendo `false`.

## 🎨 Estilos

Cada decisión visual es una variable CSS. Se definen sobre la hoja —`panelClass` le da una clase—
o globalmente en `:root`.

| Variable | Por defecto | Descripción |
| -------- | ----------- | ----------- |
| `--hub-action-sheet-bg` | `var(--hub-sys-surface-page, #fff)` | Fondo de la hoja |
| `--hub-action-sheet-color` | `var(--hub-sys-text-primary, #212529)` | Color del texto |
| `--hub-action-sheet-backdrop-bg` | `rgba(0, 0, 0, 0.45)` | Fondo oscurecido |
| `--hub-action-sheet-border-radius` | `var(--hub-ref-radius-lg, 0.5rem)` | Radio de las esquinas |
| `--hub-action-sheet-max-width` | `34rem` | Ancho máximo en pantallas grandes |
| `--hub-action-sheet-action-min-height` | `3rem` | Área táctil de cada acción |
| `--hub-action-sheet-destructive-color` | `var(--hub-sys-color-danger, #dc3545)` | Color de la acción destructiva |
| `--hub-action-sheet-accent` | `var(--hub-sys-color-primary, #0d6efd)` | Acento semántico, re-basado por `variant` |
| `--hub-action-sheet-handle-color` | `var(--hub-sys-border-color-default, #dee2e6)` | Tirador de arrastre |
| `--hub-action-sheet-duration` | `240ms` | Entrada, salida y vuelta atrás |

La lista completa está en [`docs/css-variables-reference.md`](docs/css-variables-reference.md).

```scss
.branded-sheet {
	--hub-action-sheet-border-radius: 1.25rem;
	--hub-action-sheet-accent: #7c3aed;
	--hub-action-sheet-action-min-height: 3.5rem;
}
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Esta es una biblioteca en etapa temprana y la ayuda para
dar forma a la API es especialmente valiosa.

```bash
# Clona el repositorio
git clone https://github.com/carlos-morcillo/ng-hub-ui-action-sheet.git

# Instala las dependencias
npm install

# Construye la biblioteca
ng build action-sheet

# Ejecuta los tests unitarios
ng test action-sheet
```

1. **Haz un fork** del repositorio
2. **Crea** una rama de feature: `git checkout -b feature/amazing-feature`
3. **Añade tests** para tus cambios
4. **Haz commit** de tus cambios: `git commit -m 'feat: add amazing feature'`
5. **Sube** tu rama: `git push origin feature/amazing-feature`
6. **Abre** un pull request

## ☕ Soporte

¿Te gusta esta biblioteca? Puedes apoyar su desarrollo invitando a un café ☕:
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

- [Reportar un error](https://github.com/carlos-morcillo/ng-hub-ui-action-sheet/issues)
- [Solicitar una funcionalidad](https://github.com/carlos-morcillo/ng-hub-ui-action-sheet/issues/new)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

MIT © ng-hub-ui contributors

## Instala las herramientas
- [Node.js 4.5.0](https://nodejs.org/)
- [**Latest** Google Chrome](https://www.google.com/chrome/)
- [Git](https://git-scm.com/)

Asegúrate de que Node y Git queden en tu `PATH`, es decir, que al abrir una
ventana de la terminal, puedas ejecutarlos así:
```sh
node --version
v4.5.0
```

```sh
git --version
2.X.X
```

## Descarga el proyecto
```sh
git clone https://github.com/castillobgr/chat-snap.git
```

## Instala las dependencias

Abre una ventana de la terminal en el directorio donde descargaste el proyecto
y luego:

- Instala bower con npm:
  ```sh
  npm install -g bower
  ```

- Instala las dependencias de front-end y back-end:
  ```sh
  npm install && bower install
  ```

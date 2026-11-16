# arcade-hub-ui

Código compartilhado pelos sites do Recreio (Arcade Hub): componentes Svelte, conexão Socket.IO, nome do jogador, convites, textos (i18n) e estilos globais. Cada jogo (`risca-palito-front`, `liga-pontos-front`, `adivinha-palavra-front`) e o hub (`arcade-hub-front`) instalam este pacote.

O pacote não tem build: publica os arquivos `.svelte` e `.js` fonte, e o Vite de cada site compila.

## Instalar

No `package.json` do site, com a tag fixa:

```json
"dependencies": {
  "arcade-hub-ui": "github:Gabryelryba/arcade-hub-ui#v0.1.0"
}
```

Imports por caminho do arquivo dentro de `src/`:

```js
import "arcade-hub-ui/app.css";
import { socket } from "arcade-hub-ui/socket.js";
import { t } from "arcade-hub-ui/i18n/index.svelte.js";
import WaitingRoom from "arcade-hub-ui/WaitingRoom.svelte";
```

O site precisa de `svelte` 5 e `socket.io-client` 4 nas próprias dependências (são `peerDependencies`). O `vite.config.js` do site deve deixar o pacote fora do pré-bundle e, para os testes, compilá-lo junto:

```js
optimizeDeps: { exclude: ["phosphor-svelte", "arcade-hub-ui"] },
test: { server: { deps: { inline: ["arcade-hub-ui"] } } },
```

O endereço do backend vem de `VITE_SERVER_URL` no site que usa o pacote (padrão `http://localhost:3001`).

## Site de um jogo

O `GameApp.svelte` é a página inteira de um site de jogo: fundo animado, o jogo e o diálogo de nome. Ele lê o convite (`?code=`), manda "Voltar ao Recreio" para o hub e, quando o código é de outro jogo, leva o jogador ao site daquele jogo com o código. O `main.js` de um jogo fica assim:

```js
import { mount } from "svelte";
import "arcade-hub-ui/app.css";
import { registerMessages } from "arcade-hub-ui/i18n/index.svelte.js";
import GameApp from "arcade-hub-ui/GameApp.svelte";
import messages from "./i18n.js";
import StickSlash from "./stick-slash/StickSlash.svelte";

registerMessages(messages);

export default mount(GameApp, {
  target: document.getElementById("app"),
  props: { Game: StickSlash, gameId: "stick-slash" },
});
```

## Textos (i18n)

`en.js` e `pt-BR.js` têm só o que todos os sites usam (`common`, `lobby`, `result`, `errors`, `name`, `games.<id>.name`…). Cada site registra os próprios textos com `registerMessages({ en: {...}, "pt-BR": {...} })` antes do `mount`; uma chave que já existe é substituída (por exemplo `meta.description`). `dictionaryEntries()` ajuda o site a testar que os dois idiomas têm as mesmas chaves.

O idioma inicial vem de `?lang=pt-BR` ou `?lang=en` no endereço (o hub repassa a escolha do jogador), depois da escolha guardada no site, depois do navegador.

## Endereços dos sites

`GAME_URLS` (em `gameUrls.js`) tem o endereço de cada jogo, pelo id do backend, e do hub:

| id | endereço |
| --- | --- |
| `hub` | https://recreio.onrender.com |
| `guess-word` | https://adivinha-palavra.onrender.com |
| `stick-slash` | https://risca-palito.onrender.com |
| `dotz` | https://liga-pontos.onrender.com |

`gameUrl(id, code?, lang?)` monta o link (`https://liga-pontos.onrender.com/?code=K7Q2M&lang=pt-BR`). Para desenvolver localmente, `VITE_GAME_URLS` no `.env` do site troca os endereços que forem dados, em JSON: `VITE_GAME_URLS={"hub":"http://localhost:5173","stick-slash":"http://localhost:5174"}`.

Se um site precisar do nome reserva no Render (por exemplo `risca-palito-jogo`), atualize a tabela acima e o `gameUrls.js` numa nova versão.

## Lançar uma versão

1. Abra o PR, faça o merge no `main`.
2. Suba `version` no `package.json` e crie a tag: `git tag v0.3.0 && git push origin v0.3.0`.
3. Em cada site, troque a tag na dependência e rode `npm install` para atualizar o `package-lock.json`.

As tags nunca são movidas: um site que fixou `v0.2.0` sempre recebe o mesmo código.

## Build no Render

O repositório é privado, então o build de cada static site precisa de um token do GitHub. Use um token fine-grained, só leitura (`Contents: Read`), com acesso apenas a `arcade-hub-ui`, guardado na variável `GITHUB_TOKEN` do serviço (`sync: false` no `render.yaml`; nunca commitar). O comando de build reescreve os endereços do GitHub para usar o token antes de instalar:

```bash
git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/" \
  && git config --global --add url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "ssh://git@github.com/" \
  && git config --global --add url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "git@github.com:" \
  && npm ci && npm run build
```

As três regras cobrem os formatos de endereço que o `npm` pode gravar no `package-lock.json` (`https`, `git+ssh` e `git@`).

## Desenvolvimento

```bash
npm install
npm test
```

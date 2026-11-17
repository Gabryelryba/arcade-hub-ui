# arcade-hub-ui

Código compartilhado pelos sites dos jogos (Arcade Hub): componentes Svelte, conexão Socket.IO, nome do jogador, convites, textos (i18n) e estilos globais. Cada jogo é um site independente (`risca-palito-front`, `liga-pontos-front`, `adivinha-palavra-front`) e instala este pacote.

O pacote não tem build: publica os arquivos `.svelte` e `.js` fonte, e o Vite de cada site compila.

## Instalar

No `package.json` do site, com a tag fixa:

```json
"dependencies": {
  "arcade-hub-ui": "github:Gabryelryba/arcade-hub-ui#v0.3.0"
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

O `GameApp.svelte` é a página inteira de um site de jogo: fundo animado, o jogo e o diálogo de nome. Ele lê o convite (`?code=`) e entrega o código ao jogo uma vez. Não há hub nem troca entre jogos: a primeira tela do jogo é a landing page dele, e sair de uma partida ou sala volta para ela. Um código de sala de outro jogo é respondido pelo servidor como sala inexistente (`room-not-found`). O `main.js` de um jogo fica assim:

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

O jogo recebe do `GameApp` as props `inviteCode`, `onInviteUsed`, `playerName`, `ensureName` (pede o nome na primeira vez que precisa) e `editName` (abre o diálogo para trocar o nome).

## Landing page

O `GameLanding.svelte` é a primeira tela de um jogo e a landing page do site: nome e chamada do jogo ao lado do tabuleiro animado (acima dele no celular), **Criar Sala**, **Entrar com Código** e a seção "Como jogar" com os passos numerados. Tem um único `h1` (o nome do jogo) e `h2` em "Como jogar".

```svelte
<GameLanding
  gameId="dotz"
  eyebrow={t("dotz.eyebrow")}
  title={t("dotz.name")}
  lede={t("dotz.lede")}
  steps={tList("dotz.steps")}
  {connecting}
  {slowServer}
  bind:joinError
  bind:showJoinForm
  onCreate={createRoom}
  onJoin={joinRoom}
  {playerName}
  onEditName={editName}
>
  {#snippet art()}<Preview />{/snippet}
  {#snippet actions()}
    <!-- opcional: botões extras ao lado dos dois principais -->
  {/snippet}
</GameLanding>
```

- `steps`: lista de `{ title, text }`. No i18n do site, guarde a lista inteira numa chave (`dotz.steps: [{ title, text }, ...]`) e leia com `tList("dotz.steps")`, que segue o idioma atual.
- `joinError` e `showJoinForm` são do jogo (`bind:`), para uma recusa do servidor reabrir o formulário com a mensagem.
- `onEditName` (opcional) mostra o nome do jogador no canto superior direito da landing, com o botão de trocar. No celular, com nome, fica só o avatar e o lápis; sem nome, "Adicionar Nome". Na sala e na partida o jogo tem a própria barra do topo, sem o nome.

## Textos (i18n)

`en.js` e `pt-BR.js` têm só o que todos os sites usam (`common`, `lobby`, `result`, `errors`, `name`…); o nome do jogo fica nos textos do próprio site. Cada site registra os próprios textos com `registerMessages({ en: {...}, "pt-BR": {...} })` antes do `mount`; uma chave que já existe é substituída (por exemplo `meta.description`). `dictionaryEntries()` ajuda o site a testar que os dois idiomas têm as mesmas chaves.

O idioma inicial vem de `?lang=pt-BR` ou `?lang=en` no endereço, depois da escolha guardada no site, depois do navegador.

## Lançar uma versão

1. Abra o PR, faça o merge no `main`.
2. Suba `version` no `package.json` e crie a tag: `git tag v0.3.0 && git push origin v0.3.0`.
3. Em cada site, troque a tag na dependência e rode `npm install` para atualizar o `package-lock.json`.

As tags nunca são movidas: um site que fixou `v0.2.0` sempre recebe o mesmo código.

## Build no Render

O repositório é público, então os sites instalam o pacote sem token: o comando de build é só `npm ci && npm run build`.

O `package-lock.json` grava o endereço como `git+ssh://git@github.com/...`, mas o `npm` baixa pacotes de repositórios públicos do GitHub por HTTPS, sem chave SSH. Isso foi testado com clone limpo, `HOME` vazio e SSH desligado.

## Desenvolvimento

```bash
npm install
npm test
```

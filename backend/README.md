# Backend — Eu Amo Piri

API REST do projeto **Eu Amo Piri**, desenvolvida para compartilhar experiências de quem visitou Pirenópolis (hospedagem, restaurantes, passeios, cachoeiras, etc.).

Este documento explica tudo o que outro desenvolvedor precisa saber para clonar o repositório, configurar o ambiente e começar a contribuir.

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **Node.js** | Runtime JavaScript |
| **TypeScript** | Tipagem estática |
| **Express 5** | Servidor HTTP e rotas |
| **Prisma 7** | ORM e migrations do banco |
| **PostgreSQL** | Banco de dados relacional |
| **Docker** | Sobe o PostgreSQL local de forma padronizada (recomendado) |
| **tsx** | Executa TypeScript em desenvolvimento |

---

## Pré-requisitos

Antes de começar, instale na sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recomendado para o banco de dados)
- Git

> **Alternativa ao Docker:** é possível usar PostgreSQL instalado diretamente no sistema operacional ou um banco na nuvem. Nesse caso, ajuste a `DATABASE_URL` no `.env` conforme o seu ambiente.

---

## Banco de dados com Docker

O projeto utiliza **PostgreSQL rodando em um container Docker** no ambiente de desenvolvimento. Isso garante que **todos os desenvolvedores usem a mesma versão e configuração do banco**, sem precisar instalar o PostgreSQL manualmente.

### Como funciona para cada desenvolvedor?

| O que | Explicação |
|-------|------------|
| **Container Docker** | Roda **localmente** na máquina de cada desenvolvedor — não é compartilhado via Git |
| **Comando `docker run`** | Cada pessoa executa o mesmo comando após clonar o projeto |
| **Dados do banco** | Ficam no container/volume local de cada máquina (cada dev tem seu próprio banco) |
| **Código e migrations** | Versionados no Git — todos aplicam as mesmas tabelas com `prisma migrate` |
| **`.env`** | Cada dev cria o seu localmente (não versionado), apontando para `localhost:5432` |

Ou seja: o **Docker não vai no repositório**, mas o **comando para subir o banco** e a **connection string** ficam documentados aqui para que qualquer pessoa replique o ambiente.

### Subir o PostgreSQL (primeira vez)

Com o Docker Desktop aberto e rodando, execute na pasta `backend/` (ou em qualquer terminal):

```bash
docker run --name euamopiri-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=euamopiri \
  -p 5432:5432 \
  -d postgres:16
```

| Parâmetro | Significado |
|-----------|-------------|
| `--name euamopiri-db` | Nome do container (facilita start/stop) |
| `POSTGRES_PASSWORD=postgres` | Senha do usuário padrão `postgres` |
| `POSTGRES_DB=euamopiri` | Nome do banco criado automaticamente |
| `-p 5432:5432` | Expõe a porta 5432 do container no `localhost` |
| `-d` | Roda em segundo plano (detached) |
| `postgres:16` | Imagem oficial do PostgreSQL 16 |

Verifique se o container está rodando:

```bash
docker ps
```

Você deve ver o container `euamopiri-db` com status **Up** e porta `0.0.0.0:5432->5432/tcp`.

### Connection string correspondente

Com o container acima, use no `.env`:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/euamopiri"
PORT=3000
```

| Parte da URL | Valor |
|--------------|-------|
| Usuário | `postgres` (padrão da imagem) |
| Senha | `postgres` |
| Host | `localhost` |
| Porta | `5432` |
| Banco | `euamopiri` |

### Uso no dia a dia

O container **não precisa ser recriado** a cada vez que você for desenvolver. Use:

```bash
# Parar o banco (ao encerrar o trabalho)
docker stop euamopiri-db

# Iniciar novamente (no próximo dia)
docker start euamopiri-db

# Ver logs do banco (útil para debug)
docker logs euamopiri-db

# Ver se está rodando
docker ps
```

### Remover e recriar o container

Se precisar zerar o banco local ou corrigir configuração:

```bash
docker stop euamopiri-db
docker rm euamopiri-db
```

Depois rode o comando `docker run` novamente (seção acima) e reaplique as migrations:

```bash
npx prisma migrate deploy
```

> **Atenção:** remover o container apaga os dados locais desse banco. O código e as migrations no Git não são afetados.

---

## Primeiros passos (setup completo)

### 1. Clonar o repositório e entrar na pasta do backend

```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Subir o banco PostgreSQL com Docker

Siga a seção [Banco de dados com Docker](#banco-de-dados-com-docker) e execute o `docker run` (ou `docker start euamopiri-db` se o container já existir).

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

O `.env.example` já traz a `DATABASE_URL` compatível com o container Docker. Em geral, **não é necessário alterar nada** se você usou o comando documentado acima.

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/euamopiri"
PORT=3000
```

> **Importante:** o arquivo `.env` **não é versionado** no Git (contém senhas e segredos). Cada desenvolvedor cria o seu localmente a partir do `.env.example`.

### 5. Gerar o Prisma Client

A pasta `generated/prisma/` **não está no Git** de propósito. Ela é recriada automaticamente a partir do schema.

```bash
npx prisma generate
```

Isso gera o cliente em `backend/generated/prisma/`, que é usado pelo código em `src/config/prisma.ts`, `src/model/` e `src/views/`.

> **Por que não versionar o `generated/`?**
> O conteúdo é gerado automaticamente pelo Prisma a partir de `prisma/schema.prisma`. Versionar essa pasta causaria conflitos desnecessários entre desenvolvedores. O fluxo correto é: clonar → `npm install` → `npx prisma generate`.

### 6. Aplicar as migrations no banco

As migrations (em `prisma/migrations/`) **são versionadas** e criam as tabelas no PostgreSQL:

```bash
npx prisma migrate deploy
```

Em desenvolvimento, se precisar sincronizar um banco novo:

```bash
npx prisma migrate dev
```

### 7. Subir o servidor

```bash
npm run dev
```

Se tudo estiver certo, você verá:

```
Servidor rodando em http://localhost:3000
```

Teste no navegador ou com curl:

```bash
curl http://localhost:3000
```

Resposta esperada:

```json
{ "message": "Bem-vindo À API do Eu Amo Piri!" }
```

---

## Checklist rápido para novo desenvolvedor

```
[ ] Node.js instalado
[ ] Docker Desktop instalado e rodando
[ ] git clone + cd backend
[ ] docker run ... (ou docker start euamopiri-db)
[ ] docker ps  → container euamopiri-db com status Up
[ ] npm install
[ ] cp .env.example .env
[ ] npx prisma generate
[ ] npx prisma migrate deploy
[ ] npm run dev
[ ] GET http://localhost:3000 responde OK
```

---

## Arquitetura MVC

O backend segue o padrão **MVC** (Model — View — Controller), adaptado para uma API REST:

```
Requisição HTTP
      ↓
  server.ts        → inicializa o Express e registra as rotas
      ↓
  routes/          → mapeia URL + método HTTP → controller
      ↓
  controllers/     → recebe req/res, chama o model, usa a view
      ↓
  model/           → acessa o banco via Prisma
      ↓
  views/           → formata os dados para JSON de resposta
      ↓
  Resposta HTTP
```

### Estrutura de pastas

```
backend/
├── prisma/
│   ├── schema.prisma          # definição dos models (Place, Experiences)
│   └── migrations/            # histórico de alterações do banco (versionado)
├── generated/prisma/          # cliente Prisma gerado (NÃO versionado — rode prisma generate)
├── src/
│   ├── config/
│   │   └── prisma.ts          # instância única do PrismaClient
│   ├── model/
│   │   ├── placeModel.ts      # operações de banco: locais
│   │   └── experienceModel.ts # operações de banco: experiências
│   ├── views/
│   │   ├── placeView.ts       # formata JSON de locais
│   │   └── experienceView.ts  # formata JSON de experiências
│   ├── controllers/
│   │   ├── placeController.ts
│   │   └── experienceController.ts
│   ├── routes/
│   │   ├── placeRoutes.ts
│   │   └── experienceRoutes.ts
│   └── server.ts              # ponto de entrada (bootstrap)
├── .env.example               # modelo de variáveis de ambiente
├── .env                       # suas credenciais locais (não versionado)
├── prisma.config.ts           # configuração do Prisma CLI
├── package.json
└── tsconfig.json
```

### Responsabilidade de cada camada

| Camada | O que faz | O que **não** faz |
|--------|-----------|-------------------|
| `server.ts` | Sobe o servidor, middlewares, registra rotas | Lógica de negócio, queries |
| `routes/` | Define endpoints (`GET /places`, etc.) | Acesso ao banco |
| `controllers/` | Extrai dados de `req`, trata erros HTTP | Queries Prisma diretas |
| `model/` | CRUD no PostgreSQL via Prisma | Conhecer `req`/`res` |
| `views/` | Formata objeto para JSON da API | Acessar banco |
| `config/` | Configuração compartilhada (Prisma) | Rotas ou regras de negócio |

---

## Modelos de dados

Definidos em `prisma/schema.prisma`:

### Place (local)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | Int | Chave primária (auto) |
| `name` | String | Nome do local |
| `category` | String | Categoria (restaurante, cachoeira, etc.) |
| `description` | String | Descrição |
| `createdAt` | DateTime | Data de criação (automática) |
| `experiences` | Experiences[] | Experiências vinculadas |

### Experiences (experiência)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | Int | Chave primária (auto) |
| `userName` | String | Nome de quem compartilhou |
| `rating` | Int | Avaliação de 0 a 5 |
| `placeId` | Int | FK para Place |
| `createdAt` | DateTime | Data de criação (automática) |

---

## Endpoints da API

Base URL: `http://localhost:3000`

### Health check

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Verifica se a API está online |

### Locais (Places)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/places` | Lista todos os locais |
| `POST` | `/places` | Cadastra um novo local |

**Exemplo — criar local:**

```bash
curl -X POST http://localhost:3000/places \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Cachoeira dos Dragões\", \"category\": \"cachoeira\", \"description\": \"Linda cachoeira com trilha fácil\"}"
```

**Exemplo — listar locais:**

```bash
curl http://localhost:3000/places
```

### Experiências (Experiences)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/places/:placeId/experiences` | Lista experiências de um local |
| `POST` | `/places/:placeId/experiences` | Cadastra experiência em um local |

**Exemplo — criar experiência (placeId = 1):**

```bash
curl -X POST http://localhost:3000/places/1/experiences \
  -H "Content-Type: application/json" \
  -d "{\"userName\": \"Maria\", \"rating\": 5}"
```

**Exemplo — listar experiências de um local:**

```bash
curl http://localhost:3000/places/1/experiences
```

---

## Como adicionar uma nova funcionalidade

Siga sempre o fluxo MVC. Exemplo: adicionar `GET /places/:id` (buscar um local por ID):

1. **`model/placeModel.ts`** — função que consulta o banco:
   ```typescript
   export async function findPlaceById(id: number) {
       return prisma.place.findUnique({ where: { id } });
   }
   ```

2. **`controllers/placeController.ts`** — handler HTTP:
   ```typescript
   export async function getPlace(req: Request, res: Response) { ... }
   ```

3. **`routes/placeRoutes.ts`** — registrar a rota:
   ```typescript
   router.get('/:id', placeController.getPlace);
   ```

4. Se alterar o banco, edite `prisma/schema.prisma` e rode:
   ```bash
   npx prisma migrate dev --name descricao_da_mudanca
   npx prisma generate
   ```

---

## Comandos úteis

### API e Prisma

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npx prisma generate` | Gera o cliente Prisma em `generated/prisma/` |
| `npx prisma migrate dev` | Cria/aplica migration em desenvolvimento |
| `npx prisma migrate deploy` | Aplica migrations em produção/CI |
| `npx prisma studio` | Interface visual para ver/editar dados do banco |
| `npx prisma db pull` | Atualiza o schema a partir de um banco existente |

### Docker (banco de dados)

| Comando | Descrição |
|---------|-----------|
| `docker ps` | Lista containers em execução |
| `docker start euamopiri-db` | Inicia o banco após reiniciar o PC |
| `docker stop euamopiri-db` | Para o banco |
| `docker logs euamopiri-db` | Exibe logs do PostgreSQL |
| `docker rm euamopiri-db` | Remove o container (após `docker stop`) |

---

## Problemas comuns

### Erro: `DATABASE_URL is not set`

O arquivo `.env` não existe ou não tem a variável `DATABASE_URL`. Copie `.env.example` para `.env` e preencha.

### Erro ao importar de `generated/prisma/...`

O Prisma Client ainda não foi gerado. Rode:

```bash
npx prisma generate
```

### Erro de conexão com o PostgreSQL

- Verifique se o Docker Desktop está aberto.
- Confirme que o container está rodando: `docker ps` (deve aparecer `euamopiri-db`).
- Se o container existir mas estiver parado: `docker start euamopiri-db`.
- Confira se a `DATABASE_URL` no `.env` é `postgres://postgres:postgres@localhost:5432/euamopiri`.
- Teste a conexão com `npx prisma studio`.

### Erro: porta 5432 já em uso

Outro PostgreSQL (local ou outro container) já está usando a porta 5432.

**Opção A** — parar o outro serviço e usar a porta padrão.

**Opção B** — mapear outra porta no Docker:

```bash
docker run --name euamopiri-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=euamopiri \
  -p 5433:5432 \
  -d postgres:16
```

E ajustar o `.env`:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5433/euamopiri"
```

### Erro: container `euamopiri-db` já existe

O container foi criado anteriormente na sua máquina. Use `docker start euamopiri-db` em vez de `docker run` novamente. Para recriar do zero: `docker stop euamopiri-db && docker rm euamopiri-db` e então rode o `docker run` outra vez.

### Tabelas não existem no banco

As migrations não foram aplicadas. Rode:

```bash
npx prisma migrate deploy
```

### Alterei o `schema.prisma` e o TypeScript quebrou

Após mudar o schema, sempre execute:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## O que é versionado no Git

| Versionado | Não versionado |
|------------|----------------|
| `src/` (código-fonte) | `node_modules/` |
| `prisma/schema.prisma` | `.env` |
| `prisma/migrations/` | `generated/prisma/` |
| `.env.example` | Container Docker (cada dev cria localmente) |
| `README.md` (este guia) | Dados do banco local |
| | `dist/`, logs |

---

## Scripts disponíveis

```json
{
  "dev": "node --import tsx ./src/server.ts"
}
```

Por enquanto só existe o script `dev`. Para produção, será necessário adicionar um script de build/start (ex.: compilar com `tsc` ou usar `tsx` diretamente).

---

## Contato e documentação do projeto

Documentação geral da equipe: consulte o README na raiz do repositório e a Wiki/GitPages do projeto **Eu Amo Piri — Grupo 05**.

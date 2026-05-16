# RealWorld App com Docker

Este projeto demonstra como executar o frontend (Angular) e o backend (Spring Boot) da aplicação RealWorld usando Docker e Docker Compose.

## Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina. Você pode baixá-los e instalá-los a partir dos links oficiais:

*   [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Estrutura do Projeto

```
.
├── realworld-springboot-java
│   ├── Dockerfile
│   └── ... (código fonte do backend)
├── realworld-app-angular-v20
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ... (código fonte do frontend)
└── docker-compose.yml
└── README.md
```

## Como Executar

Siga os passos abaixo para construir e iniciar os contêineres do frontend e backend.

### 1. Navegar até o Diretório Raiz do Projeto

Abra seu terminal e navegue até o diretório onde o arquivo `docker-compose.yml` está localizado (neste caso, `/home/ubuntu/realworld-conduit/realworld-conduit/`):

```bash
cd /home/ubuntu/realworld-conduit/realworld-conduit/
```

### 2. Construir e Iniciar os Contêineres

Execute o seguinte comando para construir as imagens Docker e iniciar os serviços definidos no `docker-compose.yml`:

```bash
docker-compose up --build -d
```

*   `docker-compose up`: Inicia os serviços.
*   `--build`: Reconstrói as imagens Docker. Use isso sempre que fizer alterações no código-fonte ou nos Dockerfiles.
*   `-d`: Executa os contêineres em modo "detached" (em segundo plano).

### 3. Acessar a Aplicação

Após os contêineres serem iniciados, você pode acessar a aplicação:

*   **Frontend (Angular)**: Abra seu navegador e acesse [http://localhost:4200](http://localhost:4200)
*   **Backend (Spring Boot)**: O backend estará disponível em [http://localhost:8080](http://localhost:8080) (para chamadas da API pelo frontend).

### 4. Verificar o Status dos Contêineres

Para ver o status dos contêineres em execução:

```bash
docker-compose ps
```

### 5. Visualizar Logs

Para visualizar os logs de um serviço específico (por exemplo, `frontend` ou `backend`):

```bash
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 6. Parar e Remover os Contêineres

Para parar e remover todos os contêineres, redes e volumes criados pelo `docker-compose.yml`:

```bash
docker-compose down
```

Se você quiser remover também as imagens:

```bash
docker-compose down --rmi all
```

---

**Observação:** Certifique-se de que as portas `4200` e `8080` não estejam sendo usadas por outros aplicativos em sua máquina local antes de iniciar os contêineres.

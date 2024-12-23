# API de Upload e Escaneamento de Arquivos

Este projeto implementa um serviço de upload de arquivos com escaneamento de vírus integrado usando a CLI do Avast. A solução aborda o desafio de lidar com uploads de arquivos de forma segura, minimizando o risco de propagação de vírus. Os arquivos enviados são escaneados em busca de ameaças, com logs dos resultados armazenados em um banco de dados MySQL. Arquivos são aceitos por meio de um endpoint da API, e limites estritos de tamanho de arquivo são aplicados para garantir o processamento eficiente.

![Design Systems Checklist V.3](/public/image/banner-pt.jpg)

## Desafio

O principal desafio foi criar um sistema de upload de arquivos seguro e eficiente que:

1. Garante que todos os arquivos enviados sejam escaneados em busca de vírus.
2. Evita reescaneamentos desnecessários de arquivos duplicados.
3. Fornece logs e rastreabilidade dos resultados dos escaneamentos para cada arquivo.
4. Armazena metadados em um banco de dados relacional para fácil acompanhamento.
5. Limita o tamanho do arquivo a 1MB para uso controlado de recursos.

---

## Solução

A solução envolve:

1. **Tratamento de Upload de Arquivos:** Usando o framework Fastify, a API aceita uploads de arquivos por meio de um endpoint dedicado.
2. **Escaneamento de Vírus:** A CLI do Avast é utilizada para escanear os arquivos enviados em busca de potenciais ameaças.
3. **Registro de Resultados:** Os resultados dos escaneamentos (por exemplo, limpo ou infectado) são salvos em um banco de dados MySQL usando o Prisma ORM.
4. **Armazenamento de Arquivos:** Os arquivos são arquivados localmente no servidor com nomes únicos derivados de seus conteúdos.
5. **Tratamento de Erros e Tolerância a Falhas:** O tratamento de erros abrangente garante uma operação contínua e registro detalhado de falhas.

---

## Ferramentas e Tecnologias

### **Framework:**

- **Fastify**: Escolhido por seu desempenho e leveza, ideal para lidar com uploads de arquivos de forma eficiente.

### **Banco de Dados:**

- **MySQL**: Utilizado para armazenar metadados sobre arquivos enviados e resultados de escaneamentos, garantindo rastreabilidade e consultas fáceis.
- **Prisma**: Simplifica as interações com o banco de dados com um ORM intuitivo baseado em TypeScript.

### **Escaneamento de Vírus:**

- **CLI do Avast**: Executa o escaneamento antivírus localmente no servidor. Os resultados do escaneamento são analisados e armazenados para referência futura.

---

## Visão Geral da API

### **Endpoint:**

- `POST /upload`

### **Requisição:**

- **Headers:**
  - `Content-Type: multipart/form-data`
- **Corpo:**
  - `file` (obrigatório): O arquivo a ser enviado. Tamanho máximo: **1MB**.

### **Resposta:**

- **200 OK** (Arquivo enviado e escaneado com sucesso)
  ```json
  {
    "message": "Arquivo enviado e escaneado com sucesso",
    "scanResult": "clean"
  }
  ```
- **400 Bad Request** (Arquivo excede o limite de tamanho ou está ausente)
  ```json
  {
    "error": "Tamanho do arquivo excede o limite ou nenhum arquivo foi enviado"
  }
  ```
- **500 Internal Server Error** (Falha no escaneamento ou erro inesperado)
  ```json
  {
    "error": "Erro interno do servidor"
  }
  ```

---

## Instalação e Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/zeroskullx/secure-scan-uploader.git
   cd secure-scan-uploader
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o ambiente:** Crie um arquivo `.env` e defina as seguintes variáveis:

   ```env
   PORT=3333
   DATABASE_URL=mysql://user:password@localhost:3306/your_database
   FILE_UPLOAD_DIR=/path/to/upload/directory
   AVAST_CLI_PATH=/path/to/avast
   ```

4. **Execute as migrações do banco de dados:**

   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor:**

   ```bash
   npm run dev:watch
   ```

---

## Como Funciona

1. **Upload de Arquivo:** Os usuários enviam arquivos por meio do endpoint `/upload`. Arquivos que excedem o limite de 1MB são rejeitados.
2. **Escaneamento de Vírus:** O servidor invoca a CLI do Avast para escanear o arquivo enviado. Os resultados do escaneamento são registrados em um arquivo e armazenados no banco de dados.
3. **Arquivamento:** Os arquivos são armazenados localmente com um nome único baseado no hash de seus conteúdos para evitar duplicatas.
4. **Registro no Banco de Dados:** Metadados como nome do arquivo, resultado do escaneamento e timestamp do upload são armazenados no MySQL para referência.

---

## Exemplo de Uso

### Requisição

```bash
curl -X POST -F "file=@exemplo.txt" http://exemplo.com/upload
```

### Resposta

```json
{
  "message": "Arquivo enviado e escaneado com sucesso",
  "scanResult": "clean"
}
```

---

## Futuro: Da pra escalar :)

1. **Suporte a Armazenamento em Nuvem:** Integração com S3 ou Azure Blob Storage para armazenamento de arquivos.
2. **Escaneamento Distribuído:** Utilização de APIs antivírus baseadas em nuvem para escalabilidade.
3. **Acompanhamento Avançado de Metadados:** Armazenamento de atributos adicionais de arquivos, como ID do usuário ou tags de arquivo.
4. **Aprimoramentos de Escalabilidade:** Introdução de limites de taxa e processamento distribuído para lidar com tráfego intenso.

---

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## Contribuições

Contribuições são bem-vindas! Abra uma issue ou envie um pull request para quaisquer melhorias ou correções de bugs.

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)

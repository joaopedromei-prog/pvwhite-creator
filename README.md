# PV White-Hat Creator

Gerador de paginas de venda para produtos digitais de baixo ticket. Produz um **unico arquivo HTML** completo com design responsivo, copy white-hat e paginas legais embutidas como modais.

## Visao Geral

O sistema utiliza o Claude CLI para gerar paginas de venda profissionais a partir de prompts em linguagem natural. Cada pagina gerada inclui:

- **7 secoes de venda** (Hero, Entregaveis, Publico-alvo, Beneficios, Preco, FAQ, Footer)
- **4 modais legais** (Termos de Uso, Privacidade, Reembolso, Suporte)
- **CSS inline** com design system consistente (paleta ClickUp-inspired)
- **Copy white-hat** sem promessas absolutas ou claims proibidos
- **Layout responsivo** com grids adaptativos e classes utilitarias mobile

## Estrutura do Projeto

```
pvwhite-creator/
├── CLAUDE.md              # Instrucoes completas para geracao de paginas
├── README.md              # Este arquivo
├── _template/
│   └── index.html         # Template base com placeholders
└── app/
    ├── package.json
    ├── server.js           # Servidor Express + integracao Claude CLI
    └── public/
        └── index.html      # Interface web (tema Matrix)
```

## Requisitos

- **Node.js** v18+
- **Claude CLI** instalado e autenticado (`claude` disponivel no PATH)

## Instalacao e Uso

```bash
# 1. Instalar dependencias
cd app
npm install

# 2. Iniciar o servidor
npm start
```

O servidor inicia em **http://localhost:4000**.

### Como usar

1. Acesse `http://localhost:4000` no navegador
2. Digite um prompt descrevendo o produto, ex:
   > Create a page for Memory Revitalizer that helps with improving cognitive function. Price: $9.90
3. Clique em **REQUEST** (ou `Ctrl+Enter`)
4. Aguarde a geracao (pode levar 3-5 minutos)
5. Clique em **COPY** para copiar o HTML gerado
6. Cole em um arquivo `.html` e publique

## Design System

| Elemento | Cor | Hex |
|---|---|---|
| Primaria (CTAs, headers) | Purple | `#7B68EE` |
| Texto / Secoes escuras | Charcoal | `#292D34` |
| Fundo claro | Light Gray | `#F9FAFB` |
| Destaques, badges | Hot Pink | `#FD71AF` |
| Preco | Gold | `#FFC800` |
| Gradiente CTA | Purple → Blue | `#6647F0` → `#0091FF` |

**Tipografia:** Plus Jakarta Sans (titulos) + Inter (corpo)

## Arquitetura

### Servidor (`app/server.js`)

- Express na porta 4000
- Endpoint `POST /api/generate` recebe `{ prompt }` no body
- Executa `claude -p` via `child_process.spawn` com stdin pipe
- Timeout de 300s
- Extrai e valida HTML da resposta (remove fences markdown, trim pos-`</html>`)

### Interface Web (`app/public/index.html`)

- Tema Matrix com digital rain (canvas animado)
- Font: Share Tech Mono
- Timer de progresso durante geracao
- Botao de copia com fallback para navegadores antigos

### Template (`_template/index.html`)

- Arquivo HTML base com placeholders (`[PRODUCT_NAME]`, `[HEADLINE]`, etc.)
- Serve como referencia para a estrutura esperada na saida

## Regras de Compliance (White-Hat)

### Permitido
- "Pode ajudar voce a..."
- "Projetado para apoiar..."
- "Resultados individuais podem variar"
- "Estudos sugerem..."

### Proibido
- Garantias absolutas de resultados
- Claims milagrosos
- Escassez/urgencia falsa
- Conselhos medicos/financeiros/legais
- Promessas de renda

## Dados da Empresa

```
Schm Digital LTDA
CNPJ: 53.085.166/0001-14
Maringa - PR, Brazil
Suporte: suporte@divinehealing.blog
```

## Licenca

Projeto privado - Schm Digital LTDA.

## Mult Flooring — Base do Projeto (Design System)

Configurar a fundação técnica e visual do site. Nenhuma seção será construída — apenas tokens, componentes base e dados estáticos prontos para os próximos prompts.

---

### O que será entregue

**1. Design System global (`src/index.css`)**
- Importação da fonte Inter (400, 500, 600) via Google Fonts
- Variáveis CSS completas para:
  - Paleta de cores (base, surface, dark, bordas, texto, accent marrom #7a4f1e)
  - Tipografia (escala fluida com `clamp`, pesos, line-heights, tracking)
  - Espaçamento base 8px
  - Layout (max-width 1160px, paddings, section paddings)
  - Border radius, easings, durações, sombras, z-index
- Reset global, suavização de fontes, scroll comportado
- Scrollbar customizada e estilo de seleção de texto na cor accent

**2. Tailwind estendido (`tailwind.config.ts`)**
- Cores mapeadas para as CSS variables (`bg-base`, `accent`, `text-primary`, etc.)
- Família `sans` apontando para Inter
- Border radius customizados (sm, md, lg, pill)
- Easing `expo` para transições

**3. Componentes base reutilizáveis**
- `src/components/ui/Button.tsx` — variantes `primary` e `secondary`, três tamanhos (sm/md/lg), hover/active states
- `src/components/ui/Tag.tsx` — pill de categoria, com estado `active` e hover
- `src/components/ui/SectionLabel.tsx` — micro label uppercase acima de títulos
- `src/components/ui/Divider.tsx` — linha horizontal fina

**4. Layout wrapper (`src/components/layout/Layout.tsx`)**
- Container global: `min-h-screen`, `bg-bg-base`, `overflow-x-hidden`

**5. Dados estáticos (`src/lib/constants.ts`)**
- `COMPANY` — nome, telefone, licenças, CTAs, social
- `NAV_LINKS` — 4 links de navegação
- `TILE_CATEGORIES` — 6 categorias de filtro
- `TILES` — 8 produtos com specs completas (PEI, slip resistance, cores, imagens Unsplash)
- `TESTIMONIALS` — 5 depoimentos com cidade e rating
- `PROJECTS` — 6 projetos de portfólio (residencial, comercial, hospitalidade)

**6. Dependências**
- Instalar `framer-motion` (não usado ainda, mas disponível para próximos prompts)
- React, TypeScript, Tailwind e shadcn/ui já presentes no projeto

**7. App de validação (`src/pages/Index.tsx`)**
- Substituir placeholder por uma tela mínima dentro do `Layout` exibindo:
  - Texto centralizado: "Mult Flooring — Design System Ready"
  - Fundo `#faf7f4` aplicado via token
- Atualizar `index.html`: title = "Mult Flooring", meta description coerente

---

### Observações técnicas

- O design system existente em `src/index.css` (tokens shadcn em HSL) será **substituído** pelos tokens da Mult Flooring. Componentes shadcn que usam variáveis antigas (`--background`, `--primary`, etc.) continuarão funcionando porque manteremos os aliases shadcn essenciais mapeados aos novos tokens, evitando quebrar imports existentes.
- Estrutura de pastas seguirá o padrão pedido (`components/ui`, `components/layout`, `lib`), aproveitando o que já existe em `src/components/ui` (shadcn) sem conflito — os novos arquivos `Button.tsx`, `Tag.tsx`, etc. usam PascalCase e convivem com os shadcn em lowercase.
- Nenhuma seção (Hero, Collections, Footer, etc.) será criada — base limpa para os próximos 8 prompts.

### Resultado visual esperado

Preview mostra fundo bege quente (#faf7f4) com o texto "Mult Flooring — Design System Ready" centralizado em Inter, cor escura. Todos os tokens, componentes e dados prontos para uso.
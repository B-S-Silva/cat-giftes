# MeowList 🐱🎁

MeowList é um app de listas de desejos com foco em experiências fofas e amigáveis: permite criar listas categorizadas, marcar prioridades dos itens, fazer reserva anônima de presentes e manter um perfil gamificado com XP, nível, streak diário e conquistas — tudo com microanimações sutis e um visual inspirado no Duolingo.

**Demo local:** `http://localhost:5173/`

**Backend:** Express + Prisma (PostgreSQL) em `backend/`.

---

**Principais Funcionalidades**
- Branding MeowList e logo com animação (`public/meow-cat.svg`).
- Categorias de listas (ex.: Tecnologia, Livros, Maquiagem).
- Prioridade dos itens (“Quero muito” e “Seria legal”).
- Reserva anônima de presentes (quem reserva não aparece; o item fica marcado como reservado).
- Perfil gamificado: XP, nível, streak diário, conquistas (badges) e barra de progresso.
- UI com animações sutis (`framer-motion`) e microinterações.

---

**Tecnologias Usadas**
- Frontend: `React` (Vite), `react-router-dom`, `axios`, `framer-motion`, `lucide-react`, `date-fns`.
- Estilos: `tailwindcss` (via plugins de Vite/PostCSS) + CSS utilitário.
- Backend: `Node.js` + `Express`, `Prisma` + `@prisma/client`, `PostgreSQL`, `multer` (upload), `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`, `morgan`.

---

**Como Usar (Desenvolvimento Local)**
- Pré-requisitos:
  - Node.js 18+
  - Banco PostgreSQL acessível (local ou remoto)

- Passo a passo:
  1) Instale dependências do frontend (raiz):
     - `npm install`
  2) Instale dependências do backend:
     - `cd backend`
     - `npm install`
  3) Configure variáveis de ambiente:
     - `backend/.env` (exemplo):
       - `DATABASE_URL=postgresql://user:pass@host:port/dbname`
       - `JWT_SECRET=uma_chave_segura_aqui`
       - `CORS_ORIGIN=http://localhost:5173`
       - `PORT=4000` (opcional)
     - `./.env` (frontend):
       - `VITE_API_URL=http://localhost:4000` (URL do backend)
  4) Prisma (backend):
     - `cd backend`
     - `npx prisma generate`
     - `npx prisma migrate dev -n init_meowlist` (ou `npx prisma migrate deploy` em produção)
  5) Suba o backend:
     - `npm run dev` (usa `nodemon`) — API em `http://localhost:4000/`
  6) Suba o frontend (em outro terminal na raiz do projeto):
     - `npm run dev` — app em `http://localhost:5173/`

- Dica: Se ver erro de “Network Error” ou `ERR_NAME_NOT_RESOLVED`, verifique se `VITE_API_URL` não tem protocolo duplicado (evite `https://https://...`).

---

**Fluxos de Uso Rápidos**
- Criar lista: página “Minhas Listas” → informe título, visibilidade, categoria e descrição.
- Adicionar item: dentro da lista → nome, link, preço, descrição, imagem e prioridade.
- Reserva anônima: visitante em lista pública → botão “Reservar anonimamente”/“Remover reserva”.
- Perfil gamificado: página “Perfil” → check-in diário (+XP), ver nível/streak, adicionar conquistas.

---

**Deploy (Opcional)**
- Frontend: Vercel (SPA). Configure `VITE_API_URL` com a URL do backend.
- Backend: Railway/Render/Heroku. Configure `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGIN` apontando para o domínio do frontend.
- Prisma: `npx prisma migrate deploy` em produção.

---

**Licença**
- Uso livre no contexto do projeto. Sem garantias.

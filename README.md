# EPWAY Vocabulary Hub

![EPWAY Vocabulary Hub](https://img.shields.io/badge/EPWAY-Vocabulary%20Hub-3B82F6?style=for-the-badge&logo=google-chrome)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28?style=for-the-badge&logo=firebase)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Word%20Analysis-8E24AA?style=for-the-badge&logo=googlegemini)
![Notion](https://img.shields.io/badge/Notion-Embed%20Ready-000000?style=for-the-badge&logo=notion)

Sistema profissional de gestão de vocabulário pessoal desenvolvido para os alunos da **EPWAY English School**. Permite registrar, analisar com Inteligência Artificial Gemini, revisar com **Spaced Repetition (Revisão Espaçada)**, visualizar estatísticas de evolução por nível CEFR e incorporar perfeitamente dentro do **Notion** usando o comando `/embed`.

---

## 🚀 Funcionalidades Principais

- 🔐 **Autenticação Firebase:** Login com Google, E-mail/Senha e Modo Demonstrativo para Notion Embed.
- ☁️ **Firestore Database:** Armazenamento em nuvem individualizado e seguro para cada estudante.
- 🤖 **Análise por IA (Gemini API):** Análise linguística instantânea ao clicar em `Analyze` (IPA, Tradução, Significado, CEFR, Collocations, Word Family, Sinônimos, Antônimos, Erros comuns e Frases exemplo).
- 📚 **Biblioteca de Vocabulário (Gallery):** Busca instantânea por palavra, tradução, significado e filtros avançados por CEFR (A1-C2), Categoria, Classe Gramatical, Dificuldade e Status.
- 🔄 **Revisão Diária (Spaced Repetition):** Flashcards interativos com sistema de repetição espaçada (+1, +3, +7 dias) e celebração com confetes.
- 📊 **Dashboard & Estatísticas (Recharts):** Gráficos de barra por nível CEFR, gráficos de pizza por categoria, acompanhamento de evolução mensal e cálculo de sequências de estudos (Streak).
- ⚙️ **Configurações & Backup:** Troca de tema (Claro/Escuro), foto/nome de perfil e exportação em JSON e CSV, além de importação em lote.
- 📌 **Notion Embed Ready:** Desenhado para encaixar perfeitamente em blocos `/embed` no Notion sem barras de rolagem indesejadas.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti.
- **Backend & Servidor:** Express, Node.js, `esbuild` (Build Full-Stack), `@google/genai` SDK.
- **Banco de Dados & Auth:** Firebase Authentication, Cloud Firestore.

---

## 📦 Como Instalar e Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/epway-vocabulary-hub.git
cd epway-vocabulary-hub
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie ou renomeie o arquivo `.env` baseado no `.env.example`:
```env
GEMINI_API_KEY="SUA_CHAVE_GEMINI_API"
```

### 4. Executar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse no navegador: `http://localhost:3000`

---

## 🌐 Publicação no GitHub Pages

Para publicar este aplicativo gratuitamente no GitHub Pages:

### Método 1: GitHub Actions (Recomendado)
1. No seu repositório no GitHub, acesse **Settings > Pages**.
2. Em **Source**, selecione **GitHub Actions**.
3. Adicione o workflow `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Método 2: Pacote gh-pages
```bash
npm install -D gh-pages
```
Adicione o script em `package.json`:
```json
"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}
```
E execute:
```bash
npm run deploy
```

---

## 📝 Como Incorporar no Notion

1. Abra a sua página do curso de inglês na **EPWAY English School** no Notion.
2. Digite `/embed` e pressione Enter.
3. Cole o link da sua aplicação (ex: `https://seu-usuario.github.io/epway-vocabulary-hub/` ou o link da sua Cloud Run / Vercel).
4. Redimensione a janela do Embed conforme preferir. A interface se ajustará automaticamente!

---

## 🔑 Configuração do Firebase & Firestore

O projeto utiliza `firebase-applet-config.json` para definir as credenciais de acesso ao Firestore e Auth. As regras de segurança do Firestore (`firestore.rules`) garantem que cada aluno acesse apenas seus próprios dados:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /words/{wordId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 🤖 Serviço de IA (`aiService.js`)

A função `analyzeWord(word, lesson)` em `src/services/aiService.js` faz uma requisição HTTP para a rota backend `/api/analyze-word`, que por sua vez utiliza o SDK oficial `@google/genai` com o modelo `gemini-2.5-flash` para analisar fonética IPA, collocations e nuances da língua inglesa especificamente para estudantes brasileiros.

---

&copy; EPWAY English School. Todos os direitos reservados.

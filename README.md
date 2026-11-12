# Frontend - Bilheteria de Cinema

App em Expo/React Native (TypeScript) que consome a API do backend. Mesmo código roda em
Web, Android e iOS.

Backend: https://github.com/larentispedro/bilheteria-api

## Papéis

- **Cliente**: navega pelas sessões, escolhe assentos no mapa, paga (simulado) e vê seus ingressos.
- **Operador** (bilheteria + gerência, mesmo papel): vende no balcão (mesmo fluxo de
  seleção de assentos), valida ingressos na entrada e, na aba Gerência, cadastra
  filmes/eventos, salas/assentos, sessões e consulta relatórios de vendas e ocupação.

## Configuração

O endereço da API vem da variável de ambiente `EXPO_PUBLIC_API_URL` (ver `src/api/config.ts`).
Copie `.env.example` para `.env` e preencha se o backend não estiver em `http://localhost:3000`.

Sem essa variável, o app usa o backend local: `http://localhost:3000` no modo Web e em
dispositivo físico (ajuste para o IP da máquina na rede local se precisar), e
`http://10.0.2.2:3000` automaticamente no emulador Android.

Em produção, `EXPO_PUBLIC_API_URL` é definida como `/api` — um caminho **relativo**, não uma URL
completa. Assim o build funciona por IP ou por domínio, com ou sem HTTPS, sem precisar
recompilar se o endereço do backend mudar: o navegador resolve `/api` contra o próprio host que
serviu a página, e é o Nginx quem repassa isso para a API na porta 3000 (ver seção "Produção"
do `../backend/README.md`).

## Publicação

`npx expo export -p web` gera a pasta `dist/` com os arquivos estáticos do app; essa pasta é o
que o Nginx serve em produção.

## Rodando

Com o backend rodando (`npm run dev` em `../backend`):

```
npm install
npm run web      # mais simples para testar/demonstrar
# ou
npm run android
npm run ios
```

Usuários de teste (criados pelo `npm run seed` do backend):

- Cliente: `cliente@teste.com` / `123456`
- Operador: `operador@cinema.com` / `123456`

Essas credenciais valem só para ambiente local — em produção o seed não cria o usuário cliente
de teste, e a senha do operador foi trocada manualmente, direto no banco (não fica versionada
neste repositório).

# Frontend - Bilheteria de Cinema

App em Expo/React Native (TypeScript) que consome a API do backend. Mesmo código roda em
Web, Android e iOS.

## Papéis

- **Cliente**: navega pelas sessões, escolhe assentos no mapa, paga (simulado) e vê seus ingressos.
- **Operador** (bilheteria + gerência, mesmo papel): vende no balcão (mesmo fluxo de
  seleção de assentos), valida ingressos na entrada e, na aba Gerência, cadastra
  filmes/eventos, salas/assentos, sessões e consulta relatórios de vendas e ocupação.

## Configuração

Edite `src/api/config.ts` se o backend não estiver em `http://localhost:3000`
(no emulador Android, use `http://10.0.2.2:3000`; em dispositivo físico, use o IP da
máquina na rede local).

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

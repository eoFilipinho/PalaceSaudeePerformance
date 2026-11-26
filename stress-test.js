
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    // Etapa 1: 10 usuários
    { duration: '10s', target: 10 },
    { duration: '20s', target: 10 },

    // Etapa 2: 25 usuários
    { duration: '10s', target: 25 },
    { duration: '20s', target: 25 },

    // Etapa 3: 50 usuários
    { duration: '10s', target: 50 },
    { duration: '20s', target: 50 },

    // Etapa 4: 75 usuários
    { duration: '10s', target: 75 },
    { duration: '20s', target: 75 },

    // Etapa 5: 100 usuários
    { duration: '10s', target: 100 },
    { duration: '20s', target: 100 },
  ],
};

export default function () {
  const response = http.get('http://127.0.0.1:4173/');

  check(response, {
    'Status HTTP 200': (r) => r.status === 200,
    'Página HTML recebida': (r) =>
      r.headers['Content-Type']?.includes('text/html'),
  });

  sleep(1);
}

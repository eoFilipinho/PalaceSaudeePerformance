
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    // Etapa 1: carga inicial
    { duration: '10s', target: 10 },

    // Etapa 2: aumento repentino para 100 usuários
    { duration: '5s', target: 100 },

    // Etapa 3: mantém o pico
    { duration: '20s', target: 100 },

    // Etapa 4: redução repentina
    { duration: '5s', target: 10 },

    // Etapa 5: observa a recuperação
    { duration: '20s', target: 10 },
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


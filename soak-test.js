
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    // Etapa 1: aquecimento até 20 usuários
    { duration: '30s', target: 20 },

    // Etapa 2: mantém 20 usuários por 5 minutos
    { duration: '5m', target: 20 },

    // Etapa 3: reduz gradualmente a carga
    { duration: '30s', target: 0 },
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

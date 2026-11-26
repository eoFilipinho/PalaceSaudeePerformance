
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '110s', target: 50 },
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


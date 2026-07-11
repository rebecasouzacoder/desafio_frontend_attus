import { filtrarEPaginar } from './filtrar-e-paginar';

interface Usuario {
  id: number;
  nome: string;
}

const usuarios: Usuario[] = [
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Bruno' },
  { id: 3, nome: 'Ana Paula' },
  { id: 4, nome: 'Carlos' },
];

export const resultado = filtrarEPaginar(
  usuarios,
  (usuario) => usuario.nome.toLowerCase().includes('ana'),
  { pagina: 1, tamanho: 1 },
);

// resultado.itens => [{ id: 1, nome: 'Ana' }]
// resultado.total => 2

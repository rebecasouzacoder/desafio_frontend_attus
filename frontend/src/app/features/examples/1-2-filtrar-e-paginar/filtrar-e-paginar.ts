export interface PaginaParams {
  pagina: number;
  tamanho: number;
}

export interface Pagina<T> {
  itens: T[];
  total: number;
}

export function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams,
): Pagina<T> {
  const filtrados = data.filter(filterFn);
  const inicio = (params.pagina - 1) * params.tamanho;
  const itens = filtrados.slice(inicio, inicio + params.tamanho);

  return { itens, total: filtrados.length };
}

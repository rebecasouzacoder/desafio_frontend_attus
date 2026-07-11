export interface IProduto {
  readonly id: number;
  readonly descricao: string;
  readonly quantidadeEstoque: number;
}

export class Produto implements IProduto {
  constructor(
    public readonly id: number,
    public readonly descricao: string,
    public readonly quantidadeEstoque: number,
  ) {}
}

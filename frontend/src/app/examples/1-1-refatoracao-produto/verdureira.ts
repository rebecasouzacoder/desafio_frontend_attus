import { Produto } from './produto';

export class Verdureira {
  private readonly produtos: readonly Produto[] = [
    new Produto(1, 'Maçã', 20),
    new Produto(2, 'Laranja', 0),
    new Produto(3, 'Limão', 20),
  ];

  getDescricaoProduto(produtoId: number): string {
    const produto = this.buscarProduto(produtoId);
    return `${produto.id} - ${produto.descricao} (${produto.quantidadeEstoque}x)`;
  }

  hasEstoqueProduto(produtoId: number): boolean {
    return this.buscarProduto(produtoId).quantidadeEstoque > 0;
  }

  private buscarProduto(produtoId: number): Produto {
    const produto = this.produtos.find((p) => p.id === produtoId);

    if (!produto) {
      throw new Error(`Produto ${produtoId} não encontrado`);
    }

    return produto;
  }
}

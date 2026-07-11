# 1.1 — Refatoração

O código original tinha `any` em tudo, então nada era checado em tempo de compilação — troquei por tipos reais (`number`, `string`) e deixei as propriedades de `Produto` como `readonly`, já que um produto não muda depois de criado.

O resto é mais limpeza: os dois métodos (`getDescricaoProduto` e `hasEstoqueProduto`) tinham exatamente o mesmo loop pra achar o produto pelo id, então extraí isso pra um `buscarProduto` privado em vez de repetir. Troquei o loop manual por `find`, e o `if (x > 0) return true; else return false` virou só o retorno da comparação direto.

Um detalhe que mudei de propósito: se o produto não existe, agora lança um erro em vez de deixar `produto` como `undefined` e estourar um `TypeError` mais na frente sem explicação nenhuma.

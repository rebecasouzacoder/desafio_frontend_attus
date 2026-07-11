# 2.1 — Change Detection e OnPush

O nome não aparecia porque com `OnPush` o Angular só reavalia a view em alguns gatilhos específicos: uma `@Input` mudando de referência, um evento disparado no próprio template, `markForCheck()` chamado na mão, ou um Observable via `async` pipe (que chama o markForCheck sozinho a cada emissão). O `subscribe()` do código original atualiza `this.texto` direto no callback, fora de qualquer um desses casos — o zone.js até percebe que rolou algo assíncrono e dispara um tick, mas o Angular pula esse componente porque ele não está marcado como "dirty". Resultado: o valor muda internamente, mas a tela não é atualizada.

A correção, sem mexer na estratégia, no `PessoaService` nem no `setInterval`: injeta `ChangeDetectorRef` e chama `markForCheck()` logo depois de atualizar o `texto` dentro do subscribe. Dá pra ver em `pessoa-onpush-demo.component.ts`.

(Trocar por `async` pipe no template também resolveria e é até mais idiomático, mas isso mudaria a forma como o dado é consumido — o enunciado pedia a correção mínima, então fui por aí.)

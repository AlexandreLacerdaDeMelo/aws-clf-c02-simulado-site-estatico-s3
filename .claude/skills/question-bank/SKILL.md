---
name: question-bank
description: Cria, edita e revisa as questões do simulado AWS Certified Cloud Practitioner (CLF-C02) em js/questions.js, mantendo formato, distribuição por domínio, estilo da prova e originalidade. Use quando o usuário pedir questões novas, mais questões, correção de uma questão ou explicação, revisão técnica do banco, mudança na distribuição dos simulados, ou quando citar dumps/repositórios de questões como referência.
---

# Banco de questões

Arquivo: `js/questions.js`, com as globais `DOMAINS` e `QUESTIONS`. É carregado como script comum, para funcionar via `file://`.

## Regra de ouro: questões originais

Nunca copie nem traduza questões de dumps (ExamTopics, repositórios com `community_vote`) ou da prova real: isso viola o contrato de certificação da AWS, e o site é público. Repositórios de outras provas (como a SAA-C03) servem **só** como referência de estilo. Se o usuário mandar material desse tipo, explique o motivo e escreva questões novas.

## Formato

```js
{
  id: 's08', d: 'seguranca',           // prefixo do domínio (c/s/t/f) + número com 2 dígitos
  q: 'Enunciado em cenário...',        // múltipla resposta termina com "(Escolha 2)"
  o: ['A', 'B', 'C', 'D'],             // 4 na escolha única; 5 na múltipla resposta
  a: [1],                              // índice(s) correto(s); a tela embaralha a ordem
  e: 'Por que a correta está certa e por que as outras não servem.',
  s: 'AWS IAM'                         // serviço ou tema (aparece na revisão e nas recomendações)
}
```

Domínios (`d`): `conceitos`, `seguranca`, `tecnologia`, `faturamento`.

## Distribuição (pesos oficiais 24/30/34/12)

As fontes da verdade são o código, não esta skill:
- **Questões por domínio no banco:** `EXPECTED` em `tests/validate-questions.mjs`.
- **Sorteio do simulado completo e do rápido:** `MODES.full.mix` e `MODES.quick.mix` em `js/app.js`.

O banco precisa ter pelo menos o `mix` do simulado completo em cada domínio. O ideal é ter cerca do dobro, para os simulados variarem.

## Estilo (como na prova)

- **Cenário de empresa** com um requisito claro e qualificadores como "MAIS econômica", "MENOR esforço operacional" ou "MAIS segura".
- **Distratores reais e parecidos:** serviços que existem e confundem de verdade (CloudTrail × CloudWatch × Config, Shield × WAF × GuardDuty, Standard-IA × One Zone-IA). Nada de alternativas absurdas.
- **Múltipla resposta:** cerca de 12–15% do banco, sempre "(Escolha 2)" com 5 alternativas.
- **Explicação:** diz por que a correta está certa **e** por que os distratores principais estão errados, em texto corrido. A interface mostra "Sua resposta", "Resposta correta", "Explicação" e "Tema"; não crie seções dentro do texto.
- **Idioma:** português do Brasil. Nomes de serviços ficam como a AWS escreve.

## Adicionar ou alterar questões

1. Escreva as questões novas, ou corrija as existentes, seguindo o formato e o estilo.
2. Para novas, continue a numeração do domínio (por exemplo, `s40`, `s41`). Não reaproveite ids apagados.
3. **Se os totais do banco ou a proporção dos simulados mudarem**, atualize todas as cópias desses números:
   - `EXPECTED` em `tests/validate-questions.mjs`;
   - `MODES.*.mix` em `js/app.js`;
   - os testes do `tests/e2e.mjs` que verificam totais e sorteio (total do banco, tamanho do simulado, quantidade por domínio);
   - textos fixos do `index.html` (por exemplo, "65 questões", "20 questões");
   - a tabela e as frases do `README.md` (seções "Funcionalidades" e "Banco de questões").

   Para achar as cópias, procure os números antigos: total do banco, tamanho do simulado completo e do rápido, e as proporções. Por exemplo, com banco de 130, completo de 65 e rápido de 20:
   ```bash
   grep -rnE "\b(130|65|20)\b|16/19/22/8|5/6/7/2|31/39/44/16" index.html README.md tests/ js/app.js .claude/skills/
   ```
   Confira cada resultado; alguns números iguais não têm relação (por exemplo, tamanhos em px).
   Os textos que o `app.js` monta a partir de `MODES` (como o do simulado rápido em "Continue estudando") se atualizam sozinhos.
4. Rode a skill `test-and-verify`. O mínimo é `node tests/validate-questions.mjs`, que precisa terminar com "OK"; o E2E confirma o sorteio.

## Checklist de qualidade (para cada questão)

- [ ] Existe **uma** resposta defensável (ou exatamente as N pedidas) segundo a documentação atual da AWS e o guia do exame CLF-C02.
- [ ] Os distratores são plausíveis e estão errados por um motivo que a explicação diz.
- [ ] O cenário não entrega a resposta (por exemplo, não cita o nome do serviço correto).
- [ ] Nada desatualizado: serviços renomeados ou descontinuados, preços, planos.
- [ ] O tema (`s`) é o serviço ou assunto central.

## Pontos de atenção conhecidos

- **Validade:** `f12` e `f13` (planos de suporte) dependem de ofertas que a AWS muda às vezes. Revise se o usuário perguntar sobre validade, ou ao mexer em faturamento.
- **Mudanças de interface não alteram o banco.** Se, durante outra tarefa, você achar uma inconsistência no banco, **reporte antes de mexer**.

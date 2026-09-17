# Compass

Product Experience Intelligence para agentes de IA.

O Compass ajuda agentes de IA a raciocinar sobre intenção do produto, arquitetura de UX, hierarquia de atenção, fricção, confiança, conversão e decisões de interfaces Web antes de escrever código de UI. O repositório também contém a skill complementar `compass-interface`, voltada para design visual, CSS, responsividade e implementação frontend.

[English](README.md)

## O que o Compass faz

É uma Agent Skill portátil para sites, SaaS, ecommerce, marketplaces, dashboards, portais, backoffice e Web responsiva. Ajuda o agente a definir intenção primária, ação dominante, informação necessária, hierarquia de atenção, progressive disclosure, acessibilidade, performance e consistência com o design system. Também ensina a extrair princípios de produtos maduros da internet — como busca, marketplace, conhecimento, pagamentos e colaboração — sem copiar layouts.

## O que não é

Não é tema visual, biblioteca de componentes, framework CSS, prompt de “deixar mais bonito”, gerador de templates de landing page nem substituto de pesquisa com usuários.

## Skill complementar

Use `compass` para decisões de produto e UX. Use `compass-interface` quando essas decisões precisarem virar sistema visual ou implementação frontend: tokens, tipografia, layout, responsividade, estados de componentes, arquitetura CSS, acessibilidade e revisão visual. A skill complementar está em [compass-interface](compass-interface/SKILL.md).

Ela inclui decisões de composição e identidade, diagnóstico prático de CSS, formulários, busca, tabelas, diálogos e estados de erro. As lições de Google, eBay, GitHub Primer e IBM Carbon têm fontes e limites de aplicação. O agente carrega as referências conforme a tarefa e informa o que conseguiu verificar.

## Uso no Hermes

Instale as duas skills em pastas irmãs, cada uma com seu `SKILL.md` e `references/`. O [guia do Hermes](docs/hermes.md) explica instalação, atualização e conferência. Os comandos seguem a documentação oficial; a execução no Hermes ainda precisa ser verificada nessa instalação.

```text
/compass-interface Melhore o design desta página, mantendo a marca e validando CSS, responsividade e estados.
```

Para trabalhar produto e interface juntos, em versões com suporte à combinação de comandos:

```text
/compass /compass-interface Analise as prioridades desta página e implemente uma interface coerente com elas.
```

## Por que existe

Agentes de código frequentemente começam por padrões visuais antes de entender o produto. O Compass inverte a ordem:

```text
Entender → Priorizar → Estruturar → Projetar → Implementar → Validar
```

Simplicidade não é ausência de informação; é ausência de competição desnecessária pela atenção. Cada pixel precisa pagar aluguel.

## Início rápido

Escolha o runtime em [docs/installation.md](docs/installation.md). Mantenha sempre `SKILL.md` e `references/` juntos. A documentação detalhada permanece em inglês nesta primeira versão para reduzir drift entre runtimes.

## Uso

```text
Use o Compass para auditar esta página de produto antes de alterar o código.
```

```text
Use o Compass para reorganizar este dashboard em torno das decisões que os usuários precisam tomar.
```

# Compass

Product Experience Intelligence para agentes de IA.

O Compass ajuda agentes de IA a raciocinar sobre intenção do produto, arquitetura de UX, hierarquia de atenção, fricção, confiança, conversão e decisões de interfaces Web antes de escrever código de UI. O repositório também contém duas camadas complementares: `compass-interface`, para decisões visuais e de interface, e `compass-components`, para padrões reutilizáveis de implementação.

[English](README.md)

## O que o Compass faz

É uma Agent Skill portátil para sites, SaaS, ecommerce, marketplaces, dashboards, portais, backoffice e Web responsiva. Ajuda o agente a definir intenção primária, ação dominante, informação necessária, hierarquia de atenção, progressive disclosure, acessibilidade, performance e consistência com o design system. Também ensina a extrair princípios de produtos maduros da internet — como busca, marketplace, conhecimento, pagamentos e colaboração — sem copiar layouts.

## O que não é

O Compass Core não é tema visual, biblioteca de componentes, framework CSS, prompt de “deixar mais bonito”, gerador de templates de landing page nem substituto de pesquisa com usuários. `compass-components` é um catálogo complementar e separado; o Core continua não sendo uma biblioteca de componentes.

## Skill complementar

Use `compass` para decisões de produto e UX. Use `compass-interface` para expressão visual e comportamento frontend. Use `compass-components` depois que a necessidade e a direção de interface estiverem claras, para selecionar e adaptar um padrão reutilizável. Cada camada é uma skill independente.

```text
Compass → Decisões de produto
Compass Interface → Decisões visuais e de interface
Compass Components → Padrões reutilizáveis de implementação
```

A skill de interface está em [compass-interface](compass-interface/SKILL.md); a skill de componentes, orientação do catálogo e registry legível por máquina estão em [compass-components](compass-components/SKILL.md).

## Catálogo de componentes

O [Compass Components Catalog](catalog/README.md) é uma interface web estática para explorar o registry, ler a orientação dos componentes, testar previews das referências estáveis e consultar o código-fonte. Ele consome o bundle `compass-components` diretamente, que continua sendo a fonte de verdade.

Ela inclui decisões de composição e identidade, diagnóstico prático de CSS, formulários, busca, tabelas, diálogos e estados de erro. As lições de Google, eBay, GitHub Primer e IBM Carbon têm fontes e limites de aplicação. O agente carrega as referências conforme a tarefa e informa o que conseguiu verificar.

## Uso no Hermes

Instale cada skill desejada em sua própria pasta, preservando seu `SKILL.md` e arquivos de suporte. O [guia do Hermes](docs/hermes.md) explica instalação, atualização e conferência. Os comandos seguem a documentação oficial; a execução no Hermes ainda precisa ser verificada nessa instalação.

```text
/compass-interface Melhore o design desta página, mantendo a marca e validando CSS, responsividade e estados.
```

Para trabalhar produto e interface juntos, em versões com suporte à combinação de comandos:

```text
/compass /compass-interface Analise as prioridades desta página e implemente uma interface coerente com elas.
```

Para adaptar um padrão reutilizável depois dessas decisões, use também `compass-components`.

## Por que existe

Agentes de código frequentemente começam por padrões visuais antes de entender o produto. O Compass inverte a ordem:

```text
Entender → Priorizar → Estruturar → Projetar → Implementar → Validar
```

Simplicidade não é ausência de informação; é ausência de competição desnecessária pela atenção. Cada pixel precisa pagar aluguel.

## Início rápido

Escolha o runtime em [docs/installation.md](docs/installation.md). Mantenha juntos o `SKILL.md` e os arquivos de suporte de cada skill. A documentação detalhada permanece em inglês nesta primeira versão para reduzir drift entre runtimes.

## Uso

```text
Use o Compass para auditar esta página de produto antes de alterar o código.
```

```text
Use o Compass para reorganizar este dashboard em torno das decisões que os usuários precisam tomar.
```

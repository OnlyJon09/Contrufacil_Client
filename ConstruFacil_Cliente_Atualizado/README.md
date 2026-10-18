# ConstruFácil_Cliente — Protótipo Front-end

Protótipo acadêmico atualizado com base nas telas de referência enviadas pelo grupo.

## Como abrir
1. Extraia o ZIP.
2. Abra a pasta `ConstruFacil_Cliente_Atualizado` no Visual Studio Code.
3. Abra `index.html` no navegador. Para desenvolvimento, use a extensão **Live Server** e clique em **Go Live**.
4. Entre com um e-mail válido e senha com pelo menos 4 caracteres, ou use a opção de criar conta.

## Telas
- Login e cadastro demonstrativos
- Página inicial com banner visual e atalhos
- Tipos de serviço: Pintura, Elétrica, Hidráulica, Alvenaria, Marcenaria, Marmoraria, Reboco, Drywall e Forro, Revestimento
- Busca demonstrativa de prestadores
- Solicitação de orçamento
- Registro de preferência de agendamento
- Histórico local de solicitações e agendamentos
- Sobre nós e mensagens/suporte

## Tecnologias
- HTML5, CSS3 e JavaScript
- Layout responsivo, Flexbox, Grid e media queries
- `assets/hero-sala.jpg`: recorte da imagem residencial enviada como referência visual

## Limitações importantes
Este pacote é somente o **front-end demonstrativo**. Os dados de conta e solicitações são salvos localmente no navegador. Não há autenticação segura, API conectada, envio real de orçamento, confirmação de disponibilidade, pagamento nem persistência no PostgreSQL. Os prestadores exibidos são exemplos fictícios.

A arquitetura prevista no PI utiliza Python/FastAPI no back-end e PostgreSQL no banco de dados. Essa integração precisa ser desenvolvida e testada separadamente.

## Evidências para a documentação do PI
Após abrir e testar o projeto, capture as telas de login, cadastro, home, tipos de serviço, busca de prestadores, orçamento, agendamento e histórico. Descreva esta versão como protótipo front-end.

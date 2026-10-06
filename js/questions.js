/*
 * Banco de questões do simulado CLF-C02 (130 questões ORIGINAIS, no estilo de cenário da prova).
 * Campos: id, d (domínio), q (enunciado), o (alternativas), a (índices corretos),
 * e (explicação: por que a correta está certa e por que os distratores não servem), s (serviço/tema).
 * Questões com mais de um índice em "a" são de múltipla resposta e o enunciado diz "(Escolha N)".
 * Nunca copie questões de dumps ou da prova real: escreva questões novas.
 */
const DOMAINS = {
  conceitos: { name: 'Conceitos de nuvem', weight: 24 },
  seguranca: { name: 'Segurança e conformidade', weight: 30 },
  tecnologia: { name: 'Tecnologia e serviços', weight: 34 },
  faturamento: { name: 'Faturamento, preços e suporte', weight: 12 }
};

const QUESTIONS = [
  // ---------- Domínio 1: Conceitos de nuvem (31) ----------
  {
    id: 'c01', d: 'conceitos',
    q: 'Uma startup precisa lançar seu produto, mas não tem capital para comprar servidores e equipamentos de rede antes de saber se o produto terá clientes. Qual vantagem da Nuvem AWS atende diretamente a essa necessidade?',
    o: ['Beneficiar-se de grandes economias de escala', 'Trocar despesas de capital por despesas variáveis', 'Tornar-se global em minutos', 'Parar de gastar dinheiro com a operação de data centers'],
    a: [1],
    e: 'O problema é o investimento inicial (CapEx). Na nuvem a startup paga apenas pelo que consumir (despesa variável). Economias de escala explicam preços menores, não a ausência de investimento inicial, e "global em minutos" trata de alcance geográfico.',
    s: 'Vantagens da nuvem'
  },
  {
    id: 'c02', d: 'conceitos',
    q: 'Um varejista on-line comprava servidores extras todo ano para aguentar a Black Friday, e eles ficavam ociosos nos outros 11 meses. Depois de migrar para a AWS, passou a usar capacidade extra só durante o pico. Qual vantagem da nuvem isso demonstra?',
    o: ['Parar de adivinhar a capacidade', 'Aumentar a velocidade e a agilidade', 'Tornar-se global em minutos', 'Beneficiar-se de grandes economias de escala'],
    a: [0],
    e: 'Em vez de prever (e superdimensionar) a capacidade, a empresa provisiona conforme a demanda real e libera os recursos depois. Agilidade trata de rapidez para experimentar, não de dimensionamento.',
    s: 'Vantagens da nuvem'
  },
  {
    id: 'c03', d: 'conceitos',
    q: 'Um cliente pergunta por que a AWS reduziu os preços de vários serviços diversas vezes desde o lançamento. Qual é a explicação MAIS adequada?',
    o: ['A AWS cobra taxas anuais de manutenção dos clientes', 'O uso agregado de centenas de milhares de clientes gera economias de escala', 'Os clientes são obrigados a assinar contratos de três anos', 'A AWS limita a quantidade de recursos que cada cliente pode usar'],
    a: [1],
    e: 'Com o uso combinado de muitos clientes, a AWS compra e opera infraestrutura com mais eficiência e repassa parte disso em preços menores. Não há taxa de manutenção nem contrato obrigatório.',
    s: 'Vantagens da nuvem'
  },
  {
    id: 'c04', d: 'conceitos',
    q: 'Uma empresa brasileira de jogos quer lançar o mesmo serviço para jogadores no Japão e na Alemanha na próxima semana, com baixa latência, sem construir data centers nesses países. Qual vantagem da nuvem permite isso?',
    o: ['Trocar despesas de capital por despesas variáveis', 'Parar de adivinhar a capacidade', 'Tornar-se global em minutos', 'Parar de gastar dinheiro com a operação de data centers'],
    a: [2],
    e: 'A infraestrutura global da AWS permite implantar a aplicação em outras Regiões em minutos, perto dos usuários finais. As outras opções não tratam de alcance geográfico.',
    s: 'Vantagens da nuvem'
  },
  {
    id: 'c05', d: 'conceitos',
    q: 'Antes da nuvem, os desenvolvedores de uma empresa esperavam semanas por um servidor de testes. Agora eles criam ambientes em minutos, testam uma ideia e apagam tudo se ela não der certo. Qual vantagem da nuvem isso representa?',
    o: ['Aumentar a velocidade e a agilidade', 'Beneficiar-se de grandes economias de escala', 'Tornar-se global em minutos', 'Trocar despesas variáveis por despesas de capital'],
    a: [0],
    e: 'Obter recursos em minutos reduz o custo e o tempo de experimentar, o que aumenta a agilidade da organização. A última alternativa inverte a vantagem real (CapEx para OpEx).',
    s: 'Vantagens da nuvem'
  },
  {
    id: 'c06', d: 'conceitos',
    q: 'O diretor de TI de um hospital quer que a equipe pare de cuidar de energia, refrigeração e troca de discos e passe a focar em projetos para os pacientes. Qual vantagem da nuvem atende a esse objetivo?',
    o: ['Tornar-se global em minutos', 'Parar de gastar dinheiro com a operação e manutenção de data centers', 'Parar de adivinhar a capacidade', 'Beneficiar-se de grandes economias de escala'],
    a: [1],
    e: 'Na nuvem, o "trabalho pesado indiferenciado" de manter data centers fica com a AWS, e a equipe pode focar no que diferencia o negócio.',
    s: 'Vantagens da nuvem'
  },
  {
    id: 'c07', d: 'conceitos',
    q: 'Um serviço de streaming tem pouco acesso de manhã e muito acesso à noite. A empresa quer que os recursos aumentem e diminuam automaticamente para acompanhar a demanda, sem pagar por capacidade ociosa. Qual característica da nuvem descreve isso?',
    o: ['Alta disponibilidade', 'Tolerância a falhas', 'Elasticidade', 'Durabilidade'],
    a: [2],
    e: 'Elasticidade é provisionar e liberar recursos automaticamente conforme a demanda. Alta disponibilidade e tolerância a falhas tratam de continuar funcionando quando algo falha; durabilidade trata de não perder dados.',
    s: 'Elasticidade'
  },
  {
    id: 'c08', d: 'conceitos',
    q: 'Um banco precisa manter o sistema de mainframe em seu próprio data center por exigência regulatória, mas quer usar a AWS para análise de dados, conectando os dois ambientes. Qual modelo de implantação ele está usando?',
    o: ['Nuvem pública (cloud-native)', 'On-premises (nuvem privada)', 'Híbrido', 'Multi-Region'],
    a: [2],
    e: 'O modelo híbrido conecta infraestrutura local a recursos na nuvem. Multi-Region é uma estratégia de arquitetura dentro da nuvem, não um modelo de implantação.',
    s: 'Modelos de implantação'
  },
  {
    id: 'c09', d: 'conceitos',
    q: 'Uma equipe quer apenas enviar o código da aplicação web, sem gerenciar sistema operacional, patches ou servidores. Qual modelo de serviço de nuvem atende melhor a esse requisito?',
    o: ['Infraestrutura como serviço (IaaS)', 'Plataforma como serviço (PaaS)', 'Software como serviço (SaaS)', 'Infraestrutura on-premises'],
    a: [1],
    e: 'No PaaS (por exemplo, AWS Elastic Beanstalk) o provedor cuida da plataforma e a equipe gerencia só a aplicação. No IaaS a equipe ainda gerencia o SO; no SaaS ela usa um software pronto, sem enviar código próprio.',
    s: 'Modelos de serviço'
  },
  {
    id: 'c10', d: 'conceitos',
    q: 'Uma empresa usa um sistema de e-mail corporativo acessado pelo navegador. Ela não gerencia servidores, sistema operacional nem a aplicação, apenas os usuários e as configurações. Qual modelo de serviço é esse?',
    o: ['IaaS', 'PaaS', 'SaaS', 'FaaS'],
    a: [2],
    e: 'No SaaS o cliente consome um software completo gerenciado pelo provedor. No PaaS e no IaaS o cliente ainda desenvolve ou gerencia partes da solução.',
    s: 'Modelos de serviço'
  },
  {
    id: 'c11', d: 'conceitos',
    q: 'Uma empresa quer que sua aplicação se recupere automaticamente de falhas de infraestrutura e testa regularmente seus procedimentos de recuperação. Qual pilar do AWS Well-Architected Framework trata desses objetivos?',
    o: ['Excelência operacional', 'Confiabilidade', 'Eficiência de performance', 'Segurança'],
    a: [1],
    e: 'O pilar Confiabilidade inclui recuperar-se automaticamente de falhas, testar a recuperação e escalar horizontalmente. Excelência operacional foca em executar e monitorar operações e melhorar processos.',
    s: 'Well-Architected'
  },
  {
    id: 'c12', d: 'conceitos',
    q: 'Uma equipe quer executar operações como código, fazer mudanças pequenas e reversíveis com frequência e aprender com cada falha operacional. Qual pilar do Well-Architected Framework descreve essas práticas?',
    o: ['Excelência operacional', 'Confiabilidade', 'Otimização de custos', 'Sustentabilidade'],
    a: [0],
    e: 'Esses são princípios de design do pilar Excelência operacional. Confiabilidade foca em resistir e se recuperar de falhas, não em como a equipe opera e evolui o sistema.',
    s: 'Well-Architected'
  },
  {
    id: 'c13', d: 'conceitos',
    q: 'Um arquiteto quer aplicar segurança em todas as camadas, ativar rastreabilidade de ações e proteger dados em trânsito e em repouso. Qual pilar do Well-Architected Framework orienta essas decisões?',
    o: ['Confiabilidade', 'Segurança', 'Excelência operacional', 'Eficiência de performance'],
    a: [1],
    e: 'Esses são princípios do pilar Segurança: base de identidade forte, rastreabilidade, segurança em todas as camadas e proteção de dados.',
    s: 'Well-Architected'
  },
  {
    id: 'c14', d: 'conceitos',
    q: 'Uma empresa quer usar arquiteturas serverless, experimentar com mais frequência e escolher o tipo de recurso mais adequado para cada carga de trabalho, para usar a computação de forma eficiente. Qual pilar do Well-Architected Framework trata disso?',
    o: ['Eficiência de performance', 'Otimização de custos', 'Confiabilidade', 'Excelência operacional'],
    a: [0],
    e: 'Eficiência de performance trata de usar os recursos de forma eficiente, incluindo tecnologias avançadas como serviço, serverless e experimentação. Otimização de custos foca em evitar gastos desnecessários.',
    s: 'Well-Architected'
  },
  {
    id: 'c15', d: 'conceitos',
    q: 'Um gerente financeiro quer adotar um modelo de consumo, medir a eficiência dos gastos e atribuir custos a cada equipe. Qual pilar do Well-Architected Framework trata desses objetivos?',
    o: ['Sustentabilidade', 'Otimização de custos', 'Excelência operacional', 'Eficiência de performance'],
    a: [1],
    e: 'O pilar Otimização de custos inclui adotar um modelo de consumo, medir a eficiência geral e analisar e atribuir os gastos.',
    s: 'Well-Architected'
  },
  {
    id: 'c16', d: 'conceitos',
    q: 'Uma empresa definiu a meta de reduzir o impacto ambiental das suas cargas de trabalho, maximizando a utilização dos recursos e preferindo serviços gerenciados. Qual pilar do Well-Architected Framework está relacionado a essa meta?',
    o: ['Otimização de custos', 'Eficiência de performance', 'Sustentabilidade', 'Confiabilidade'],
    a: [2],
    e: 'Sustentabilidade é o sexto pilar e foca em minimizar os impactos ambientais. Reduzir recursos ociosos também economiza dinheiro, mas o objetivo descrito é ambiental.',
    s: 'Well-Architected'
  },
  {
    id: 'c17', d: 'conceitos',
    q: 'Quais são princípios gerais de design do AWS Well-Architected Framework? (Escolha 2)',
    o: ['Parar de adivinhar as necessidades de capacidade', 'Testar sistemas em escala de produção', 'Fazer mudanças grandes e pouco frequentes', 'Provisionar sempre para o pico de uso', 'Tomar decisões de arquitetura uma única vez, no início do projeto'],
    a: [0, 1],
    e: 'Na nuvem é possível escalar sob demanda e criar ambientes de teste do tamanho da produção por pouco tempo. O framework recomenda mudanças pequenas e frequentes e arquiteturas que evoluem.',
    s: 'Well-Architected'
  },
  {
    id: 'c18', d: 'conceitos',
    q: 'Uma aplicação web roda em uma única instância EC2 grande e guarda filas de pedidos na memória dessa instância. Quais mudanças aumentam a resiliência da aplicação? (Escolha 2)',
    o: ['Desacoplar os componentes usando uma fila gerenciada, como o Amazon SQS', 'Distribuir as instâncias em várias Zonas de Disponibilidade', 'Trocar a instância por outra ainda maior', 'Guardar as sessões dos usuários no disco local da instância', 'Desativar as verificações de integridade para evitar reinicializações'],
    a: [0, 1],
    e: 'Fracamente acoplado e em várias AZs, o sistema continua funcionando quando um componente ou um data center falha. Uma instância maior continua sendo um ponto único de falha.',
    s: 'Princípios de design'
  },
  {
    id: 'c19', d: 'conceitos',
    q: 'Durante a adoção da nuvem, uma empresa percebe que precisa de um programa de capacitação, mudanças na estrutura das equipes e apoio da liderança. Qual perspectiva do AWS Cloud Adoption Framework (AWS CAF) trata disso?',
    o: ['Negócios', 'Pessoas', 'Governança', 'Operações'],
    a: [1],
    e: 'A perspectiva Pessoas faz a ponte entre tecnologia e negócios, cuidando de cultura, estrutura organizacional, liderança e habilidades.',
    s: 'AWS CAF'
  },
  {
    id: 'c20', d: 'conceitos',
    q: 'Uma empresa quer orquestrar suas iniciativas de nuvem maximizando os benefícios, controlando os gastos e minimizando os riscos de transformação. Qual perspectiva do AWS CAF é responsável por isso?',
    o: ['Plataforma', 'Segurança', 'Governança', 'Pessoas'],
    a: [2],
    e: 'A perspectiva Governança inclui gestão de programas e projetos, gestão financeira da nuvem e gestão de riscos.',
    s: 'AWS CAF'
  },
  {
    id: 'c21', d: 'conceitos',
    q: 'Qual perspectiva do AWS CAF se concentra em construir uma plataforma de nuvem híbrida escalável e corporativa, incluindo arquitetura, provisionamento de infraestrutura e engenharia de dados?',
    o: ['Plataforma', 'Operações', 'Negócios', 'Governança'],
    a: [0],
    e: 'A perspectiva Plataforma reúne as capacidades técnicas de arquitetura e engenharia. Operações foca em manter os serviços funcionando no nível acordado.',
    s: 'AWS CAF'
  },
  {
    id: 'c22', d: 'conceitos',
    q: 'Uma empresa quer garantir que seus serviços em nuvem sejam entregues no nível acordado com o negócio, com monitoramento, gestão de incidentes e gestão de mudanças. Qual perspectiva do AWS CAF trata disso?',
    o: ['Segurança', 'Operações', 'Plataforma', 'Pessoas'],
    a: [1],
    e: 'A perspectiva Operações cuida de observabilidade, gestão de incidentes e problemas, mudanças e desempenho.',
    s: 'AWS CAF'
  },
  {
    id: 'c23', d: 'conceitos',
    q: 'Quais são benefícios de negócio que o AWS Cloud Adoption Framework (AWS CAF) ajuda a alcançar? (Escolha 2)',
    o: ['Redução do risco de negócios', 'Aumento de receita', 'Eliminação da responsabilidade do cliente sobre seus dados', 'Garantia de preços fixos por dez anos', 'Dispensa da necessidade de controles de segurança'],
    a: [0, 1],
    e: 'O AWS CAF aponta quatro resultados de negócio: menor risco de negócios, melhor desempenho ESG, aumento de receita e maior eficiência operacional. O cliente continua responsável pelos seus dados e pela segurança na nuvem.',
    s: 'AWS CAF'
  },
  {
    id: 'c24', d: 'conceitos',
    q: 'Uma empresa precisa sair do data center em 60 dias porque o contrato vai acabar. Ela quer mover as aplicações para instâncias EC2 sem alterar o código. Qual estratégia de migração é a MAIS adequada?',
    o: ['Refactor (refatorar)', 'Rehost (lift and shift)', 'Repurchase (recomprar)', 'Retain (manter)'],
    a: [1],
    e: 'Rehost move as aplicações como estão e é a estratégia mais rápida para prazos curtos. Refactor exige reescrever a aplicação, e Retain mantém tudo no data center.',
    s: 'Estratégias de migração'
  },
  {
    id: 'c25', d: 'conceitos',
    q: 'Na migração, uma equipe troca o banco de dados MySQL instalado em um servidor próprio pelo Amazon RDS, sem mudar a arquitetura da aplicação. Qual estratégia de migração foi usada?',
    o: ['Rehost', 'Replatform', 'Refactor', 'Relocate'],
    a: [1],
    e: 'Replatform ("lift, tinker and shift") faz algumas otimizações, como adotar um serviço gerenciado, sem mudar a arquitetura principal. Rehost não mudaria nada; Refactor redesenharia a aplicação.',
    s: 'Estratégias de migração'
  },
  {
    id: 'c26', d: 'conceitos',
    q: 'Uma empresa quer transformar sua aplicação monolítica em microsserviços com AWS Lambda e Amazon DynamoDB para ganhar agilidade e escalabilidade. Qual estratégia de migração é essa?',
    o: ['Rehost', 'Replatform', 'Refactor (rearquitetar)', 'Retire'],
    a: [2],
    e: 'Refactor reimagina a arquitetura usando recursos nativos da nuvem. É a estratégia mais trabalhosa, mas a que traz mais benefícios a longo prazo.',
    s: 'Estratégias de migração'
  },
  {
    id: 'c27', d: 'conceitos',
    q: 'Durante a migração, uma empresa decide abandonar o sistema de CRM que ela mesma mantinha e passar a usar um CRM vendido como SaaS. Qual estratégia de migração é essa?',
    o: ['Repurchase (recomprar)', 'Rehost', 'Retain', 'Replatform'],
    a: [0],
    e: 'Repurchase (ou "drop and shop") troca a aplicação por um produto diferente, geralmente SaaS.',
    s: 'Estratégias de migração'
  },
  {
    id: 'c28', d: 'conceitos',
    q: 'Ao analisar o portfólio antes da migração, uma empresa descobre que 15% das aplicações não são usadas por ninguém há mais de um ano. O que ela deve fazer com essas aplicações?',
    o: ['Rehost, para movê-las rapidamente', 'Retire, desligando-as', 'Retain, mantendo-as on-premises', 'Refactor, para modernizá-las'],
    a: [1],
    e: 'Retire desativa aplicações que não são mais necessárias, reduzindo o escopo, o custo e a superfície de ataque da migração.',
    s: 'Estratégias de migração'
  },
  {
    id: 'c29', d: 'conceitos',
    q: 'Uma mineradora precisa enviar 80 TB de dados de um local remoto com internet lenta e instável para o Amazon S3. Qual é a forma MAIS rápida e prática de transferir esses dados?',
    o: ['AWS DataSync pela internet', 'AWS Snowball Edge', 'AWS Direct Connect', 'Amazon S3 Transfer Acceleration'],
    a: [1],
    e: 'Os dispositivos da família AWS Snow transportam os dados fisicamente, o que é ideal com pouca largura de banda. DataSync e Transfer Acceleration dependem da rede, e Direct Connect leva semanas para ser instalado.',
    s: 'AWS Snow Family'
  },
  {
    id: 'c30', d: 'conceitos',
    q: 'Uma empresa quer migrar um banco de dados Oracle on-premises para o Amazon Aurora PostgreSQL com o mínimo de indisponibilidade, mantendo o banco de origem funcionando durante a migração. Qual serviço deve usar?',
    o: ['AWS Database Migration Service (AWS DMS)', 'AWS Application Migration Service', 'AWS Snowball', 'AWS DataSync'],
    a: [0],
    e: 'O AWS DMS migra bancos de dados com replicação contínua, inclusive entre motores diferentes (com o AWS Schema Conversion Tool). O Application Migration Service faz rehost de servidores inteiros.',
    s: 'AWS DMS'
  },
  {
    id: 'c31', d: 'conceitos',
    q: 'Ao montar um estudo de custo total de propriedade (TCO), quais custos uma empresa normalmente REDUZ ao migrar para a AWS? (Escolha 2)',
    o: ['Compra e manutenção de hardware de servidores', 'Energia e refrigeração do data center', 'Desenvolvimento das regras de negócio da aplicação', 'Responsabilidade por proteger os próprios dados', 'Campanhas de marketing do produto'],
    a: [0, 1],
    e: 'Hardware, energia, refrigeração e espaço físico passam a ser responsabilidade da AWS. O código da aplicação e a proteção dos dados continuam com o cliente.',
    s: 'Economia da nuvem'
  },
  // ---------- Domínio 2: Segurança e conformidade (39) ----------
  {
    id: 's01', d: 'seguranca',
    q: 'Uma empresa executa sua aplicação em instâncias Amazon EC2. De acordo com o modelo de responsabilidade compartilhada, qual tarefa é de responsabilidade da empresa?',
    o: ['Manter o hardware dos hosts físicos', 'Aplicar patches de segurança no sistema operacional convidado', 'Proteger fisicamente as instalações do data center', 'Manter a infraestrutura de virtualização'],
    a: [1],
    e: 'No EC2 o cliente gerencia o sistema operacional convidado, as aplicações, os dados e os security groups. Hardware, instalações e camada de virtualização são da AWS (segurança DA nuvem).',
    s: 'Responsabilidade compartilhada'
  },
  {
    id: 's02', d: 'seguranca',
    q: 'Segundo o modelo de responsabilidade compartilhada, qual destas responsabilidades é SEMPRE da AWS, independentemente do serviço usado?',
    o: ['Configurar as permissões do IAM', 'Classificar e criptografar os dados do cliente', 'Segurança física das instalações e do hardware', 'Configurar as regras dos security groups'],
    a: [2],
    e: 'A AWS sempre cuida da infraestrutura física (segurança DA nuvem). Identidades, dados e configurações de rede ficam com o cliente (segurança NA nuvem).',
    s: 'Responsabilidade compartilhada'
  },
  {
    id: 's03', d: 'seguranca',
    q: 'Uma empresa migrou seu banco de dados para o Amazon RDS. Quem é responsável por aplicar os patches no sistema operacional do servidor que hospeda o banco?',
    o: ['A empresa cliente', 'A AWS', 'O fornecedor do motor de banco de dados', 'A responsabilidade é dividida igualmente'],
    a: [1],
    e: 'Em serviços gerenciados como o RDS, a AWS cuida do SO e dos patches do motor (na janela de manutenção definida pelo cliente). O cliente cuida dos dados, dos usuários do banco e das regras de acesso.',
    s: 'Responsabilidade compartilhada'
  },
  {
    id: 's04', d: 'seguranca',
    q: 'Uma equipe usa AWS Lambda para processar pedidos. Qual item é responsabilidade da equipe, segundo o modelo de responsabilidade compartilhada?',
    o: ['Aplicar patches no sistema operacional que executa as funções', 'O código da função e as permissões do IAM concedidas a ela', 'Escalar os servidores que executam as funções', 'Manter o hardware usado pelo serviço'],
    a: [1],
    e: 'No Lambda a AWS gerencia servidores, SO, runtime gerenciado e escalabilidade. O cliente cuida do código, dos dados e das permissões da função.',
    s: 'Responsabilidade compartilhada'
  },
  {
    id: 's05', d: 'seguranca',
    q: 'No modelo de responsabilidade compartilhada, quais controles são COMPARTILHADOS entre a AWS e o cliente, cada um em seu próprio contexto? (Escolha 2)',
    o: ['Gerenciamento de patches', 'Gerenciamento de configuração', 'Segurança física dos data centers', 'Descarte seguro de mídias de armazenamento', 'Controles ambientais, como energia e refrigeração'],
    a: [0, 1],
    e: 'Patches, configuração e conscientização/treinamento são controles compartilhados: a AWS cuida da infraestrutura e o cliente dos seus sistemas. Segurança física, descarte de mídias e controles ambientais são só da AWS.',
    s: 'Responsabilidade compartilhada'
  },
  {
    id: 's06', d: 'seguranca',
    q: 'Qual destas tarefas exige obrigatoriamente o login com o usuário root da conta AWS?',
    o: ['Criar um usuário do IAM', 'Fechar a conta AWS', 'Criar um bucket no Amazon S3', 'Visualizar as métricas do Amazon CloudWatch'],
    a: [1],
    e: 'Algumas tarefas, como fechar a conta e alterar certas configurações da conta, só podem ser feitas pelo root. As demais podem (e devem) ser feitas com identidades do IAM com as permissões certas.',
    s: 'Usuário root'
  },
  {
    id: 's07', d: 'seguranca',
    q: 'Uma empresa acabou de criar sua conta AWS. Quais são boas práticas para proteger o usuário root? (Escolha 2)',
    o: ['Ativar a autenticação multifator (MFA)', 'Não criar chaves de acesso para o usuário root', 'Usar o usuário root nas tarefas administrativas diárias', 'Compartilhar a senha do root com a equipe de operações', 'Criar chaves de acesso do root para scripts de automação'],
    a: [0, 1],
    e: 'O root tem acesso irrestrito: proteja-o com MFA, não crie chaves de acesso para ele e use identidades do IAM no dia a dia.',
    s: 'Usuário root'
  },
  {
    id: 's08', d: 'seguranca',
    q: 'Um estagiário precisa apenas baixar relatórios de um bucket S3 específico. Qual abordagem segue o princípio do privilégio mínimo?',
    o: ['Anexar a política AmazonS3FullAccess ao usuário', 'Criar uma política que permita somente s3:GetObject nesse bucket', 'Adicionar o estagiário ao grupo de administradores temporariamente', 'Compartilhar as credenciais de um usuário que já tem acesso'],
    a: [1],
    e: 'Privilégio mínimo é conceder só as ações e os recursos necessários. Acesso total ao S3 ou de administrador vai muito além da tarefa, e credenciais nunca devem ser compartilhadas.',
    s: 'AWS IAM'
  },
  {
    id: 's09', d: 'seguranca',
    q: 'Uma aplicação em instâncias EC2 precisa gravar arquivos em um bucket S3. Qual é a forma MAIS segura de fornecer as credenciais?',
    o: ['Salvar a access key de um usuário do IAM em um arquivo de configuração', 'Anexar uma função (role) do IAM às instâncias', 'Usar as credenciais do usuário root', 'Colocar as chaves em variáveis de ambiente no código-fonte'],
    a: [1],
    e: 'Funções do IAM fornecem credenciais temporárias que são trocadas automaticamente, sem chaves de longa duração na instância ou no código.',
    s: 'AWS IAM'
  },
  {
    id: 's10', d: 'seguranca',
    q: 'Trinta desenvolvedores precisam das mesmas permissões, que mudam com frequência. Qual é a forma MAIS eficiente de gerenciá-las?',
    o: ['Anexar a política a cada usuário individualmente', 'Criar um grupo do IAM, anexar a política ao grupo e adicionar os usuários', 'Criar uma conta AWS separada para cada desenvolvedor', 'Usar um único usuário compartilhado por todos'],
    a: [1],
    e: 'Com grupos, basta alterar a política uma vez para atualizar todos os membros. Usuários compartilhados impedem a rastreabilidade de quem fez o quê.',
    s: 'AWS IAM'
  },
  {
    id: 's11', d: 'seguranca',
    q: 'Os funcionários de uma empresa já fazem login com as credenciais do Active Directory corporativo e precisam acessar várias contas AWS com login único (SSO). Qual serviço atende a esse requisito?',
    o: ['Amazon Cognito', 'AWS IAM Identity Center', 'AWS Secrets Manager', 'Um usuário do IAM em cada conta para cada funcionário'],
    a: [1],
    e: 'O IAM Identity Center (sucessor do AWS SSO) centraliza o acesso da força de trabalho a várias contas e se integra a provedores de identidade como o Active Directory. O Cognito é voltado a usuários finais de aplicações.',
    s: 'AWS IAM Identity Center'
  },
  {
    id: 's12', d: 'seguranca',
    q: 'Um aplicativo móvel precisa de cadastro e login para milhões de clientes, incluindo login com Google e Facebook. Qual serviço atende com o MENOR esforço de desenvolvimento?',
    o: ['AWS IAM, criando um usuário para cada cliente', 'Amazon Cognito', 'AWS IAM Identity Center', 'AWS Directory Service'],
    a: [1],
    e: 'O Amazon Cognito oferece cadastro, login e federação com provedores sociais para usuários de aplicações web e móveis. Usuários do IAM são para quem administra a conta AWS.',
    s: 'Amazon Cognito'
  },
  {
    id: 's13', d: 'seguranca',
    q: 'Um desenvolvedor publicou por engano, em um repositório público, as access keys do seu usuário do IAM. Qual deve ser a PRIMEIRA ação?',
    o: ['Desativar e substituir (rotacionar) as chaves expostas imediatamente', 'Apagar o repositório e esperar para ver se houve uso indevido', 'Ativar MFA para o usuário', 'Abrir um chamado para a AWS investigar'],
    a: [0],
    e: 'Chaves expostas podem ser usadas em minutos. Desativá-las impede o uso; depois, investigue a atividade no CloudTrail. MFA não protege chamadas feitas com access keys.',
    s: 'AWS IAM'
  },
  {
    id: 's14', d: 'seguranca',
    q: 'Uma equipe de segurança quer identificar quais buckets S3 e funções do IAM da conta estão compartilhados com entidades externas à organização. Qual ferramenta é mais adequada?',
    o: ['IAM Access Analyzer', 'Amazon Inspector', 'AWS Artifact', 'Amazon Detective'],
    a: [0],
    e: 'O IAM Access Analyzer analisa políticas de recursos e aponta acessos concedidos a entidades externas. O Inspector busca vulnerabilidades de software e o Artifact fornece relatórios de conformidade.',
    s: 'IAM Access Analyzer'
  },
  {
    id: 's15', d: 'seguranca',
    q: 'Uma empresa com dezenas de contas AWS quer impedir, de forma centralizada, que qualquer conta use Regiões fora do Brasil, inclusive os administradores dessas contas. O que deve usar?',
    o: ['Políticas de controle de serviço (SCPs) no AWS Organizations', 'Políticas do IAM anexadas aos usuários de cada conta', 'Security groups', 'Tags de alocação de custos'],
    a: [0],
    e: 'SCPs definem o máximo de permissões disponíveis nas contas da organização e valem até para administradores. Políticas do IAM em cada conta poderiam ser alteradas pelos administradores locais.',
    s: 'AWS Organizations'
  },
  {
    id: 's16', d: 'seguranca',
    q: 'Uma empresa quer configurar rapidamente um ambiente com várias contas AWS seguindo boas práticas, com uma landing zone e controles (guardrails) aplicados automaticamente. Qual serviço atende a esse requisito?',
    o: ['AWS Control Tower', 'AWS Config', 'AWS Trusted Advisor', 'AWS CloudFormation'],
    a: [0],
    e: 'O AWS Control Tower automatiza a criação de uma landing zone multi-conta com guardrails preventivos e de detecção. Ele usa Organizations, Config e CloudFormation por baixo.',
    s: 'AWS Control Tower'
  },
  {
    id: 's17', d: 'seguranca',
    q: 'Uma pequena empresa quer proteção contra ataques DDoS comuns nas camadas de rede e transporte, sem custo adicional. Qual serviço atende?',
    o: ['AWS Shield Standard', 'AWS Shield Advanced', 'AWS WAF', 'Amazon GuardDuty'],
    a: [0],
    e: 'O AWS Shield Standard é ativado automaticamente para todos os clientes, sem custo extra. O Shield Advanced é pago e o AWS WAF é cobrado pelo uso.',
    s: 'AWS Shield'
  },
  {
    id: 's18', d: 'seguranca',
    q: 'Um site de apostas sofre ataques DDoS sofisticados e quer acesso 24/7 à equipe de resposta a DDoS da AWS e proteção contra aumentos na fatura causados pelos ataques. Qual serviço atende?',
    o: ['AWS Shield Standard', 'AWS Shield Advanced', 'Amazon Inspector', 'AWS Firewall Manager'],
    a: [1],
    e: 'O Shield Advanced inclui o AWS Shield Response Team (SRT), detecção avançada e proteção de custos relacionados a picos causados por DDoS.',
    s: 'AWS Shield'
  },
  {
    id: 's19', d: 'seguranca',
    q: 'Uma aplicação web atrás de um Application Load Balancer recebe tentativas de injeção de SQL e muitas requisições de poucos endereços IP. Qual serviço pode bloquear esse tráfego com regras?',
    o: ['AWS WAF', 'AWS Shield Standard', 'Network ACL', 'Amazon Macie'],
    a: [0],
    e: 'O AWS WAF inspeciona requisições HTTP(S) e tem regras gerenciadas contra injeção de SQL e XSS, além de regras de limite de taxa por IP. NACLs filtram IPs e portas, mas não entendem o conteúdo HTTP.',
    s: 'AWS WAF'
  },
  {
    id: 's20', d: 'seguranca',
    q: 'Uma empresa quer um serviço que monitore continuamente a conta em busca de atividades maliciosas, como instâncias se comunicando com IPs de mineração de criptomoedas, analisando logs automaticamente. Qual serviço atende?',
    o: ['Amazon GuardDuty', 'Amazon Inspector', 'AWS Config', 'Amazon Macie'],
    a: [0],
    e: 'O GuardDuty analisa logs do CloudTrail, VPC Flow Logs e DNS com inteligência de ameaças e machine learning. O Inspector procura vulnerabilidades de software, não comportamento malicioso.',
    s: 'Amazon GuardDuty'
  },
  {
    id: 's21', d: 'seguranca',
    q: 'A equipe de segurança precisa saber quais instâncias EC2 e imagens de container possuem bibliotecas com vulnerabilidades conhecidas (CVEs). Qual serviço faz isso automaticamente?',
    o: ['Amazon Inspector', 'Amazon GuardDuty', 'AWS Trusted Advisor', 'Amazon Detective'],
    a: [0],
    e: 'O Amazon Inspector faz varreduras contínuas de vulnerabilidades em EC2, imagens no Amazon ECR e funções Lambda.',
    s: 'Amazon Inspector'
  },
  {
    id: 's22', d: 'seguranca',
    q: 'Uma empresa precisa descobrir se há números de CPF e de cartão de crédito armazenados em milhares de objetos espalhados por vários buckets S3. Qual serviço deve usar?',
    o: ['Amazon Macie', 'Amazon GuardDuty', 'Amazon Rekognition', 'AWS Config'],
    a: [0],
    e: 'O Amazon Macie usa machine learning e padrões para descobrir e classificar dados sensíveis (PII, dados financeiros) no S3.',
    s: 'Amazon Macie'
  },
  {
    id: 's23', d: 'seguranca',
    q: 'Depois de receber um alerta do GuardDuty, um analista quer investigar a causa raiz, visualizando as relações entre usuários, IPs e recursos envolvidos ao longo do tempo. Qual serviço é mais adequado?',
    o: ['Amazon Detective', 'AWS Artifact', 'Amazon Inspector', 'AWS Trusted Advisor'],
    a: [0],
    e: 'O Amazon Detective organiza os dados de logs em gráficos de comportamento para facilitar a investigação de achados de segurança.',
    s: 'Amazon Detective'
  },
  {
    id: 's24', d: 'seguranca',
    q: 'Uma empresa usa GuardDuty, Inspector e Macie e quer um painel único com todos os achados, além de verificações automáticas contra padrões de boas práticas de segurança. Qual serviço atende?',
    o: ['AWS Security Hub', 'Amazon CloudWatch', 'AWS Control Tower', 'AWS Audit Manager'],
    a: [0],
    e: 'O AWS Security Hub agrega e prioriza achados de vários serviços e executa verificações contínuas, como o padrão AWS Foundational Security Best Practices.',
    s: 'AWS Security Hub'
  },
  {
    id: 's25', d: 'seguranca',
    q: 'Uma instância de produção foi encerrada sem autorização. A equipe precisa descobrir qual identidade fez isso, quando e de qual endereço IP. Qual serviço fornece essa informação?',
    o: ['Amazon CloudWatch', 'AWS CloudTrail', 'AWS Config', 'VPC Flow Logs'],
    a: [1],
    e: 'O CloudTrail registra as chamadas de API da conta com identidade, horário, IP de origem e parâmetros. O CloudWatch monitora métricas e logs de desempenho; o Config registra o estado das configurações.',
    s: 'AWS CloudTrail'
  },
  {
    id: 's26', d: 'seguranca',
    q: 'Uma empresa quer saber como as regras de um security group mudaram nos últimos 30 dias e ser alertada sempre que um bucket S3 ficar público, contrariando suas políticas. Qual serviço atende?',
    o: ['AWS Config', 'AWS CloudTrail', 'Amazon Inspector', 'AWS Artifact'],
    a: [0],
    e: 'O AWS Config mantém o histórico de configurações dos recursos e avalia a conformidade com regras. O CloudTrail mostra quem fez a chamada de API, mas não avalia conformidade.',
    s: 'AWS Config'
  },
  {
    id: 's27', d: 'seguranca',
    q: 'Um auditor pede (1) o registro de quem alterou uma regra de firewall e (2) uma avaliação de quais recursos estão fora das políticas internas de configuração. Quais serviços fornecem essas informações? (Escolha 2)',
    o: ['AWS CloudTrail', 'AWS Config', 'Amazon CloudWatch', 'AWS Artifact', 'Amazon Inspector'],
    a: [0, 1],
    e: 'O CloudTrail responde "quem fez o quê e quando"; o Config avalia a conformidade das configurações. O Artifact fornece relatórios de conformidade da própria AWS, não dos recursos do cliente.',
    s: 'Auditoria'
  },
  {
    id: 's28', d: 'seguranca',
    q: 'Uma fintech precisa enviar a um auditor o relatório SOC 2 da AWS e o atestado PCI DSS. Onde ela obtém esses documentos?',
    o: ['AWS Artifact', 'AWS Audit Manager', 'AWS Security Hub', 'AWS Health Dashboard'],
    a: [0],
    e: 'O AWS Artifact é o portal de autoatendimento para relatórios de conformidade e acordos da AWS. O Audit Manager coleta evidências sobre o ambiente do próprio cliente.',
    s: 'AWS Artifact'
  },
  {
    id: 's29', d: 'seguranca',
    q: 'Uma empresa precisa coletar evidências continuamente sobre o seu uso da AWS para se preparar para auditorias de frameworks como o GDPR, com o MENOR esforço manual. Qual serviço deve usar?',
    o: ['AWS Audit Manager', 'AWS Artifact', 'AWS Trusted Advisor', 'Amazon Macie'],
    a: [0],
    e: 'O AWS Audit Manager automatiza a coleta de evidências e as mapeia para controles de frameworks de conformidade. O Artifact só disponibiliza os relatórios da AWS.',
    s: 'AWS Audit Manager'
  },
  {
    id: 's30', d: 'seguranca',
    q: 'Uma empresa quer criptografar volumes EBS, objetos no S3 e bancos RDS usando chaves que ela controla, com permissões de uso e registro de cada utilização. Qual serviço gerencia essas chaves?',
    o: ['AWS Key Management Service (AWS KMS)', 'AWS Secrets Manager', 'AWS Certificate Manager', 'AWS IAM Identity Center'],
    a: [0],
    e: 'O AWS KMS cria e controla chaves de criptografia integradas a dezenas de serviços, e cada uso fica registrado no CloudTrail. O Secrets Manager guarda segredos como senhas, não chaves de criptografia de serviços.',
    s: 'AWS KMS'
  },
  {
    id: 's31', d: 'seguranca',
    q: 'Quais opções protegem dados EM TRÂNSITO? (Escolha 2)',
    o: ['Usar HTTPS (TLS) entre os clientes e a aplicação', 'Usar uma AWS Site-to-Site VPN entre o escritório e a VPC', 'Ativar a criptografia padrão do bucket S3 (SSE-S3)', 'Criptografar os volumes EBS com chaves do KMS', 'Ativar MFA para os usuários do IAM'],
    a: [0, 1],
    e: 'TLS e VPN (IPsec) criptografam os dados enquanto trafegam pela rede. SSE-S3 e criptografia de EBS protegem dados em repouso, e MFA protege identidades.',
    s: 'Criptografia'
  },
  {
    id: 's32', d: 'seguranca',
    q: 'Uma empresa quer usar HTTPS no seu Application Load Balancer com certificados TLS públicos gratuitos e renovados automaticamente. Qual serviço deve usar?',
    o: ['AWS Certificate Manager (ACM)', 'AWS KMS', 'AWS Secrets Manager', 'AWS CloudHSM'],
    a: [0],
    e: 'O ACM emite certificados públicos sem custo para uso em serviços integrados (como ELB e CloudFront) e cuida da renovação.',
    s: 'AWS Certificate Manager'
  },
  {
    id: 's33', d: 'seguranca',
    q: 'Os desenvolvedores guardam a senha do banco de dados no código da aplicação. A empresa quer armazená-la de forma segura e trocá-la automaticamente a cada 30 dias. Qual serviço atende?',
    o: ['AWS Secrets Manager', 'AWS KMS', 'Amazon S3 com versionamento', 'AWS Certificate Manager'],
    a: [0],
    e: 'O Secrets Manager armazena segredos criptografados e tem rotação automática integrada a bancos como o RDS. O KMS gerencia chaves, mas não rotaciona senhas de banco.',
    s: 'AWS Secrets Manager'
  },
  {
    id: 's34', d: 'seguranca',
    q: 'Uma regulamentação exige que as chaves de criptografia fiquem em módulos de segurança de hardware (HSM) dedicados, de uso exclusivo da empresa (single-tenant). Qual serviço atende?',
    o: ['AWS CloudHSM', 'AWS KMS com chaves gerenciadas pela AWS', 'AWS Secrets Manager', 'AWS Certificate Manager'],
    a: [0],
    e: 'O AWS CloudHSM fornece HSMs dedicados, controlados exclusivamente pelo cliente. No KMS padrão os HSMs são multi-tenant e gerenciados pela AWS.',
    s: 'AWS CloudHSM'
  },
  {
    id: 's35', d: 'seguranca',
    q: 'Um security group permite a entrada na porta 443. A resposta enviada pela instância ao cliente precisa de uma regra de saída específica?',
    o: ['Não, porque security groups são stateful', 'Sim, porque security groups são stateless', 'Sim, é preciso uma regra de saída com portas efêmeras', 'Depende da network ACL da sub-rede, que substitui o security group'],
    a: [0],
    e: 'Security groups são stateful: o tráfego de resposta de uma conexão permitida é liberado automaticamente. NACLs são stateless e exigem regras para o retorno.',
    s: 'Amazon VPC'
  },
  {
    id: 's36', d: 'seguranca',
    q: 'Uma equipe identificou um endereço IP malicioso e precisa BLOQUEÁ-LO explicitamente para todas as instâncias de uma sub-rede. Qual recurso permite isso?',
    o: ['Um security group com regra de negação', 'Uma network ACL com regra de negação', 'Uma tabela de rotas', 'Um internet gateway'],
    a: [1],
    e: 'Network ACLs atuam na sub-rede e aceitam regras de permissão e de NEGAÇÃO. Security groups só têm regras de permissão, então não conseguem bloquear um IP específico.',
    s: 'Amazon VPC'
  },
  {
    id: 's37', d: 'seguranca',
    q: 'Uma empresa quer reduzir o risco de contas do IAM serem comprometidas por senhas fracas ou vazadas. Quais medidas deve adotar? (Escolha 2)',
    o: ['Exigir MFA para os usuários', 'Configurar uma política de senhas forte para a conta', 'Permitir que os usuários compartilhem logins', 'Desativar o AWS CloudTrail para reduzir custos', 'Conceder AdministratorAccess para evitar bloqueios de acesso'],
    a: [0, 1],
    e: 'MFA adiciona um segundo fator mesmo que a senha vaze, e a política de senhas impõe complexidade e troca. As outras opções aumentam o risco ou reduzem a rastreabilidade.',
    s: 'AWS IAM'
  },
  {
    id: 's38', d: 'seguranca',
    q: 'Uma lei exige que os dados de clientes de uma empresa permaneçam no Brasil. Como a empresa atende a esse requisito na AWS?',
    o: ['Armazenando os dados na Região América do Sul (São Paulo), pois a AWS não move dados entre Regiões sem ação do cliente', 'Ativando o AWS Shield Advanced', 'Usando o Amazon CloudFront com pontos de presença no Brasil', 'Pedindo à AWS um data center exclusivo'],
    a: [0],
    e: 'O cliente escolhe a Região onde os dados ficam, e a AWS não replica dados para outras Regiões por conta própria. Pontos de presença do CloudFront fazem cache de conteúdo, mas não definem onde os dados ficam armazenados.',
    s: 'Soberania de dados'
  },
  {
    id: 's39', d: 'seguranca',
    q: 'Uma empresa quer fazer um teste de invasão (pentest) nas suas próprias instâncias EC2. O que ela precisa saber?',
    o: ['Pode testar sem aprovação prévia os serviços da lista permitida, seguindo a política de testes da AWS', 'Precisa de autorização por escrito da AWS para qualquer teste', 'Pentests são proibidos na AWS', 'Só pode testar com o plano de suporte Enterprise'],
    a: [0],
    e: 'A AWS permite que clientes façam avaliações de segurança em uma lista de serviços (como EC2 e RDS) sem aprovação prévia, desde que sigam a política. Ataques DDoS simulados têm regras próprias.',
    s: 'Testes de segurança'
  },
  // ---------- Domínio 3: Tecnologia e serviços de nuvem (44) ----------
  {
    id: 't01', d: 'tecnologia',
    q: 'Qual afirmação descreve corretamente uma Zona de Disponibilidade (AZ)?',
    o: ['Um ou mais data centers separados, com energia, rede e conectividade redundantes, dentro de uma Região', 'Um ponto de presença usado para fazer cache de conteúdo', 'Uma área geográfica com vários data centers de diferentes Regiões', 'Um data center instalado nas dependências do cliente'],
    a: [0],
    e: 'Cada Região tem no mínimo três AZs isoladas fisicamente entre si e conectadas por links de baixa latência. Pontos de presença fazem parte da rede de borda, e equipamentos no cliente são o AWS Outposts.',
    s: 'Infraestrutura global'
  },
  {
    id: 't02', d: 'tecnologia',
    q: 'Uma empresa europeia vai escolher a Região AWS para uma nova aplicação de saúde. Quais fatores devem pesar nessa escolha? (Escolha 2)',
    o: ['Requisitos de conformidade e de residência de dados', 'Proximidade dos usuários finais, para reduzir a latência', 'A quantidade de usuários do IAM na conta', 'O idioma padrão do Console de Gerenciamento', 'O número de buckets S3 já criados em outras Regiões'],
    a: [0, 1],
    e: 'Os principais fatores são conformidade, proximidade dos usuários, disponibilidade dos serviços na Região e preço. O IAM é global e o idioma do console não depende da Região.',
    s: 'Infraestrutura global'
  },
  {
    id: 't03', d: 'tecnologia',
    q: 'Um portal de notícias hospedado em uma única Região tem leitores no mundo todo, que reclamam da lentidão para carregar imagens e vídeos. Qual serviço reduz a latência com o MENOR esforço?',
    o: ['Amazon CloudFront', 'Replicar toda a aplicação em todas as Regiões', 'AWS Direct Connect', 'Amazon EBS com volumes maiores'],
    a: [0],
    e: 'O CloudFront é a CDN da AWS e faz cache do conteúdo em centenas de pontos de presença perto dos usuários. Replicar tudo em todas as Regiões resolveria, mas com muito mais esforço e custo.',
    s: 'Amazon CloudFront'
  },
  {
    id: 't04', d: 'tecnologia',
    q: 'Uma fábrica precisa executar serviços da AWS dentro de suas próprias instalações, com latência mínima para as máquinas da linha de produção, usando as mesmas APIs e ferramentas da AWS. Qual solução atende?',
    o: ['AWS Outposts', 'AWS Local Zones', 'AWS Snowball Edge para sempre', 'Amazon CloudFront'],
    a: [0],
    e: 'O AWS Outposts leva a infraestrutura e os serviços da AWS para o data center do cliente. Local Zones são da AWS e ficam em grandes cidades, não nas instalações do cliente.',
    s: 'AWS Outposts'
  },
  {
    id: 't05', d: 'tecnologia',
    q: 'Um estúdio de efeitos visuais em uma grande cidade precisa de latência de poucos milissegundos para estações de renderização, mas não quer manter infraestrutura própria e a Região AWS mais próxima fica longe. Qual opção atende?',
    o: ['AWS Local Zones', 'AWS Outposts', 'Uma nova Zona de Disponibilidade dedicada', 'Amazon S3 Transfer Acceleration'],
    a: [0],
    e: 'Local Zones levam computação, armazenamento e outros serviços para perto de grandes centros populacionais, sem que o cliente gerencie hardware. O Outposts exige instalar equipamentos no próprio local.',
    s: 'AWS Local Zones'
  },
  {
    id: 't06', d: 'tecnologia',
    q: 'Toda vez que uma foto é enviada para um bucket S3, uma miniatura precisa ser gerada. O volume é imprevisível e a empresa quer o MENOR esforço operacional. Qual solução é mais adequada?',
    o: ['Uma função AWS Lambda acionada pelo evento de upload do S3', 'Uma instância EC2 verificando o bucket a cada minuto', 'Um cluster Amazon EKS com escalonamento automático', 'Uma instância EC2 reservada por três anos'],
    a: [0],
    e: 'O Lambda roda o código em resposta a eventos, escala automaticamente e cobra apenas pela execução, sem servidores para gerenciar. As outras opções exigem gerenciar e pagar por capacidade.',
    s: 'AWS Lambda'
  },
  {
    id: 't07', d: 'tecnologia',
    q: 'Uma aplicação mantém grandes conjuntos de dados em memória e precisa de muita RAM em relação ao número de vCPUs. Qual família de instâncias EC2 é a mais adequada?',
    o: ['Otimizada para memória', 'Otimizada para computação', 'Computação acelerada', 'Otimizada para armazenamento'],
    a: [0],
    e: 'Instâncias otimizadas para memória (como a família R) são feitas para bancos e caches em memória. As otimizadas para computação priorizam CPU, e as aceleradas usam GPUs ou outros aceleradores.',
    s: 'Amazon EC2'
  },
  {
    id: 't08', d: 'tecnologia',
    q: 'Uma equipe quer executar containers no Amazon ECS sem provisionar, aplicar patches ou escalar instâncias EC2. Qual opção atende?',
    o: ['AWS Fargate', 'Amazon EC2 Auto Scaling', 'AWS Elastic Beanstalk com instâncias dedicadas', 'Amazon Lightsail'],
    a: [0],
    e: 'O Fargate é um mecanismo de computação serverless para containers no ECS e no EKS: você define CPU e memória da tarefa e a AWS cuida dos servidores.',
    s: 'AWS Fargate'
  },
  {
    id: 't09', d: 'tecnologia',
    q: 'Uma empresa já usa Kubernetes no data center e quer migrar para a AWS mantendo as mesmas ferramentas e manifestos, sem gerenciar o plano de controle. Qual serviço deve escolher?',
    o: ['Amazon ECS', 'Amazon EKS', 'AWS Lambda', 'AWS Batch'],
    a: [1],
    e: 'O Amazon EKS é Kubernetes gerenciado e compatível com o ecossistema Kubernetes. O ECS é o orquestrador de containers próprio da AWS, com outra API.',
    s: 'Amazon EKS'
  },
  {
    id: 't10', d: 'tecnologia',
    q: 'Um desenvolvedor quer publicar uma aplicação web Java e deixar a AWS cuidar do provisionamento, do balanceamento de carga, do escalonamento e do monitoramento, mantendo acesso aos recursos criados. Qual serviço atende?',
    o: ['AWS Elastic Beanstalk', 'AWS CloudFormation', 'Amazon EC2 com configuração manual', 'AWS CodeCommit'],
    a: [0],
    e: 'O Elastic Beanstalk recebe o código e cria e gerencia a infraestrutura necessária (EC2, ELB, Auto Scaling). O CloudFormation exige que você descreva cada recurso em um modelo.',
    s: 'AWS Elastic Beanstalk'
  },
  {
    id: 't11', d: 'tecnologia',
    q: 'O dono de uma pequena loja quer hospedar um site WordPress em um servidor virtual simples, com preço mensal previsível e sem precisar conhecer VPC ou EC2. Qual serviço é o mais adequado?',
    o: ['Amazon Lightsail', 'Amazon EC2 com instâncias spot', 'Amazon EKS', 'AWS Outposts'],
    a: [0],
    e: 'O Lightsail oferece servidores virtuais com planos mensais fixos e configuração simplificada, ideal para sites pequenos. Instâncias spot podem ser interrompidas.',
    s: 'Amazon Lightsail'
  },
  {
    id: 't12', d: 'tecnologia',
    q: 'Um estudante quer publicar um site estático (HTML, CSS e JavaScript) diretamente de um bucket S3, como este simulado. Quais configurações são necessárias? (Escolha 2)',
    o: ['Ativar o static website hosting no bucket, com um documento de índice', 'Adicionar uma bucket policy que permita s3:GetObject público', 'Iniciar uma instância EC2 com Apache', 'Criar um banco de dados no Amazon RDS', 'Configurar um Application Load Balancer na frente do bucket'],
    a: [0, 1],
    e: 'Basta ativar a hospedagem de site estático e liberar a leitura pública dos objetos. Um site estático não precisa de servidor, banco de dados nem load balancer.',
    s: 'Amazon S3'
  },
  {
    id: 't13', d: 'tecnologia',
    q: 'Uma empresa precisa guardar registros fiscais por 10 anos. Eles quase nunca são consultados e, quando são, uma espera de até 12 horas é aceitável. Qual classe de armazenamento tem o MENOR custo?',
    o: ['S3 Standard', 'S3 Standard-IA', 'S3 Glacier Deep Archive', 'S3 Glacier Instant Retrieval'],
    a: [2],
    e: 'O Glacier Deep Archive é a classe mais barata do S3, com recuperação em até 12 horas. O Glacier Instant Retrieval custa mais porque recupera em milissegundos.',
    s: 'Amazon S3'
  },
  {
    id: 't14', d: 'tecnologia',
    q: 'Uma plataforma de dados armazena milhões de objetos, mas ninguém sabe quais serão acessados com frequência, e o padrão muda o tempo todo. Qual classe do S3 otimiza o custo automaticamente sem afetar o desempenho?',
    o: ['S3 Intelligent-Tiering', 'S3 Standard', 'S3 One Zone-IA', 'S3 Glacier Flexible Retrieval'],
    a: [0],
    e: 'O Intelligent-Tiering move cada objeto entre camadas de acesso conforme o uso, sem taxas de recuperação. As outras classes exigem que você conheça o padrão de acesso.',
    s: 'Amazon S3'
  },
  {
    id: 't15', d: 'tecnologia',
    q: 'Backups de uma aplicação são acessados poucas vezes por mês, mas quando são precisam estar disponíveis em milissegundos e resistir à perda de uma Zona de Disponibilidade. Qual classe do S3 é a MAIS econômica?',
    o: ['S3 Standard-IA', 'S3 One Zone-IA', 'S3 Glacier Deep Archive', 'S3 Standard'],
    a: [0],
    e: 'O Standard-IA guarda os dados em várias AZs, com acesso em milissegundos e custo de armazenamento menor que o Standard. O One Zone-IA usa só uma AZ, e o Deep Archive demora horas.',
    s: 'Amazon S3'
  },
  {
    id: 't16', d: 'tecnologia',
    q: 'Uma empresa quer que os logs no S3 passem automaticamente para o S3 Glacier depois de 90 dias e sejam apagados depois de 5 anos. Qual recurso deve configurar?',
    o: ['Regras de ciclo de vida do S3 (S3 Lifecycle)', 'Replicação entre Regiões do S3', 'Versionamento do S3', 'S3 Transfer Acceleration'],
    a: [0],
    e: 'As regras de ciclo de vida movem objetos entre classes e os expiram automaticamente com base na idade. A replicação copia objetos para outro bucket; não muda a classe nem apaga.',
    s: 'Amazon S3'
  },
  {
    id: 't17', d: 'tecnologia',
    q: 'Um funcionário sobrescreveu e depois apagou arquivos importantes em um bucket S3 por engano. Qual recurso, ativado antes do incidente, permitiria recuperar as versões anteriores?',
    o: ['Versionamento do S3', 'S3 Transfer Acceleration', 'Hospedagem de site estático', 'S3 Intelligent-Tiering'],
    a: [0],
    e: 'Com o versionamento, o S3 mantém versões anteriores dos objetos, e uma exclusão só cria um marcador que pode ser removido. Os outros recursos não guardam histórico.',
    s: 'Amazon S3'
  },
  {
    id: 't18', d: 'tecnologia',
    q: 'Um banco de dados instalado em uma instância EC2 precisa de armazenamento em bloco persistente, que continue existindo se a instância for parada. Qual serviço atende?',
    o: ['Amazon EBS', 'Instance store', 'Amazon S3', 'Amazon S3 Glacier'],
    a: [0],
    e: 'Volumes EBS são armazenamento em bloco persistente, conectados à instância pela rede. O instance store perde os dados quando a instância é parada; S3 é armazenamento de objetos.',
    s: 'Amazon EBS'
  },
  {
    id: 't19', d: 'tecnologia',
    q: 'Uma aplicação precisa de um disco temporário com altíssimo desempenho para arquivos de cache que podem ser recriados a qualquer momento. Qual opção é a MAIS econômica?',
    o: ['Instance store', 'Amazon EBS io2', 'Amazon EFS', 'Amazon FSx for Windows File Server'],
    a: [0],
    e: 'O instance store é fisicamente ligado ao host, muito rápido e já incluído no preço da instância, mas é temporário. Como o cache pode ser recriado, isso não é problema.',
    s: 'Amazon EC2'
  },
  {
    id: 't20', d: 'tecnologia',
    q: 'Dezenas de instâncias EC2 Linux, em várias Zonas de Disponibilidade, precisam ler e gravar os mesmos arquivos ao mesmo tempo, com armazenamento que cresce automaticamente. Qual serviço atende?',
    o: ['Amazon EFS', 'Amazon EBS', 'Instance store', 'Amazon S3 Glacier'],
    a: [0],
    e: 'O Amazon EFS é um sistema de arquivos NFS gerenciado, elástico e acessível por muitas instâncias em várias AZs. Um volume EBS comum fica em uma única AZ e normalmente se liga a uma instância.',
    s: 'Amazon EFS'
  },
  {
    id: 't21', d: 'tecnologia',
    q: 'Uma empresa quer migrar seus compartilhamentos de arquivos Windows (protocolo SMB), integrados ao Active Directory, para um serviço totalmente gerenciado. Qual serviço deve usar?',
    o: ['Amazon FSx for Windows File Server', 'Amazon EFS', 'Amazon S3', 'AWS Storage Gateway Volume Gateway'],
    a: [0],
    e: 'O FSx for Windows File Server oferece sistemas de arquivos Windows nativos com SMB e integração ao Active Directory. O EFS usa NFS e é voltado para Linux.',
    s: 'Amazon FSx'
  },
  {
    id: 't22', d: 'tecnologia',
    q: 'Aplicações que ficarão no data center precisam continuar gravando arquivos via NFS, mas a empresa quer que os dados sejam guardados de forma durável no Amazon S3. Qual serviço faz essa ponte?',
    o: ['AWS Storage Gateway', 'AWS Snowball', 'Amazon EFS', 'AWS Direct Connect'],
    a: [0],
    e: 'O Storage Gateway é um serviço híbrido que dá às aplicações locais acesso a armazenamento na nuvem por protocolos padrão (NFS, SMB, iSCSI). O Direct Connect é só a conexão de rede.',
    s: 'AWS Storage Gateway'
  },
  {
    id: 't23', d: 'tecnologia',
    q: 'Uma empresa quer definir em um só lugar políticas de backup para volumes EBS, bancos RDS, tabelas DynamoDB e sistemas de arquivos EFS, com retenção e cópia entre Regiões. Qual serviço atende?',
    o: ['AWS Backup', 'Amazon S3 Lifecycle', 'AWS Storage Gateway', 'AWS DataSync'],
    a: [0],
    e: 'O AWS Backup centraliza e automatiza backups de vários serviços com planos e políticas de retenção. O DataSync transfere dados, mas não gerencia planos de backup.',
    s: 'AWS Backup'
  },
  {
    id: 't24', d: 'tecnologia',
    q: 'Uma empresa mantém um banco PostgreSQL em EC2 e gasta muito tempo com backups, patches e failover. Ela quer continuar com PostgreSQL e reduzir esse trabalho. Qual serviço atende com o MENOR esforço?',
    o: ['Amazon RDS for PostgreSQL', 'Amazon DynamoDB', 'Amazon Redshift', 'PostgreSQL em uma instância EC2 maior'],
    a: [0],
    e: 'O Amazon RDS automatiza backups, patches e oferece Multi-AZ com failover automático. O DynamoDB é NoSQL (exigiria reescrever a aplicação) e o Redshift é um data warehouse.',
    s: 'Amazon RDS'
  },
  {
    id: 't25', d: 'tecnologia',
    q: 'Uma empresa quer um banco relacional compatível com MySQL, com desempenho maior que o MySQL padrão, armazenamento que cresce automaticamente e seis cópias dos dados em três AZs. Qual serviço atende?',
    o: ['Amazon Aurora', 'Amazon DynamoDB', 'Amazon DocumentDB', 'Amazon Neptune'],
    a: [0],
    e: 'O Amazon Aurora é compatível com MySQL e PostgreSQL e replica os dados seis vezes em três AZs. DocumentDB é banco de documentos e Neptune é banco de grafos.',
    s: 'Amazon Aurora'
  },
  {
    id: 't26', d: 'tecnologia',
    q: 'Um jogo on-line precisa armazenar o perfil e o placar de milhões de jogadores, com latência de milissegundos em qualquer escala e sem servidores para gerenciar. Qual banco é o mais adequado?',
    o: ['Amazon DynamoDB', 'Amazon RDS for MySQL', 'Amazon Redshift', 'Amazon Aurora com instâncias provisionadas'],
    a: [0],
    e: 'O DynamoDB é um banco NoSQL de chave-valor serverless, com desempenho de um dígito de milissegundo em qualquer escala. As opções relacionais exigem dimensionar instâncias.',
    s: 'Amazon DynamoDB'
  },
  {
    id: 't27', d: 'tecnologia',
    q: 'As mesmas consultas de catálogo de produtos sobrecarregam o banco RDS de um e-commerce. Qual serviço reduz a carga do banco guardando os resultados mais acessados em memória?',
    o: ['Amazon ElastiCache', 'Amazon S3 Glacier', 'AWS Backup', 'Amazon Redshift'],
    a: [0],
    e: 'O ElastiCache (Redis ou Memcached) oferece cache em memória com latência de microssegundos, aliviando o banco principal.',
    s: 'Amazon ElastiCache'
  },
  {
    id: 't28', d: 'tecnologia',
    q: 'A área de BI precisa executar consultas analíticas complexas sobre petabytes de dados históricos de vendas, combinando dados de vários sistemas. Qual serviço é um data warehouse?',
    o: ['Amazon Redshift', 'Amazon DynamoDB', 'Amazon RDS', 'Amazon ElastiCache'],
    a: [0],
    e: 'O Redshift é o data warehouse da AWS, otimizado para consultas analíticas (OLAP) em grande escala. RDS e DynamoDB são voltados a cargas transacionais.',
    s: 'Amazon Redshift'
  },
  {
    id: 't29', d: 'tecnologia',
    q: 'Um analista quer rodar consultas SQL diretamente sobre arquivos CSV e Parquet guardados no S3, sem carregar os dados em um banco e sem gerenciar servidores. Qual serviço atende?',
    o: ['Amazon Athena', 'Amazon RDS', 'Amazon EMR com cluster permanente', 'Amazon ElastiCache'],
    a: [0],
    e: 'O Athena é serverless e consulta dados no S3 com SQL padrão, cobrando pelos dados lidos. O EMR exige gerenciar clusters.',
    s: 'Amazon Athena'
  },
  {
    id: 't30', d: 'tecnologia',
    q: 'Um site precisa coletar e processar em tempo real milhões de eventos de cliques por minuto para detectar tendências. Qual serviço é feito para ingerir esse fluxo de dados?',
    o: ['Amazon Kinesis Data Streams', 'Amazon S3 Glacier', 'AWS Snowball', 'Amazon RDS'],
    a: [0],
    e: 'O Kinesis Data Streams captura e armazena fluxos de dados em tempo real para processamento contínuo. Snowball e Glacier tratam de transferência e arquivamento.',
    s: 'Amazon Kinesis'
  },
  {
    id: 't31', d: 'tecnologia',
    q: 'A diretoria quer painéis interativos de vendas, acessíveis pelo navegador, com dados do Redshift e do Athena. Qual serviço de BI da AWS atende?',
    o: ['Amazon QuickSight', 'Amazon CloudWatch Dashboards', 'AWS Glue', 'Amazon Kinesis'],
    a: [0],
    e: 'O Amazon QuickSight é o serviço de business intelligence da AWS para criar painéis e visualizações. Os painéis do CloudWatch mostram métricas operacionais; o Glue faz ETL.',
    s: 'Amazon QuickSight'
  },
  {
    id: 't32', d: 'tecnologia',
    q: 'Uma aplicação web roda em uma única instância EC2 e ficou fora do ar quando sua AZ teve um problema. Quais serviços a tornam altamente disponível e capaz de acompanhar a demanda? (Escolha 2)',
    o: ['Elastic Load Balancing', 'Amazon EC2 Auto Scaling com instâncias em várias AZs', 'Uma instância EC2 maior na mesma AZ', 'AWS CloudTrail', 'Amazon S3 Glacier'],
    a: [0, 1],
    e: 'O ELB distribui o tráfego entre instâncias saudáveis e o Auto Scaling mantém a quantidade certa de instâncias em várias AZs. Uma instância maior continua sendo ponto único de falha.',
    s: 'Alta disponibilidade'
  },
  {
    id: 't33', d: 'tecnologia',
    q: 'Em uma VPC, o servidor web precisa ser acessível pela internet, mas o banco de dados nunca deve ser. Onde o banco de dados deve ficar?',
    o: ['Em uma sub-rede privada, sem rota para o internet gateway', 'Em uma sub-rede pública, com um IP elástico', 'Na mesma sub-rede pública do servidor web', 'Em um bucket S3 público'],
    a: [0],
    e: 'Sub-redes privadas não têm rota direta para a internet. O servidor web fica na sub-rede pública e acessa o banco pela rede interna da VPC.',
    s: 'Amazon VPC'
  },
  {
    id: 't34', d: 'tecnologia',
    q: 'Instâncias em uma sub-rede privada precisam baixar atualizações de software da internet, mas não podem receber conexões iniciadas a partir da internet. Qual recurso deve ser usado?',
    o: ['NAT gateway', 'Internet gateway anexado diretamente às instâncias', 'VPC peering', 'AWS Direct Connect'],
    a: [0],
    e: 'O NAT gateway, colocado em uma sub-rede pública, permite que instâncias privadas iniciem conexões de saída e bloqueia conexões de entrada.',
    s: 'Amazon VPC'
  },
  {
    id: 't35', d: 'tecnologia',
    q: 'Quais opções conectam a rede de um data center corporativo a uma VPC da AWS? (Escolha 2)',
    o: ['AWS Site-to-Site VPN', 'AWS Direct Connect', 'Amazon CloudFront', 'VPC peering', 'Amazon Route 53'],
    a: [0, 1],
    e: 'A Site-to-Site VPN cria um túnel criptografado pela internet e o Direct Connect é um link físico dedicado. VPC peering conecta duas VPCs, não um data center.',
    s: 'Conectividade híbrida'
  },
  {
    id: 't36', d: 'tecnologia',
    q: 'Uma aplicação roda em duas Regiões e a empresa quer que cada usuário seja direcionado automaticamente para a Região com a menor latência para ele. Qual serviço e recurso atendem?',
    o: ['Amazon Route 53 com roteamento baseado em latência', 'Elastic Load Balancing entre Regiões', 'Amazon CloudFront com Lambda@Edge obrigatório', 'Uma tabela de rotas da VPC'],
    a: [0],
    e: 'O Route 53 é o DNS da AWS e oferece políticas de roteamento como latência, geolocalização, failover e ponderado. Um ELB distribui tráfego dentro de uma única Região.',
    s: 'Amazon Route 53'
  },
  {
    id: 't37', d: 'tecnologia',
    q: 'Uma equipe criou funções Lambda e quer expô-las como uma API REST pública, com autenticação, controle de limite de requisições e versionamento. Qual serviço deve usar?',
    o: ['Amazon API Gateway', 'Amazon Route 53', 'AWS Direct Connect', 'Amazon SQS'],
    a: [0],
    e: 'O API Gateway cria, publica e protege APIs REST, HTTP e WebSocket, integrando-se ao Lambda e oferecendo limites de requisições e autorização.',
    s: 'Amazon API Gateway'
  },
  {
    id: 't38', d: 'tecnologia',
    q: 'Em picos de pedidos, o serviço de pagamentos não consegue processar tudo e pedidos são perdidos. Qual serviço permite guardar os pedidos até que possam ser processados, desacoplando os componentes?',
    o: ['Amazon SQS', 'Amazon SNS', 'Amazon CloudFront', 'AWS Step Functions'],
    a: [0],
    e: 'O SQS é uma fila gerenciada: os pedidos ficam armazenados até o consumidor processá-los no próprio ritmo. O SNS envia mensagens para assinantes imediatamente, sem guardá-las para depois.',
    s: 'Amazon SQS'
  },
  {
    id: 't39', d: 'tecnologia',
    q: 'Quando um pedido é confirmado, a mesma mensagem precisa ser enviada ao mesmo tempo para uma fila de estoque, uma função de faturamento e o e-mail do cliente. Qual serviço implementa esse padrão publish/subscribe?',
    o: ['Amazon SNS', 'Amazon SQS sozinho', 'Amazon Kinesis Data Streams', 'AWS Batch'],
    a: [0],
    e: 'O Amazon SNS envia cada mensagem publicada em um tópico para todos os assinantes (filas SQS, Lambda, e-mail, SMS etc.). Uma fila SQS sozinha entrega cada mensagem a um único consumidor.',
    s: 'Amazon SNS'
  },
  {
    id: 't40', d: 'tecnologia',
    q: 'A equipe de operações quer ser avisada quando a utilização de CPU das instâncias passar de 80% por 5 minutos e ver as métricas em painéis. Qual serviço atende?',
    o: ['Amazon CloudWatch', 'AWS CloudTrail', 'AWS Config', 'AWS Trusted Advisor'],
    a: [0],
    e: 'O CloudWatch coleta métricas e logs, cria painéis e dispara alarmes. O CloudTrail registra chamadas de API, não utilização de recursos.',
    s: 'Amazon CloudWatch'
  },
  {
    id: 't41', d: 'tecnologia',
    q: 'Uma empresa precisa criar ambientes idênticos de desenvolvimento, homologação e produção em várias Regiões, de forma repetível e versionada junto com o código. Qual serviço atende?',
    o: ['AWS CloudFormation', 'AWS Elastic Beanstalk', 'Configuração manual pelo Console de Gerenciamento', 'AWS Trusted Advisor'],
    a: [0],
    e: 'O CloudFormation é infraestrutura como código: modelos em JSON ou YAML criam pilhas idênticas sempre que necessário. Configuração manual não é repetível nem versionável.',
    s: 'AWS CloudFormation'
  },
  {
    id: 't42', d: 'tecnologia',
    q: 'Uma empresa quer criar um assistente com IA generativa usando modelos de base de vários fornecedores, como Anthropic Claude, por meio de uma API, sem gerenciar infraestrutura nem treinar modelos do zero. Qual serviço atende?',
    o: ['Amazon Bedrock', 'Amazon SageMaker AI com treinamento do zero', 'Amazon Rekognition', 'Amazon Comprehend'],
    a: [0],
    e: 'O Amazon Bedrock dá acesso a modelos de base de empresas como Anthropic, Meta e da própria Amazon por uma API única e serverless. Rekognition e Comprehend são serviços de IA para tarefas específicas.',
    s: 'Amazon Bedrock'
  },
  {
    id: 't43', d: 'tecnologia',
    q: 'Os desenvolvedores querem um assistente de IA generativa que sugira código na IDE, explique recursos da AWS e ajude a solucionar problemas. Qual serviço atende?',
    o: ['Amazon Q Developer', 'Amazon Polly', 'AWS CodePipeline', 'Amazon Lex'],
    a: [0],
    e: 'O Amazon Q Developer é o assistente de IA generativa da AWS para desenvolvimento de software. O Polly converte texto em fala, o Lex cria chatbots e o CodePipeline automatiza entregas.',
    s: 'Amazon Q'
  },
  {
    id: 't44', d: 'tecnologia',
    q: 'Uma central de atendimento quer converter as gravações das ligações em texto e depois identificar se o cliente estava satisfeito ou irritado. Quais serviços atendem? (Escolha 2)',
    o: ['Amazon Transcribe', 'Amazon Comprehend', 'Amazon Polly', 'Amazon Rekognition', 'Amazon Translate'],
    a: [0, 1],
    e: 'O Transcribe converte fala em texto e o Comprehend faz análise de sentimento em texto. O Polly faz o contrário (texto em fala), o Rekognition analisa imagens e o Translate traduz.',
    s: 'IA/ML'
  },
  // ---------- Domínio 4: Faturamento, preços e suporte (16) ----------
  {
    id: 'f01', d: 'faturamento',
    q: 'Uma empresa processa vídeos em lote durante a madrugada. Os trabalhos podem ser interrompidos e retomados sem problema. Qual opção de compra do EC2 é a MAIS econômica?',
    o: ['Instâncias spot', 'Instâncias sob demanda', 'Instâncias reservadas por 3 anos', 'Hosts dedicados'],
    a: [0],
    e: 'Instâncias spot usam capacidade ociosa com até 90% de desconto e podem ser interrompidas com aviso de dois minutos, o que é aceitável em cargas tolerantes a interrupções.',
    s: 'Amazon EC2'
  },
  {
    id: 'f02', d: 'faturamento',
    q: 'Uma empresa usa EC2, AWS Lambda e AWS Fargate de forma estável e quer desconto em troca de um compromisso de gasto por hora por 1 ano, podendo trocar de família de instância e de Região. Qual modelo atende?',
    o: ['Compute Savings Plans', 'Instâncias reservadas padrão', 'Instâncias spot', 'Instâncias sob demanda'],
    a: [0],
    e: 'O Compute Savings Plans aplica o desconto ao uso de EC2, Lambda e Fargate, independentemente de família, tamanho ou Região. Instâncias reservadas padrão ficam presas a atributos específicos e não cobrem Lambda nem Fargate.',
    s: 'Savings Plans'
  },
  {
    id: 'f03', d: 'faturamento',
    q: 'Um sistema de ERP roda 24 horas por dia em instâncias EC2 com a mesma configuração e continuará assim pelos próximos três anos. Qual opção oferece o MAIOR desconto para esse uso?',
    o: ['Instâncias reservadas padrão de 3 anos com pagamento adiantado total', 'Instâncias sob demanda', 'Instâncias spot', 'Instâncias reservadas de 1 ano sem pagamento adiantado'],
    a: [0],
    e: 'Prazo mais longo e pagamento adiantado maior resultam nos maiores descontos. Spot não serve para um sistema que não pode ser interrompido.',
    s: 'Amazon EC2'
  },
  {
    id: 'f04', d: 'faturamento',
    q: 'Uma equipe vai rodar um teste de carga de dois dias, com uso imprevisível, que não pode ser interrompido e sem nenhum compromisso de longo prazo. Qual opção de compra deve usar?',
    o: ['Instâncias sob demanda', 'Instâncias spot', 'Instâncias reservadas', 'Savings Plans de 3 anos'],
    a: [0],
    e: 'Sob demanda não exige compromisso e não sofre interrupções; você paga pelo tempo de uso. Reservas e Savings Plans exigem compromisso de 1 ou 3 anos.',
    s: 'Amazon EC2'
  },
  {
    id: 'f05', d: 'faturamento',
    q: 'Uma empresa quer reaproveitar licenças de software que são cobradas por soquete físico e núcleo do servidor, e por isso precisa de visibilidade e controle sobre o servidor físico. Qual opção do EC2 atende?',
    o: ['Hosts dedicados', 'Instâncias spot', 'Instâncias sob demanda em hardware compartilhado', 'AWS Lambda'],
    a: [0],
    e: 'Hosts dedicados são servidores físicos exclusivos e dão visibilidade de soquetes e núcleos, permitindo usar licenças existentes (BYOL).',
    s: 'Amazon EC2'
  },
  {
    id: 'f06', d: 'faturamento',
    q: 'O financeiro quer ver em gráficos como os gastos com a AWS evoluíram nos últimos 12 meses, filtrados por serviço e por tag, e uma previsão para os próximos meses. Qual ferramenta deve usar?',
    o: ['AWS Cost Explorer', 'AWS Pricing Calculator', 'AWS Budgets', 'AWS Artifact'],
    a: [0],
    e: 'O Cost Explorer analisa gastos históricos com filtros e gera previsões. A Pricing Calculator estima custos de arquiteturas que ainda não existem.',
    s: 'AWS Cost Explorer'
  },
  {
    id: 'f07', d: 'faturamento',
    q: 'Um estudante quer receber um e-mail se a conta AWS gerar qualquer cobrança acima de zero, para nunca ser surpreendido na fatura. Qual serviço deve configurar?',
    o: ['AWS Budgets', 'AWS Cost Explorer', 'AWS Trusted Advisor', 'Amazon CloudWatch Logs'],
    a: [0],
    e: 'O AWS Budgets envia alertas quando custos ou uso reais ou previstos passam de um limite. Há um modelo pronto de "zero spend budget". O Cost Explorer mostra gastos, mas não envia alertas.',
    s: 'AWS Budgets'
  },
  {
    id: 'f08', d: 'faturamento',
    q: 'Antes de aprovar uma migração, a diretoria quer uma estimativa do custo mensal de uma arquitetura com EC2, RDS e S3 que ainda não existe. Qual ferramenta deve ser usada?',
    o: ['AWS Pricing Calculator', 'AWS Cost Explorer', 'AWS Cost and Usage Report', 'AWS Budgets'],
    a: [0],
    e: 'A Pricing Calculator estima custos antes da implantação. Cost Explorer e Cost and Usage Report mostram gastos que já aconteceram.',
    s: 'AWS Pricing Calculator'
  },
  {
    id: 'f09', d: 'faturamento',
    q: 'Uma equipe de FinOps precisa do conjunto de dados de custo e uso MAIS detalhado possível, por hora e por recurso, entregue em um bucket S3 para análise no Amazon Athena. Qual recurso atende?',
    o: ['AWS Cost and Usage Report (CUR)', 'AWS Cost Explorer', 'A fatura mensal em PDF', 'AWS Budgets'],
    a: [0],
    e: 'O Cost and Usage Report entrega os dados de faturamento mais granulares no S3, prontos para consultas com Athena, Redshift ou QuickSight.',
    s: 'AWS Cost and Usage Report'
  },
  {
    id: 'f10', d: 'faturamento',
    q: 'Uma empresa quer saber quanto cada departamento (Marketing, Vendas, TI) gasta na AWS, mesmo com todos usando a mesma conta. O que deve fazer?',
    o: ['Aplicar e ativar tags de alocação de custos nos recursos', 'Criar um usuário root para cada departamento', 'Usar Regiões diferentes para cada departamento', 'Abrir um chamado para a AWS separar a fatura'],
    a: [0],
    e: 'Tags de alocação de custos (por exemplo, Departamento=Marketing) permitem agrupar e filtrar os custos no Cost Explorer e no CUR.',
    s: 'Tags de alocação de custos'
  },
  {
    id: 'f11', d: 'faturamento',
    q: 'Uma empresa tem 12 contas AWS e quer usar o faturamento consolidado do AWS Organizations. Quais benefícios ela terá? (Escolha 2)',
    o: ['Uma única fatura para todas as contas', 'Descontos por volume calculados com o uso combinado das contas', 'Todos os serviços passam a ser gratuitos', 'Plano de suporte Enterprise incluído sem custo', 'Não é mais necessário usar o IAM'],
    a: [0, 1],
    e: 'O faturamento consolidado reúne as cobranças em uma fatura e soma o uso das contas para alcançar faixas de desconto (como no S3) mais rápido. Ele não muda preços nem planos de suporte.',
    s: 'AWS Organizations'
  },
  {
    id: 'f12', d: 'faturamento',
    q: 'Qual plano de suporte da AWS está incluído em todas as contas sem custo e oferece atendimento para dúvidas de conta e faturamento, documentação, AWS Health Dashboard e as verificações principais do Trusted Advisor?',
    o: ['Basic', 'Developer', 'Business', 'Enterprise On-Ramp'],
    a: [0],
    e: 'O plano Basic é gratuito. Suporte técnico com engenheiros começa nos planos pagos.',
    s: 'Planos de suporte'
  },
  {
    id: 'f13', d: 'faturamento',
    q: 'Uma empresa tem cargas de produção e precisa de acesso 24/7 a engenheiros de suporte por telefone, chat e e-mail, além de todas as verificações do Trusted Advisor, pelo MENOR custo. Qual plano de suporte deve escolher?',
    o: ['Business', 'Developer', 'Basic', 'Enterprise'],
    a: [0],
    e: 'O Business é o plano de menor custo com suporte técnico 24/7 por telefone, chat e e-mail e o conjunto completo de verificações do Trusted Advisor. O Developer oferece suporte por e-mail em horário comercial.',
    s: 'Planos de suporte'
  },
  {
    id: 'f14', d: 'faturamento',
    q: 'Uma empresa quer recomendações automáticas sobre instâncias EC2 ociosas, buckets S3 com acesso aberto e serviços perto dos limites (service quotas). Qual serviço oferece essas verificações?',
    o: ['AWS Trusted Advisor', 'AWS Config', 'Amazon Inspector', 'AWS Well-Architected Tool'],
    a: [0],
    e: 'O Trusted Advisor compara a conta com boas práticas em otimização de custos, segurança, tolerância a falhas, desempenho, limites de serviço e excelência operacional.',
    s: 'AWS Trusted Advisor'
  },
  {
    id: 'f15', d: 'faturamento',
    q: 'Quais fatores influenciam diretamente o valor cobrado pelo Amazon S3 Standard? (Escolha 2)',
    o: ['A quantidade de dados armazenados por mês', 'O número de requisições, como PUT e GET', 'O número de usuários do IAM da conta', 'A quantidade de security groups da conta', 'O tempo que os usuários ficam logados no console'],
    a: [0, 1],
    e: 'O S3 cobra por armazenamento, requisições, transferência de dados para fora da AWS e recursos opcionais. Usuários do IAM e security groups não têm custo.',
    s: 'Amazon S3'
  },
  {
    id: 'f16', d: 'faturamento',
    q: 'Qual tipo de transferência de dados normalmente NÃO é cobrado na AWS?',
    o: ['Dados que entram na AWS vindos da internet', 'Dados que saem da AWS para a internet', 'Dados transferidos entre Regiões diferentes', 'Dados que saem do Amazon CloudFront para os usuários'],
    a: [0],
    e: 'A entrada de dados vinda da internet geralmente é gratuita. A saída para a internet e a transferência entre Regiões são cobradas, com uma franquia gratuita de saída por mês.',
    s: 'Transferência de dados'
  }
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Survey } from './types';

// Total pool of 16 rich surveys with high rewards (> 2.500 Kz) and 5-6 options per question (> 4 choices)
export const SURVEY_POOL: Survey[] = [
  {
    id: 'unitel-5g-netcasa',
    title: 'Estudo sobre Cobertura 5G e Pacotes Net Casa',
    company: 'Unitel Angola',
    category: 'Telecom',
    reward: 3800,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'u1',
        text: 'Qual a sua principal modalidade de ligação à Internet no seu dia-a-dia em Luanda ou províncias?',
        type: 'single',
        options: [
          'Dados móveis 4G / 5G no telemóvel',
          'Roteador Net Casa Fixo (Unitel / Zap)',
          'Fibra Óptica Residencial',
          'Wi-Fi público ou do local de trabalho',
          'Uso maioritariamente cartões de dados recarregáveis',
          'Apenas me ligo em situações de emergência'
        ]
      },
      {
        id: 'u2',
        text: 'Qual o valor médio mensal que despende em recargas ou faturas de Internet?',
        type: 'single',
        options: [
          'Abaixo de 5.000 Kz',
          'Entre 5.000 Kz e 12.000 Kz',
          'Entre 12.000 Kz e 25.000 Kz',
          'Entre 25.000 Kz e 45.000 Kz',
          'Mais de 45.000 Kz por mês',
          'Não me recordo ou é pago pela empresa'
        ]
      },
      {
        id: 'u3',
        text: 'O que mais valoriza num plano de dados móveis oferecido pela Unitel?',
        type: 'single',
        options: [
          'Bónus de gigabytes para redes sociais (WhatsApp / Facebook)',
          'Velocidade constante sem oscilações de sinal',
          'Validade alargada dos pacotes (ex: 30 dias)',
          'Preços mais acessíveis nas recargas de saldo',
          'Oferta de chamadas e SMS no mesmo pacote',
          'Acumulação dos megas não gastos para o mês seguinte'
        ]
      }
    ]
  },
  {
    id: 'paypay-qr-2026',
    title: 'Adoção de Pagamentos com QR Code e Carteira PayPay AO',
    company: 'PayPay Angola',
    category: 'Banca',
    reward: 4200,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'pp1',
        text: 'Com que frequência realiza pagamentos por QR Code no comércio formal ou informal em Angola?',
        type: 'single',
        options: [
          'Diariamente em quase todas as compras',
          '3 a 5 vezes por semana',
          'Apenas 1 ou 2 vezes por mês',
          'Apenas em supermercados ou restaurantes aderentes',
          'Raramente (Prefiro o Multicaixa Express ou TPA)',
          'Nunca experimentei pagar via QR Code'
        ]
      },
      {
        id: 'pp2',
        text: 'Qual a principal vantagem de utilizar a app PayPay em relação ao dinheiro físico?',
        type: 'single',
        options: [
          'Segurança (Não precisar de transportar notas na carteira)',
          'Evitar a falta de troco nos estabelecimentos',
          'Aproveitar cashback e promoções exclusivas',
          'Facilidade e rapidez na transferência para contactos',
          'Historico detalhado de todas as despesas no telemóvel',
          'Pagamento instantâneo de faturas (Água, Luz, TV)'
        ]
      },
      {
        id: 'pp3',
        text: 'Qual destas funcionalidades gostaria de ver implementada na PayPay Angola?',
        type: 'single',
        options: [
          'Empréstimos micro-crédito instantâneos no telemóvel',
          'Rendimento automático do saldo acumulado na conta',
          'Cartão virtual internacional para compras online',
          'Transferências sem taxas para qualquer banco nacional',
          'Integração direta com o comércio informal de praça',
          'Programa de pontos trocáveis por saldo de voz/dados'
        ]
      }
    ]
  },
  {
    id: 'pumangol-super7-2026',
    title: 'Inovação em Conveniência nas Lojas Super 7 e Postos Pumangol',
    company: 'Pumangol',
    category: 'Combustíveis',
    reward: 2800,
    estimatedTime: '2 min',
    questions: [
      {
        id: 'pm1',
        text: 'Qual o fator determinante na escolha do posto de combustível para abastecer o seu veículo?',
        type: 'single',
        options: [
          'Proximidade e rapidez na fila de abastecimento',
          'Existência de caixa ATM / Multicaixa funcional no posto',
          'Qualidade e limpeza do combustível garantida',
          'Atendimento cortês dos frentistas',
          'Presença da Loja de Conveniência Super 7',
          'Segurança e iluminação no posto durante a noite'
        ]
      },
      {
        id: 'pm2',
        text: 'Como avalia a oferta de produtos alimentares e refeições rápidas nas Lojas Super 7?',
        type: 'single',
        options: [
          'Excelente (Variedade e padrão de alta qualidade)',
          'Muito boa (Encontro sempre os essenciais do dia)',
          'Boa, mas os preços poderiam ser mais competitivos',
          'Razoável (Falta maior variedade de marcas nacionais)',
          'Pouco satisfeito (Muitas vezes faltam artigos)',
          'Nunca visitei uma loja Super 7'
        ]
      },
      {
        id: 'pm3',
        text: 'Se a Pumangol disponibilizasse pontos de carregamento para carros elétricos ou lavagem automática rápida, usaria?',
        type: 'single',
        options: [
          'Sim, usaria a lavagem automática com muita frequência',
          'Sim, se o preço da lavagem for acessível',
          'Sim, pretendo ter um veículo híbrido/elétrico no futuro',
          'Talvez, dependendo da rapidez do serviço',
          'Não, prefiro lavadores manuais tradicionais',
          'Não se aplica ao meu perfil'
        ]
      }
    ]
  },
  {
    id: 'banco-bai-digital-2026',
    title: 'Digitalização Bancária e Cartões Kwanza no Banco BAI',
    company: 'Banco BAI',
    category: 'Banca',
    reward: 5200,
    estimatedTime: '4 min',
    questions: [
      {
        id: 'bai1',
        text: 'Qual a sua avaliação global da estabilidade da app BAI Directo nos períodos de maior afluência (fim de mês)?',
        type: 'single',
        options: [
          'Excelente (Funciona sempre sem interrupções)',
          'Boa (Tem ligeiras lentidões mas realiza a operação)',
          'Razoável (Por vezes falha a autenticação por biometria)',
          'Insatisfeito (Apresenta erros frequentes nos dias 25 a 30)',
          'Uso raramente a aplicação móvel',
          'Não sou cliente do Banco BAI'
        ]
      },
      {
        id: 'bai2',
        text: 'Com que frequência utiliza o cartão de débito Visa Kwanza do BAI para pagamentos ou levantamentos?',
        type: 'single',
        options: [
          'Todos os dias em TPA de lojas e restaurantes',
          'Apenas para levantamentos no Multicaixa (ATM)',
          'Usualmente para pagamentos de compras na Internet',
          'Duas a três vezes por semana',
          'Raramente (Uso mais dinheiro físico)',
          'Não possuo o cartão Visa Kwanza BAI'
        ]
      },
      {
        id: 'bai3',
        text: 'Qual a inovação bancária que considera mais urgente para o setor bancário angolano?',
        type: 'single',
        options: [
          'Abertura de conta 100% digital em 2 minutos via NIF sem ir ao balcão',
          'Aprovação automática de crédito pessoal no telemóvel',
          'Isenção total de comissões de manutenção de conta',
          'Melhoria do atendimento presencial nas agências',
          'Atendimento por Inteligência Artificial 24 horas por dia',
          'Integração imediata com carteiras internacionais'
        ]
      }
    ]
  },
  {
    id: 'kero-cestabasica-2026',
    title: 'Aprovisionamento da Cesta Básica e Marcas Nacionais no Kero',
    company: 'Kero Supermercados',
    category: 'Retalho',
    reward: 4500,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'kr1',
        text: 'Onde costuma fazer a maior parte das compras mensais para o seu lar em Angola?',
        type: 'single',
        options: [
          'Supermercados Kero / Candando / Shoprite',
          'Mercados informais de praça (ex: Asa Branca, Kikolo)',
          'Cantinas de bairro e armazéns comerciais',
          'Lojas de conveniência e minimercados',
          'Combinação equilibrada entre mercado e supermercado',
          'Marmitas e entregas ao domicílio'
        ]
      },
      {
        id: 'kr2',
        text: 'Como classifica a disponibilidade de produtos de origem nacional (Feijão, Arroz, Fuba, Óleo) no Kero?',
        type: 'single',
        options: [
          'Excelente (Grande variedade e apoio à produção local)',
          'Muito boa (A maioria dos essenciais é de Angola)',
          'Razoável (Ainda há demasiada dependência de importados)',
          'Fraca (Preços dos produtos locais continuam elevados)',
          'A qualidade varia consoante a época do ano',
          'Não me atento à origem dos produtos'
        ]
      },
      {
        id: 'kr3',
        text: 'Qual o serviço adicional do Kero que mais utiliza ou gostaria de utilizar?',
        type: 'single',
        options: [
          'Compras online com entrega ao domicílio em Luanda',
          'Cartão de fidelidade Poupa Kero com pontos e descontos',
          'Padaria e refeições quentes prontas a levar',
          'Caixas rápidas self-checkout sem filas com operador',
          'Atendimento prioritário para famílias e idosos',
          'Estacionamento coberto e seguro para viaturas'
        ]
      }
    ]
  },
  {
    id: 'africell-esim-2026',
    title: 'Inovação em Dados Móveis e Cartão eSIM na Africell Angola',
    company: 'Africell Angola',
    category: 'Telecom',
    reward: 3500,
    estimatedTime: '2 min',
    questions: [
      {
        id: 'af1',
        text: 'Utiliza os serviços da operadora Africell no seu smartphone?',
        type: 'single',
        options: [
          'Sim, é a minha operadora principal diária',
          'Sim, como segunda opção exclusivamente para Internet',
          'Já utilizei no passado, mas mudei para outra',
          'Não, mas tenho intenção de adquirir um chip Africell',
          'Não, por falta de cobertura na minha área de residência',
          'Não utilizo nem conheço os planos da Africell'
        ]
      },
      {
        id: 'af2',
        text: 'O que considera mais atrativo na oferta comercial da Africell em relação aos concorrentes?',
        type: 'single',
        options: [
          'Preço por Gigabyte de Internet significativamente mais baixo',
          'Possibilidade de aderir ao chip digital eSIM instantâneo',
          'Qualidade e velocidade da rede 4G nas zonas urbanas',
          'Bónus de chamadas grátis dentro da rede Africell',
          'Facilidade de recargas e pagamentos via Multicaixa ou PayPal',
          'Campanhas e prémios para novos clientes'
        ]
      },
      {
        id: 'af3',
        text: 'Se a Africell expandisse a rede para todas as 18 províncias de Angola, consideraria mudar totalmente?',
        type: 'single',
        options: [
          'Sim, mudaria sem hesitação se mantiver os preços baixos',
          'Sim, desde que mantenha a qualidade de dados',
          'Manteria dois chips ativos (Africell + Unitel)',
          'Talvez, dependendo da opinião de familiares e amigos',
          'Não, estou satisfeito com a minha operadora atual',
          'Indiferente'
        ]
      }
    ]
  },
  {
    id: 'taag-aeroporto-2026',
    title: 'Atendimento e Voos no Novo Aeroporto Agostinho Neto (TAAG)',
    company: 'TAAG Angola Airlines',
    category: 'Geral',
    reward: 4800,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'tg1',
        text: 'Qual a sua frequência de viagens de avião (domésticas dentro de Angola ou internacionais)?',
        type: 'single',
        options: [
          'Mais de 5 vezes por ano (Viagens frequentes de trabalho)',
          '2 a 4 vezes por ano',
          'Apenas 1 vez por ano em período de férias',
          'Viajo ocasionalmente de 2 em 2 anos',
          'Apenas viajei 1 ou 2 vezes na vida',
          'Nunca viajei de avião com a TAAG'
        ]
      },
      {
        id: 'tg2',
        text: 'Como avalia a experiência de compra de bilhetes online no portal da TAAG?',
        type: 'single',
        options: [
          'Muito simples e pagamento rápido via Multicaixa Express',
          'Boa, mas o site poderia ter navegação mais intuitiva',
          'Razoável, por vezes a confirmação de pagamento demora',
          'Prefiro comprar presencialmente em agências de viagens',
          'Acho os preços das tarifas demasiado elevados',
          'Nunca comprei bilhetes no site oficial'
        ]
      },
      {
        id: 'tg3',
        text: 'Qual a melhoria prioritária que a TAAG deve implementar nas ligações aéreas em Angola?',
        type: 'single',
        options: [
          'Maior pontualidade nos horários de partida e chegada',
          'Aumento da frequência de voos para as províncias do sul/leste',
          'Melhoria do serviço de bordo e refeições',
          'Preços promocionais mais frequentes para estudantes e famílias',
          'Facilidade no rastreio de bagagens pelo telemóvel',
          'Expansão de novas rotas internacionais diretas'
        ]
      }
    ]
  },
  {
    id: 'bfa-credito-poupanca',
    title: 'Investimento, Crédito Pessoal e Serviços em Balcão no BFA',
    company: 'Banco BFA',
    category: 'Banca',
    reward: 4000,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'bfa1',
        text: 'Qual é o serviço do BFA que utiliza com maior regularidade ao longo do mês?',
        type: 'single',
        options: [
          'BFA Net / BFA App móvel para transferências',
          'Depósitos de valores ao balcão ou nas máquinas de depósito',
          'Levantamento de numerário nos ATMs Multicaixa',
          'Consulta de saldos e extratos da conta poupança',
          'Pagamento de salários de colaboradores',
          'Não sou cliente titular do BFA'
        ]
      },
      {
        id: 'bfa2',
        text: 'Qual a sua perceção sobre os produtos de poupança com juros pagos pelo BFA?',
        type: 'single',
        options: [
          'Excelente rentabilidade garantida e segurança total',
          'Boa opção para proteger o capital contra a inflação',
          'Razoável, mas gostaria de melhores taxas de juro',
          'Pouco atrativa em comparação com obrigações do tesouro',
          'Não tenho hábito de ter conta poupança bancária',
          'Desconheço a oferta de poupanças do BFA'
        ]
      },
      {
        id: 'bfa3',
        text: 'O que poderia tornar a sua experiência no atendimento presencial do BFA mais rápida?',
        type: 'single',
        options: [
          'Emissão de senhas digitais no telemóvel antes de chegar à agência',
          'Mais balcões dedicados exclusivamente a depósitos e levantamentos',
          'Digitalização total dos formulários sem necessidade de papel',
          'Horário de funcionamento alargado aos sábados',
          'Espaço de espera mais confortável e climatizado',
          'Atendimento prioritário mais célere'
        ]
      }
    ]
  },
  {
    id: 'sonangol-lpg-gas',
    title: 'Energia Sustentável e Distribuição de Gás de Cozinha (Sonangol)',
    company: 'Sonangol',
    category: 'Combustíveis',
    reward: 3900,
    estimatedTime: '2 min',
    questions: [
      {
        id: 'sn1',
        text: 'Como obtém habitualmente as garrafas de gás de cozinha (LPG) para a sua residência?',
        type: 'single',
        options: [
          'Compro diretamente em postos de abastecimento Sonangol',
          'Compro em revendedores de bairro e cantinas próximas',
          'Solicito entrega ao domicílio por transportador móvel',
          'Adquiro em supermercados ou grandes superfícies',
          'A minha residência utiliza fogão elétrico / vitrocerâmica',
          'Não sou responsável pela compra de gás no lar'
        ]
      },
      {
        id: 'sn2',
        text: 'Qual a sua opinião sobre a disponibilidade de botijas de gás nos pontos autorizados?',
        type: 'single',
        options: [
          'Sempre disponível sem escassez',
          'Geralmente disponível, salvo pontuais ruturas de stock',
          'Complicada em certos meses, exigindo longas filas',
          'Razoável, mas os preços informais variam muito',
          'Prefiro ter sempre duas botijas de reserva em casa',
          'Desconheço a situação de abastecimento'
        ]
      },
      {
        id: 'sn3',
        text: 'Apoia o investimento da Sonangol em energias renováveis (painéis solares e hidrogénio verde)?',
        type: 'single',
        options: [
          'Apoio totalmente (Essencial para o futuro de Angola)',
          'Apoio, desde que não reduza o foco na produção de combustível',
          'Apoio se resultar em energia mais barata para as famílias',
          'Tenho dúvidas sobre o impacto imediato nas comunidades',
          'Não me interesso por temas energéticos',
          'Sem opinião formada'
        ]
      }
    ]
  },
  {
    id: 'zap-fibra-streaming',
    title: 'Qualidade da TV por Cabo ZAP e Internet de Alta Velocidade',
    company: 'ZAP Fibra',
    category: 'Telecom',
    reward: 3600,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'zp1',
        text: 'Qual o serviço ZAP subscreve atualmente na sua residência?',
        type: 'single',
        options: [
          'ZAP Fibra (Internet ilimitada + TV por Cabo)',
          'ZAP Satélite (Apenas canais de Televisão)',
          'ZAP Viva / Aplicação ZAP App no telemóvel',
          'Utilizo serviços de um concorrente de TV/Internet',
          'Não tenho TV por assinatura nem Internet fixa',
          'Subscrevo apenas nos meses de férias'
        ]
      },
      {
        id: 'zp2',
        text: 'Qual a sua satisfação com a diversidade de canais de desporto e entretenimento nacional na ZAP?',
        type: 'single',
        options: [
          'Muito satisfeito (Transmissões de alta qualidade do Girabola e internacionais)',
          'Satisfeito (Boa oferta para toda a família)',
          'Razoável (Gostaria de ver mais conteúdos infantis e educativos)',
          'Pouco satisfeito (Acho o valor dos carregamentos elevado)',
          'Indiferente (Assisto mais ao YouTube e TikTok)',
          'Não acompanho a grelha de canais'
        ]
      },
      {
        id: 'zp3',
        text: 'Se a ZAP lançasse um serviço de streaming 100% angolano pago em Kwanzas, assinaria?',
        type: 'single',
        options: [
          'Sim, adoraria ver filmes e séries angolanas em HD',
          'Sim, se o preço mensal for abaixo de 3.000 Kz',
          'Depende da qualidade do catálogo disponível',
          'Talvez, se tiver teste grátis nos primeiros 14 dias',
          'Não, já utilizo outras plataformas internacionais',
          'Não me interessa'
        ]
      }
    ]
  },
  {
    id: 'cuca-bgi-2026',
    title: 'Hábitos de Consumo de Bebidas Nacionais e Produção Local',
    company: 'Cuca / BGI',
    category: 'Alimentação',
    reward: 2500,
    estimatedTime: '2 min',
    questions: [
      {
        id: 'cc1',
        text: 'Qual a sua marca de bebida nacional preferida nos momentos de convívio familiar ou celebrações?',
        type: 'single',
        options: [
          'Cuca (Cerveja Nacional Tradicional)',
          'Tigra ou Nocal',
          'Sumos e Refrigerantes Blue / Sprite produzidos em Angola',
          'Água Mineral Purificada (ex: Pura, Caxito)',
          'Bebidas energéticas nacionais (ex: Speed)',
          'Não consumo bebidas alcoólicas nem gaseificadas'
        ]
      },
      {
        id: 'cc2',
        text: 'Qual o local onde consome bebidas nacionais com maior frequência?',
        type: 'single',
        options: [
          'Em casa com a família e amigos',
          'Em restaurantes, barbearias e esplanadas',
          'Em festas, convívios e eventos ao ar livre',
          'Nas praias e locais de lazer ao fim de semana',
          'Compro maioritariamente em cantinas para consumo no lar',
          'Não costumo frequentar locais de consumo público'
        ]
      },
      {
        id: 'cc3',
        text: 'Considera importante que as garrafas e embalagens de vidro sejam recicladas em Angola?',
        type: 'single',
        options: [
          'Extremamente importante (Proteger o ambiente e criar postos de trabalho)',
          'Muito importante (Deve haver um sistema de devolução de vasilhame com reembolso)',
          'Importante, mas faltam ecopontos em Luanda e províncias',
          'Razoável, depende da adesão da população',
          'Pouco importante em relação aos preços',
          'Sem opinião'
        ]
      }
    ]
  },
  {
    id: 'ensa-seguros-automovel',
    title: 'Perceção sobre Seguro Automóvel Obrigatório e Saúde (ENSA)',
    company: 'ENSA Seguros',
    category: 'Geral',
    reward: 3700,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'es1',
        text: 'Possui atualmente alguma apólice de seguro ativa contratada com a ENSA ou outra seguradora?',
        type: 'single',
        options: [
          'Sim, Seguro Automóvel Obrigatório',
          'Sim, Seguro de Saúde familiar ou fornecido pelo trabalho',
          'Sim, Seguro de Acidentes Pessoais ou de Vida',
          'Possuo múltiplos seguros ativos',
          'Não possuo nenhum seguro no momento',
          'Pretendo contratar um seguro no próximo mês'
        ]
      },
      {
        id: 'es2',
        text: 'Qual é a sua principal preocupação ao escolher uma companhia de seguros em Angola?',
        type: 'single',
        options: [
          'Rapidez e cumprimento no pagamento das indemnizações em caso de sinistro',
          'Preço do prémio anual ajustado ao meu orçamento',
          'Rede alargada de clínicas e oficinas credenciadas',
          'Solidez financeira e reputação histórica no mercado',
          'Facilidade de contratação e renovação pelo telemóvel',
          'Atendimento ágil do perito em caso de acidente'
        ]
      },
      {
        id: 'es3',
        text: 'Gostaria de poder simular e pagar o seu seguro automóvel via Multicaixa Express em 1 minuto?',
        type: 'single',
        options: [
          'Sim, facilitaria imenso para evitar deslocações às agências',
          'Sim, se a apólice digital for válida em fiscalizações policiais',
          'Sim, desde que possa imprimir o dístico em casa ou telemóvel',
          'Prefiro continuar a tratar pessoalmente com o corretor',
          'Indiferente',
          'Não possuo veículo automóvel'
        ]
      }
    ]
  },
  {
    id: 'paypal-paypay-informal',
    title: 'Pagamentos Móveis no Comércio Informal (PayPay / PayPal / Kwik)',
    company: 'PayPay & PayPal',
    category: 'Banca',
    reward: 3400,
    estimatedTime: '2 min',
    questions: [
      {
        id: 'umi1',
        text: 'Com que frequência realiza pagamentos digitais em cantinas de bairro, praças ou táxis em Angola?',
        type: 'single',
        options: [
          'Frequentemente (Sempre que o comerciante aceita PayPay / PayPal / Kwik)',
          'Algumas vezes quando fico sem dinheiro em papel',
          'Raramente (A grande maioria exige pagamento em notas de Kwanza)',
          'Nunca, no comércio informal pago sempre a dinheiro em mão',
          'Apenas em estabelecimentos de grande dimensão',
          'Não me sinto seguro em transferir no comércio de rua'
        ]
      },
      {
        id: 'umi2',
        text: 'O que encorajaria os pequenos comerciantes e vendedores ambulantes a aceitar mais pagamentos móveis?',
        type: 'single',
        options: [
          'Taxa zero para levantamento do dinheiro no agente',
          'Aparelhos POS / TPA de baixo custo e bateria duradoura',
          'Formação e explicação simples sobre a segurança do sistema',
          'Incentivos e bónus em saldo para quem vende via pagamentos digitais',
          'Facilidade em converter o saldo digital em mercadoria',
          'Menos burocracia na abertura de conta de comerciante'
        ]
      },
      {
        id: 'umi3',
        text: 'Como avalia o impacto das carteiras digitais no combate à escassez de notas de Kwanza no mercado?',
        type: 'single',
        options: [
          'Muito positivo (Resolve o problema de falta de trocos)',
          'Positivo (Permite transacionar sem ir ao banco levantar)',
          'Razoável (Ainda abrange uma percentagem pequena da população)',
          'Pouco impacto no interior do país',
          'Não tenho opinião formada',
          'Sem efeito'
        ]
      }
    ]
  },
  {
    id: 'shoprite-cesta-basica',
    title: 'Preços da Cesta Básica e Diversidade de Oferta no Shoprite',
    company: 'Shoprite Angola',
    category: 'Retalho',
    reward: 4100,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'shp1',
        text: 'Qual o dia da semana em que prefere fazer as compras para a sua casa no Shoprite?',
        type: 'single',
        options: [
          'Aos fins de semana (Sábado ou Domingo)',
          'Às sextas-feiras no final da tarde',
          'Nos dias de pagamento de salário (fim de mês)',
          'A meio da semana (Segunda a Quinta para evitar filas)',
          'Compro diariamente conforme a necessidade do lar',
          'Não tenho dia fixo'
        ]
      },
      {
        id: 'shp2',
        text: 'Como classifica o preço dos produtos essenciais (Arroz, Açúcar, Fuba, Leite) no Shoprite?',
        type: 'single',
        options: [
          'Mais baratos do que na concorrência em geral',
          'Preços equilibrados com boa relação qualidade/preço',
          'Razoáveis, mas alguns produtos subiram de valor',
          'Elevados para o rendimento médio das famílias',
          'Muito parecidos aos preços dos mercados informais',
          'Não acompanho a variação de preços'
        ]
      },
      {
        id: 'shp3',
        text: 'O que considera mais positivo na experiência de cliente do Shoprite Angola?',
        type: 'single',
        options: [
          'Grande variedade de produtos frescos e carnes',
          'Rapidez nos operadores de caixa',
          'Marca própria (Ritebrand / Checkers) mais económica',
          'Limpeza e climatização da loja',
          'Segurança do parque de estacionamento',
          'Promoções semanais nos folhetos'
        ]
      }
    ]
  },
  {
    id: 'emis-referencia-seguranca',
    title: 'Pagamentos por Referência e Segurança Interbancária (EMIS)',
    company: 'EMIS',
    category: 'Banca',
    reward: 4600,
    estimatedTime: '3 min',
    questions: [
      {
        id: 'em1',
        text: 'Qual o serviço do sistema Multicaixa que utiliza com maior frequência através do telemóvel?',
        type: 'single',
        options: [
          'Transferências interbancárias imediatas por IBAN',
          'Pagamentos por referência de serviços (Zap, DSTV, ENDE, EPAL)',
          'Pagamentos de compras online via código no Multicaixa Express',
          'Consulta de saldos e movimentos das contas associadas',
          'Levantamento sem cartão (Código Multicaixa)',
          'Carregamentos de saldo para telemóveis'
        ]
      },
      {
        id: 'em2',
        text: 'Já foi alvo ou conhece alguém que tenha recebido tentativas de burla telefónica para validar códigos de acesso?',
        type: 'single',
        options: [
          'Sim, já recebi chamadas falsas mas desliguei imediatamente',
          'Sim, conheço familiares que infelizmente caíram em burlas de fúria',
          'Nunca recebi, mas vejo com frequência os alertas da EMIS e Polícia Nacional',
          'Tenho muito cuidado e nunca partilho PINs de confirmação com estranhos',
          'Não conheço nem sei como funcionam estas burlas',
          'Prefiro não responder'
        ]
      },
      {
        id: 'em3',
        text: 'Como avalia a segurança global dos meios de pagamento eletrónico geridos pela EMIS em Angola?',
        type: 'single',
        options: [
          'Muito segura e com padrão de nível internacional',
          'Segura, desde que o utilizador proteja a sua palavra-passe e telemóvel',
          'Razoável, mas deveriam reforçar a verificação de NIF no momento do envio',
          'Precisa de mais campanhas de literacia financeira para idosos',
          'Sinto insegurança no uso do telemóvel na via pública',
          'Sem opinião'
        ]
      }
    ]
  },
  {
    id: 'nossa-seguros-planeamento',
    title: 'Planeamento Financeiro Familiar e Proteção de Bens (Nossa Seguros)',
    company: 'Nossa Seguros',
    category: 'Geral',
    reward: 3100,
    estimatedTime: '2 min',
    questions: [
      {
        id: 'ns1',
        text: 'Qual o fator mais importante que o levaria a contratar um seguro de proteção de habitação ou bens?',
        type: 'single',
        options: [
          'Proteger a família contra imprevistos e danos de incêndio / inundações',
          'Garantia de ressarcimento em caso de roubo ou furto',
          'Preço acessível fracionado em mensalidades reduzidas',
          'Exigência bancária ao solicitar um crédito à habitação',
          'Recomendação de amigos ou da entidade patronal',
          'Não considero prioritário contratar seguro habitação'
        ]
      },
      {
        id: 'ns2',
        text: 'Como costuma planear os gastos extraordinários (férias, regresso às aulas, saúde) do seu lar?',
        type: 'single',
        options: [
          'Poupo um montante fixo mensal no banco ao longo do ano',
          'Utilizo o subsídio de férias ou de Natal para cobrir despesas',
          'Utilizo os ganhos de pesquisas e trabalhos extras remunerados',
          'Contrato empréstimo ou ajudo-me com familiares',
          'Vou cobrindo conforme as necessidades surgem no momento',
          'Não faço planeamento prévio'
        ]
      },
      {
        id: 'ns3',
        text: 'Se a Nossa Seguros oferecesse um plano de poupança com seguro de vida associado por 2.000 Kz/mês, aceitaria?',
        type: 'single',
        options: [
          'Sim, é um valor bastante acessível e garante proteção familiar',
          'Sim, se puder simular e subscrever diretamente na aplicação',
          'Gostaria de ler os termos e condições em detalhe antes de decidir',
          'Dependeria dos rendimentos garantidos no final do contrato',
          'Não tenho interesse em seguros de vida no momento',
          'Sem opinião'
        ]
      }
    ]
  }
];

// Dynamic daily selector: Returns EXACTLY 8 surveys per calendar day based on today's date in Angola/WAT
export function getDailySurveys(dateStr?: string): Survey[] {
  const today = dateStr ? new Date(dateStr) : new Date();
  
  // Calculate day of the year (1 - 366)
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Determine starting index for offset rotation
  const offset = (dayOfYear * 3) % SURVEY_POOL.length;

  const selected: Survey[] = [];
  for (let i = 0; i < 8; i++) {
    const surveyIndex = (offset + i) % SURVEY_POOL.length;
    // Clone survey object to allow local runtime completion state
    const baseSurvey = SURVEY_POOL[surveyIndex];
    selected.push({
      ...baseSurvey,
      id: `${baseSurvey.id}-${today.toISOString().slice(0, 10)}`
    });
  }

  return selected;
}

export const INITIAL_SURVEYS: Survey[] = getDailySurveys();

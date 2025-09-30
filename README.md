# FinMind - Sistema de Gestão Financeira Pessoal

![FinMind](https://img.shields.io/badge/FinMind-Personal%20Finance%20Manager-blue)
![Angular](https://img.shields.io/badge/Angular-15-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![.NET 9](https://img.shields.io/badge/.NET-9-339933?logo=dotnet)

## 📋 Sobre o Projeto

O **FinMind** é uma aplicação web moderna para gestão financeira pessoal, desenvolvida com Angular 16 e TypeScript. A plataforma permite que usuários controlem suas finanças de forma intuitiva e eficiente, com dashboards interativos, relatórios detalhados e ferramentas de análise.

### 🎯 Funcionalidades Principais

- **📊 Dashboard Interativo**: Visualização em tempo real do saldo, receitas e despesas
- **💳 Gestão de Transações**: Registro e categorização de entradas e saídas
- **📈 Relatórios Avançados**: Gráficos e análises detalhadas do comportamento financeiro
- **🎯 Metas Financeiras**: Definição e acompanhamento de objetivos
- **💰 Orçamentos**: Controle de limites de gastos por categoria
- **🌙 Tema Escuro/Claro**: Interface adaptável às preferências do usuário
- **📱 Design Responsivo**: Experiência otimizada para todos os dispositivos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 15** - Framework principal
- **TypeScript** - Linguagem de programação
- **Angular Material** - Componentes de UI
- **Chart.js** - Gráficos e visualizações
- **RxJS** - Programação reativa
- **Flex Layout** - Layout responsivo

### [Backend](https://github.com/mauridf/FinMind)
- **.NET 9** - Ambiente de execução
- **JWT** - Autenticação
- **MongoDB** - Banco de dados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- .NET
- Angular CLI 15+
- MongoDB

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/mauridf/FinMind-frontend.git
cd FinMind-frontend
```

2. **Instale as dependências do frontend**
```bash
cd frontend
npm install
```

3. **Execute a aplicação**
```bash
# Desenvolvimento
ng serve
```

### Backend

1. O passo a passo da execução do [Backend](https://github.com/mauridf/FinMind) se encontra no repositório dele próprio.

## 📁 Estrutura do Projeto

```
finmind/
├── frontend/                 # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Serviços, guards, interceptors
│   │   │   ├── pages/        # Componentes de página
│   │   │   ├── shared/       # Componentes compartilhados
│   │   │   └── modules/      # Módulos de funcionalidade
│   │   └── environments/    # Configurações por ambiente
│   └── angular.json         # Configuração do Angular
└── README.md
```

## 🎨 Componentes Principais

### Dashboard
- Visão geral financeira
- Cards de saldo, receitas e despesas
- Gráfico de evolução mensal
- Últimas transações

### Relatórios
- **Gráfico de Pizza**: Distribuição de gastos por categoria
- **Filtros Avançados**: Período e categorias específicas
- **Tabela de Transações**: Listagem detalhada
- **Exportação de Dados

### Gestão de Transações
- Formulário de cadastro
- Categorização automática
- Edição em lote
- Busca e filtros

## 🔧 Desenvolvimento

### Convenções de Código

- **TypeScript**: Tipagem forte e interfaces bem definidas
- **Components**: OnPush change detection quando possível
- **Services**: Injeção de dependências e observables
- **Templates**: Angular Material e diretivas reativas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Autor

- Maurício Oliveira - [mauridf](https://github.com/mauridf)

## 🙏 Agradecimentos

- Equipe Angular
- Comunidade Angular Material
- Contribuidores do Chart.js

---

**FinMind** - Transformando sua relação com o dinheiro 💰✨

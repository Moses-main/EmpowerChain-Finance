import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        borrow: 'Borrow',
        lend: 'Lend',
        learn: 'Learn',
        dashboard: 'Dashboard',
        profile: 'Profile',
        login: 'Login',
        signup: 'Sign Up',
        wrong_network: 'Wrong network detected. Please switch to Polygon Amoy for full app functionality.',
        switch_network: 'Switch network',
        switch_to_amoy: 'Switch to Polygon Amoy',
        disconnect: 'Disconnect',
        connect_wallet: 'Connect Wallet',
        connecting: 'Connecting...',
        switching: 'Switching...',
      },
      home: {
        hero: {
          title: 'Empowering Entrepreneurs Through Decentralized Finance',
          subtitle: 'Access collateral-free microloans, build financial literacy, and grow your business with community-backed funding.',
          badge: 'Decentralized microfinance on Polygon',
          title_part1: 'Fair loans for',
          title_highlight: 'underserved',
          title_part2: 'entrepreneurs',
          desc: 'Access collateral-free microloans with transparent terms, low fees, and community-driven approvals. Built on-chain for trustless, verifiable financing.',
          get_started: 'Get Started',
          view_opportunities: 'View Opportunities',
          stats_users: '12K+ users',
          stats_disbursed: '$2.5M+ disbursed',
          growth_title: 'Average business growth',
          growth_revenue: 'revenue',
          smart_contract_title: 'Smart contract secured',
          smart_contract_desc: 'All transactions verified on Polygon',
        },
        features: {
          title: 'Everything you need to participate',
          subtitle: 'A developer-minded platform focused on transparency, fairness, and real-world impact.',
          collateral_free: {
            title: 'Collateral-Free',
            desc: 'Access loans without traditional collateral. Blockchain reputation replaces outdated barriers.',
          },
          low_gas: {
            title: 'Low Gas Fees',
            desc: 'Polygon-powered settlements keep transaction costs minimal and transfers fast.',
          },
          p2p: {
            title: 'P2P Marketplace',
            desc: 'Direct connections between borrowers and lenders. No intermediaries, better rates.',
          },
          learn_earn: {
            title: 'Learn & Earn',
            desc: 'Complete education modules to earn NFT badges and unlock better loan terms.',
          },
          yield: {
            title: 'Yield Generation',
            desc: 'Lenders earn competitive returns while funding real entrepreneurs.',
          },
          security: {
            title: 'On-Chain Security',
            desc: 'Smart contracts ensure transparent, verifiable, and tamper-proof transactions.',
          },
        },
        impact: {
          title: 'Building the future of inclusive finance',
          subtitle: 'Every metric is aligned with measurable outcomes and global development goals.',
          active_loans: { label: 'Active Loans', desc: 'Currently funded profiles' },
          total_borrowed: { label: 'Total Borrowed', desc: 'Capital injected to businesses' },
          target_users: { label: 'Target Users', desc: 'Underserved entrepreneurs by 2030' },
          goals: { label: 'Impact Goals', desc: 'Decent work & reduced inequalities' },
          mission: {
            title: 'Our mission',
            desc: 'By 2030, EmpowerChain will enable 1 million entrepreneurs in underserved communities to access fair, transparent, and inclusive microfinance — regardless of geography or background.',
          },
        },
      },
      borrow: {
        title: 'Apply for a Loan',
        subtitle: 'Get the funding you need to grow your business',
      },
      lend: {
        title: 'Lend & Earn',
        subtitle: 'Support entrepreneurs and earn returns',
      },
      learn: {
        title: 'Financial Literacy Hub',
        subtitle: 'Master finance skills and earn NFT badges',
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome!',
        connectWallet: 'Connect your wallet to view your dashboard.',
        manage_loans: 'Manage your loans and track your investments.',
        stats: {
          activeLoans: 'Active Loans',
          totalBorrowed: 'Total Borrowed',
          totalInvested: 'Total Invested',
          earnings: 'Earnings',
          connect_wallet: 'Connect wallet to view stats',
        },
        tabs: {
          loans: 'My Loans',
          investments: 'My Investments',
        },
        loans: {
          title: 'My Loan Applications',
          no_loans: 'No loan applications yet.',
          apply_now: 'Apply for a loan →',
          table: {
            amount: 'Amount',
            business: 'Business',
            status: 'Status',
            date: 'Date',
          },
        },
        investments: {
          performance: 'Investment Performance',
          risk_assessment: 'Borrower Risk Assessment',
          recent: 'Recent Investments',
          no_investments: 'No investments yet.',
          browse_loans: 'Browse loans to fund →',
          table: {
            interest: 'Interest',
            expected_return: 'Expected Return',
          },
        },
        risk: {
          excellent: 'Excellent',
          good: 'Good',
          fair: 'Fair',
          pending: 'Pending Literacy Module',
          description: 'Based on on-chain Literacy Badge completions and historical loan performance.',
        },
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        back: 'Back',
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        borrow: 'Pedir Préstamo',
        lend: 'Prestar',
        learn: 'Aprender',
        dashboard: 'Panel',
        profile: 'Perfil',
        login: 'Iniciar Sesión',
        signup: 'Registrarse',
        wrong_network: 'Red incorrecta detectada. Por favor, cambia a Polygon Amoy para funcionalidad completa.',
        switch_network: 'Cambiar red',
        switch_to_amoy: 'Cambiar a Polygon Amoy',
        disconnect: 'Desconectar',
        connect_wallet: 'Conectar Billetera',
        connecting: 'Conectando...',
        switching: 'Cambiando...',
      },
      home: {
        hero: {
          title: 'Empoderando Emprendedores a Través de Finanzas Descentralizadas',
          subtitle: 'Accede a micropréstamos sin garantía tradicional. Construye tu crédito a través de nuestro programa de educación financiera.',
          badge: 'Microfinanzas descentralizadas en Polygon',
          title_part1: 'Préstamos justos para',
          title_highlight: 'emprendedores',
          title_part2: 'desatendidos',
          desc: 'Accede a micropréstamos sin garantía con términos transparentes, bajas comisiones y aprobaciones comunitarias. Construido on-chain.',
          get_started: 'Comenzar',
          view_opportunities: 'Ver Oportunidades',
          stats_users: '12K+ usuarios',
          stats_disbursed: '$2.5M+ desembolsados',
          growth_title: 'Crecimiento empresarial promedio',
          growth_revenue: 'ingresos',
          smart_contract_title: 'Contrato inteligente asegurado',
          smart_contract_desc: 'Todas las transacciones verificadas en Polygon',
        },
        features: {
          title: 'Todo lo que necesitas para participar',
          subtitle: 'Una plataforma enfocada en la transparencia, justicia e impacto real.',
          collateral_free: {
            title: 'Sin Garantía',
            desc: 'Accede a préstamos sin garantía tradicional. La reputación blockchain reemplaza barreras antiguas.',
          },
          low_gas: {
            title: 'Bajos Gas Fees',
            desc: 'Liquidaciones impulsadas por Polygon mantienen costos mínimos y transferencias rápidas.',
          },
          p2p: {
            title: 'Mercado P2P',
            desc: 'Conexiones directas entre prestatarios y prestamistas. Sin intermediarios.',
          },
          learn_earn: {
            title: 'Aprende y Gana',
            desc: 'Completa módulos para ganar insignias NFT y desbloquear mejores términos.',
          },
          yield: {
            title: 'Generación de Rendimiento',
            desc: 'Los prestamistas ganan rendimientos competitivos apoyando emprendedores.',
          },
          security: {
            title: 'Seguridad On-Chain',
            desc: 'Los contratos inteligentes aseguran transacciones transparentes y verificables.',
          },
        },
        impact: {
          title: 'Construyendo el futuro de las finanzas inclusivas',
          subtitle: 'Cada métrica está alineada con resultados medibles y objetivos de desarrollo global.',
          active_loans: { label: 'Préstamos Activos', desc: 'Perfiles actualmente financiados' },
          total_borrowed: { label: 'Total Prestado', desc: 'Capital inyectado a negocios' },
          target_users: { label: 'Usuarios Objetivo', desc: 'Emprendedores desatendidos para 2030' },
          goals: { label: 'Objetivos de Impacto', desc: 'Trabajo decente y reducción de desigualdades' },
          mission: {
            title: 'Nuestra misión',
            desc: 'Para 2030, EmpowerChain permitirá a 1 millón de emprendedores en comunidades desatendidas acceder a microfinanzas justas e inclusivas.',
          },
        },
      },
      borrow: {
        title: 'Solicitar un Préstamo',
        subtitle: 'Obtén el financiamiento que necesitas para hacer crecer tu negocio',
      },
      lend: {
        title: 'Prestar y Ganar',
        subtitle: 'Apoya emprendedores y obtén rendimientos',
      },
      learn: {
        title: 'Centro de Educación Financiera',
        subtitle: 'Domina habilidades financieras y gana insignias NFT',
      },
      dashboard: {
        title: 'Panel',
        welcome: '¡Bienvenido!',
        connectWallet: 'Conecta tu billetera para ver tu panel.',
        manage_loans: 'Gestiona tus préstamos y rastrea tus inversiones.',
        stats: {
          activeLoans: 'Préstamos Activos',
          totalBorrowed: 'Total Prestado',
          totalInvested: 'Total Invertido',
          earnings: 'Ganancias',
          connect_wallet: 'Conectar billetera para ver estadísticas',
        },
        tabs: {
          loans: 'Mis Préstamos',
          investments: 'Mis Inversiones',
        },
        loans: {
          title: 'Mis Solicitudes de Préstamo',
          no_loans: 'Aún no hay solicitudes.',
          apply_now: 'Solicitar un préstamo →',
          table: {
            amount: 'Cantidad',
            business: 'Negocio',
            status: 'Estado',
            date: 'Fecha',
          },
        },
        investments: {
          performance: 'Rendimiento de Inversión',
          risk_assessment: 'Evaluación de Riesgo del Prestatario',
          recent: 'Inversiones Recientes',
          no_investments: 'Aún no hay inversiones.',
          browse_loans: 'Explorar préstamos para financiar →',
          table: {
            interest: 'Interés',
            expected_return: 'Retorno Esperado',
          },
        },
        risk: {
          excellent: 'Excelente',
          good: 'Bueno',
          fair: 'Regular',
          pending: 'Módulo de Alfabetización Pendiente',
          description: 'Basado en insignias completadas on-chain y rendimiento histórico.',
        },
      },
      common: {
        loading: 'Cargando...',
        error: 'Ocurrió un error',
        retry: 'Reintentar',
        save: 'Guardar',
        cancel: 'Cancelar',
        submit: 'Enviar',
        back: 'Volver',
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        borrow: 'Emprunter',
        lend: 'Prêter',
        learn: 'Apprendre',
        dashboard: 'Tableau de Bord',
        profile: 'Profil',
        login: 'Connexion',
        signup: "S'inscrire",
        wrong_network: 'Mauvais réseau détecté. Veuillez passer à Polygon Amoy pour toutes les fonctionnalités.',
        switch_network: 'Changer de réseau',
        switch_to_amoy: 'Passer à Polygon Amoy',
        disconnect: 'Déconnecter',
        connect_wallet: 'Connecter le portefeuille',
        connecting: 'Connexion...',
        switching: 'Changement...',
      },
      home: {
        hero: {
          title: "Autonomiser les Entrepreneurs via la Finance Décentralisée",
          subtitle: "Accédez à des micro-prêts sans garantie traditionnelle. Construisez votre crédit grâce à notre programme.",
          badge: 'Microfinance décentralisée sur Polygon',
          title_part1: 'Prêts équitables pour',
          title_highlight: 'entrepreneurs',
          title_part2: 'sous-servis',
          desc: 'Accédez à des micro-prêts sans garantie avec des conditions transparentes et des frais minimes.',
          get_started: 'Commencer',
          view_opportunities: 'Voir Opportunités',
          stats_users: '12K+ utilisateurs',
          stats_disbursed: '$2.5M+ décaissés',
          growth_title: "Croissance moyenne de l'entreprise",
          growth_revenue: 'revenus',
          smart_contract_title: 'Contrat intelligent sécurisé',
          smart_contract_desc: 'Toutes les transactions vérifiées sur Polygon',
        },
        features: {
          title: 'Tout ce dont vous avez besoin pour participer',
          subtitle: 'Une plateforme axée sur la transparence, l\'équité et l\'impact réel.',
          collateral_free: {
            title: 'Sans Garantie',
            desc: 'Accédez aux prêts sans garantie traditionnelle. La réputation blockchain remplace les anciennes barrières.',
          },
          low_gas: {
            title: 'Frais Gas Faibles',
            desc: 'Les règlements propulsés par Polygon maintiennent les coûts de transaction au minimum.',
          },
          p2p: {
            title: 'Marché P2P',
            desc: 'Connexions directes entre emprunteurs et prêteurs. Pas d\'intermédiaires.',
          },
          learn_earn: {
            title: 'Apprendre et Gagner',
            desc: 'Complétez les modules pour gagner des badges NFT et débloquer de meilleures conditions.',
          },
          yield: {
            title: 'Génération de Rendement',
            desc: 'Les prêteurs gagnent des rendements compétitifs en finançant des entrepreneurs.',
          },
          security: {
            title: 'Sécurité On-Chain',
            desc: 'Les contrats inteligentes assurent des transactions transparentes et vérifiables.',
          },
        },
        impact: {
          title: 'Bâtir l\'avenir de la finance inclusive',
          subtitle: 'Chaque mesure est alignée sur des résultats mesurables et des objectifs mondiaux.',
          active_loans: { label: 'Prêts Actifs', desc: 'Profils financés' },
          total_borrowed: { label: 'Total Emprunté', desc: 'Capital injecté' },
          target_users: { label: 'Utilisateurs Cibles', desc: 'Entrepreneurs d\'ici 2030' },
          goals: { label: 'Objectifs d\'Impact', desc: 'Travail décent et inégalités réduites' },
          mission: {
            title: 'Notre mission',
            desc: 'D\'ici 2030, EmpowerChain permettra à 1 million d\'entrepreneurs d\'accéder à une microfinance équitable et inclusive.',
          },
        },
      },
      borrow: {
        title: "Demander un Prêt",
        subtitle: "Obtenez le financement dont vous avez besoin",
      },
      lend: {
        title: 'Prêter et Gagner',
        subtitle: 'Soutenez les entrepreneurs et gagnez des rendements',
      },
      learn: {
        title: 'Centre de Littératie Financière',
        subtitle: 'Maîtrisez les compétences financières et gagnez des badges NFT',
      },
      dashboard: {
        title: 'Tableau de Bord',
        welcome: 'Bienvenue!',
        connectWallet: 'Connectez votre portefeuille pour voir votre tableau de bord.',
        manage_loans: 'Gérez vos prêts et suivez vos investissements.',
        stats: {
          activeLoans: 'Prêts Actifs',
          totalBorrowed: 'Total Emprunté',
          totalInvested: 'Total Investi',
          earnings: 'Gains',
          connect_wallet: 'Connecter le portefeuille pour voir les stats',
        },
        tabs: {
          loans: 'Mes Prêts',
          investments: 'Mes Investissements',
        },
        loans: {
          title: 'Mes Demandes de Prêt',
          no_loans: 'Aucune demande pour le moment.',
          apply_now: 'Demander un prêt →',
          table: {
            amount: 'Montant',
            business: 'Entreprise',
            status: 'Statut',
            date: 'Date',
          },
        },
        investments: {
          performance: 'Performance de l\'Investissement',
          risk_assessment: 'Évaluation des Risques de l\'Emprunteur',
          recent: 'Investissements Récents',
          no_investments: 'Aucun investissement pour le moment.',
          browse_loans: 'Parcourir les prêts à financer →',
          table: {
            interest: 'Intérêt',
            expected_return: 'Retour Attendu',
          },
        },
        risk: {
          excellent: 'Excellent',
          good: 'Bon',
          fair: 'Passable',
          pending: 'Module de Littératie en Attente',
          description: 'Basé sur les badges NFT complétés et la performance historique.',
        },
      },
      common: {
        loading: 'Chargement...',
        error: 'Une erreur est survenue',
        retry: 'Réessayer',
        save: 'Sauvegarder',
        cancel: 'Annuler',
        submit: 'Soumettre',
        back: 'Retour',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

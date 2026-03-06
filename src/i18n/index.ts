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
      },
      home: {
        hero: {
          title: 'Empowering Entrepreneurs Through Decentralized Finance',
          subtitle: 'Access collateral-free microloans, build financial literacy, and grow your business with community-backed funding.',
        },
        features: {
          title: 'How It Works',
          borrowers: {
            title: 'For Borrowers',
            desc: 'Apply for microloans without traditional collateral. Build your credit through our financial literacy program.',
          },
          lenders: {
            title: 'For Lenders',
            desc: 'Support entrepreneurs globally. Earn competitive returns while making a real impact.',
          },
          badges: {
            title: 'Earn Badges',
            desc: 'Complete financial literacy modules to earn NFT badges that unlock better loan rates.',
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
        stats: {
          activeLoans: 'Active Loans',
          totalBorrowed: 'Total Borrowed',
          totalInvested: 'Total Invested',
          earnings: 'Earnings',
        },
        tabs: {
          loans: 'My Loans',
          investments: 'My Investments',
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
      },
      home: {
        hero: {
          title: 'Empoderando Emprendedores a Través de Finanzas Descentralizadas',
          subtitle: 'Accede a micropréstamos sin garantía tradicional. Construye tu crédito a través de nuestro programa de educación financiera.',
        },
        features: {
          title: 'Cómo Funciona',
          borrowers: {
            title: 'Para Prestatarios',
            desc: 'Solicita micropréstamos sin garantía tradicional. Construye tu crédito con nuestro programa.',
          },
          lenders: {
            title: 'Para Prestamistas',
            desc: 'Apoya emprendedores globalmente. Gana rendimientos competitivos mientras generas impacto.',
          },
          badges: {
            title: 'Ganar Insignias',
            desc: 'Completa módulos de educación financiera para ganar insignias NFT.',
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
        stats: {
          activeLoans: 'Préstamos Activos',
          totalBorrowed: 'Total Prestado',
          totalInvested: 'Total Invertido',
          earnings: 'Ganancias',
        },
        tabs: {
          loans: 'Mis Préstamos',
          investments: 'Mis Inversiones',
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
      },
      home: {
        hero: {
          title: "Autonomiser les Entrepreneurs via la Finance Décentralisée",
          subtitle: "Accédez à des micro-prêts sans garantie traditionnelle. Construisez votre crédit grâce à notre programme.",
        },
        features: {
          title: 'Comment Ça Marche',
          borrowers: {
            title: 'Pour les Emprunteurs',
            desc: 'Demandez des micro-prêts sans garantie traditionnelle.',
          },
          lenders: {
            title: 'Pour les Prêteurs',
            desc: 'Soutenez les entrepreneurs mondialement. Gagnez des rendements compétitifs.',
          },
          badges: {
            title: 'Gagner des Badges',
            desc: 'Complétez les modules pour gagner des badges NFT.',
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
        stats: {
          activeLoans: 'Prêts Actifs',
          totalBorrowed: 'Total Emprunté',
          totalInvested: 'Total Investi',
          earnings: 'Gains',
        },
        tabs: {
          loans: 'Mes Prêts',
          investments: 'Mes Investissements',
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

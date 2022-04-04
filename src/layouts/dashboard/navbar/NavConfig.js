// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  cart: getIcon('ic_cart'),
  user: getIcon('ic_user'),
  banking: getIcon('ic_banking'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  exercise: getIcon('healthicons_exercise-weights'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Geral',
    items: [{ title: 'painel', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard }],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Gerenciamento',
    items: [
      // MANAGEMENT : User
      {
        title: 'Usuários',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Lista', path: PATH_DASHBOARD.user.list },
          { title: 'Criar', path: PATH_DASHBOARD.user.newUser },
        ],
      },
      // MANAGEMENT : Exercises
      {
        title: 'Exercícios',
        path: PATH_DASHBOARD.exercises.root,
        icon: ICONS.exercise,
        children: [
          { title: 'Lista', path: PATH_DASHBOARD.exercises.list },
          { title: 'Criar', path: PATH_DASHBOARD.exercises.newExercise },
          { title: 'Categorias', path: PATH_DASHBOARD.exercises.categories },
        ],
      },
    ],
  },
];

export default navConfig;

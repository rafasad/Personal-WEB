// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
  exercises: {
    root: path(ROOTS_DASHBOARD, '/exercise'),
    list: path(ROOTS_DASHBOARD, '/exercise/list'),
    newExercise: path(ROOTS_DASHBOARD, '/exercise/new'),
    categories: path(ROOTS_DASHBOARD, '/exercise/categories'),
  },
};

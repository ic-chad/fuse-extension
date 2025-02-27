import type { RouteObject } from 'react-router-dom';

import type { WindowType } from '~types/pages';

import ActionsPage from './actions';
import MainPage from './functions';
import InitialPage from './initial';
import InnerCreatePage from './initial/create';
import CreateRestorePage from './initial/restore';
import LockedPage from './locked';
import WelcomePage from './welcome';

export const getRoutes = (wt: WindowType) => {
    const routes: RouteObject[] = [
        ...(hit(wt, []) ? [{ path: '/welcome', element: <WelcomePage /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial', element: <InitialPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial/create', element: <InnerCreatePage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/initial/restore', element: <CreateRestorePage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/locked', element: <LockedPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/', element: <MainPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/home', element: <MainPage wt={wt} /> }] : []),
        ...(hit(wt, []) ? [{ path: '/action', element: <ActionsPage wt={wt} /> }] : []),
        { path: '*', element: <MainPage wt={wt} /> },
    ];
    return routes;
};

const hit = (wt: WindowType, excludes: WindowType[]): boolean => {
    if (excludes.includes(wt)) return false;
    return true;
};

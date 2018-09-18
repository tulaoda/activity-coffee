export default {
    editer: () => import('./editer').then(x => x.default),
    home: () => import('./home').then(x => x.default),
    testa: () => import('./testa').then(x => x.default),
}
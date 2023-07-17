import registry from '../registry';
export function use(func, options = {}) {
    return (target) => {
        const Controller = target;
        const entry = registry.get(Controller);
        entry.middleware.push({ func, options });
    };
}

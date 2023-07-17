import registry from '../registry';
export function base(...bases) {
    return (target) => {
        const Controller = target;
        const entry = registry.get(Controller);
        (entry.bases ??= []).push(...bases);
    };
}

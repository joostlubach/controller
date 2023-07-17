const registry = new WeakMap();
export default {
    get(controller) {
        let entry = registry.get(controller);
        if (entry == null) {
            entry = defaultEntry();
            registry.set(controller, entry);
        }
        return entry;
    },
};
function defaultEntry() {
    return {
        actions: [],
        middleware: [],
        errorHandlers: [],
    };
}

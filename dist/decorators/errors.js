import registry from '../registry';
export function handle(ErrorClass, defaultStatus, toJSON) {
    return (...args) => {
        if (args.length === 1) {
            // Applied to a controller class.
            const Controller = args[0];
            const entry = registry.get(Controller);
            entry.errorHandlers.push({ ErrorClass, defaultStatus, toJSON });
        }
        else if (args.length === 2) {
            // Applied to an action handler.
            const Controller = args[0].constructor;
            const key = args[1];
            const entry = registry.get(Controller);
            const action = entry.actions.find(act => act.name === key);
            if (action == null) {
                throw new Error(`Action \`${key}\` not found`);
            }
            action.errorHandlers.push({ ErrorClass, defaultStatus, toJSON });
        }
    };
}

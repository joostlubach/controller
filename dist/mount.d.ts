import { Application, Router } from 'express';
import { ControllerConstructor } from './types';
interface ControllerMap {
    [name: string]: ControllerConstructor;
}
type ControllerArray = ControllerConstructor[];
export default function mount(app: Application | Router, controllers: ControllerMap | ControllerArray): void;
export {};

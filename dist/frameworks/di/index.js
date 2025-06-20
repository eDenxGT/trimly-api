"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInjection = void 0;
//* ====== Registry Imports ====== *//
const repository_registry_1 = require("./repository.registry");
const usecase_registry_1 = require("./usecase.registry");
// Registering all registries using a single class
class DependencyInjection {
    static registerAll() {
        usecase_registry_1.UseCaseRegistry.registerUseCases();
        repository_registry_1.RepositoryRegistry.registerRepositories();
    }
}
exports.DependencyInjection = DependencyInjection;

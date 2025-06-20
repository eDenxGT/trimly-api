//* ====== Registry Imports ====== *//
import { RepositoryRegistry } from "./repository.registry";
import { UseCaseRegistry } from "./usecase.registry";

// Registering all registries using a single class
export class DependencyInjection {
	static registerAll(): void {
		UseCaseRegistry.registerUseCases();
		RepositoryRegistry.registerRepositories();
	}
}

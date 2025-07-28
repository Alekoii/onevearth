interface ServiceInterface {
    name: string;
    methods: string[];
    version?: string;
}

interface ServiceMetadata {
    pluginId: string;
    interface?: ServiceInterface;
    singleton?: boolean;
    factory?: boolean;
    dependencies?: string[];
    tags?: string[];
}

class ServiceRegistry {
    private services = new Map<string, any>();
    private metadata = new Map<string, ServiceMetadata>();
    private singletons = new Map<string, any>();

    register(
        name: string,
        service: any,
        pluginId: string,
        options: Partial<ServiceMetadata> = {},
    ): void {
        if (this.services.has(name)) {
            throw new Error(`Service ${name} already registered`);
        }

        const metadata: ServiceMetadata = {
            pluginId,
            singleton: options.singleton ?? true,
            factory: options.factory ?? false,
            dependencies: options.dependencies ?? [],
            tags: options.tags ?? [],
            ...options,
        };

        this.services.set(name, service);
        this.metadata.set(name, metadata);

        if (metadata.singleton && !metadata.factory) {
            this.singletons.set(name, service);
        }
    }

    get<T = any>(name: string): T | null {
        const service = this.services.get(name);
        if (!service) return null;

        const metadata = this.metadata.get(name);
        if (!metadata) return service;

        if (metadata.singleton && this.singletons.has(name)) {
            return this.singletons.get(name);
        }

        if (metadata.factory) {
            const instance = typeof service === "function"
                ? service()
                : service;
            if (metadata.singleton) {
                this.singletons.set(name, instance);
            }
            return instance;
        }

        return service;
    }

    has(name: string): boolean {
        return this.services.has(name);
    }

    unregister(name: string): void {
        this.services.delete(name);
        this.metadata.delete(name);
        this.singletons.delete(name);
    }

    unregisterByPlugin(pluginId: string): void {
        const toRemove: string[] = [];

        for (const [name, metadata] of this.metadata.entries()) {
            if (metadata.pluginId === pluginId) {
                toRemove.push(name);
            }
        }

        toRemove.forEach((name) => this.unregister(name));
    }

    getByPlugin(pluginId: string): Record<string, any> {
        const services: Record<string, any> = {};

        for (const [name, metadata] of this.metadata.entries()) {
            if (metadata.pluginId === pluginId) {
                services[name] = this.get(name);
            }
        }

        return services;
    }

    getByTag(tag: string): Record<string, any> {
        const services: Record<string, any> = {};

        for (const [name, metadata] of this.metadata.entries()) {
            if (metadata.tags?.includes(tag)) {
                services[name] = this.get(name);
            }
        }

        return services;
    }

    getAll(): Record<string, any> {
        const services: Record<string, any> = {};

        for (const name of this.services.keys()) {
            services[name] = this.get(name);
        }

        return services;
    }

    getMetadata(name: string): ServiceMetadata | null {
        return this.metadata.get(name) || null;
    }

    validateInterface(
        name: string,
        requiredInterface: ServiceInterface,
    ): boolean {
        const service = this.get(name);
        if (!service) return false;

        const metadata = this.getMetadata(name);
        if (!metadata?.interface) return true;

        const serviceInterface = metadata.interface;

        if (serviceInterface.name !== requiredInterface.name) {
            return false;
        }

        if (
            requiredInterface.version &&
            serviceInterface.version !== requiredInterface.version
        ) {
            return false;
        }

        for (const method of requiredInterface.methods) {
            if (typeof service[method] !== "function") {
                return false;
            }
        }

        return true;
    }

    resolveDependencies(name: string): Record<string, any> {
        const metadata = this.getMetadata(name);
        if (!metadata?.dependencies?.length) {
            return {};
        }

        const dependencies: Record<string, any> = {};

        for (const depName of metadata.dependencies) {
            const dep = this.get(depName);
            if (!dep) {
                throw new Error(
                    `Dependency ${depName} not found for service ${name}`,
                );
            }
            dependencies[depName] = dep;
        }

        return dependencies;
    }

    listServices(): Array<{ name: string; pluginId: string; tags: string[] }> {
        return Array.from(this.metadata.entries()).map(([name, metadata]) => ({
            name,
            pluginId: metadata.pluginId,
            tags: metadata.tags || [],
        }));
    }

    checkHealth(): Array<{ name: string; healthy: boolean; error?: string }> {
        const results: Array<
            { name: string; healthy: boolean; error?: string }
        > = [];

        for (const name of this.services.keys()) {
            try {
                const service = this.get(name);
                const hasHealthCheck = service &&
                    typeof service.healthCheck === "function";

                if (hasHealthCheck) {
                    const healthy = service.healthCheck();
                    results.push({ name, healthy });
                } else {
                    results.push({ name, healthy: !!service });
                }
            } catch (error) {
                results.push({
                    name,
                    healthy: false,
                    error: (error as Error).message,
                });
            }
        }

        return results;
    }
}

export const serviceRegistry = new ServiceRegistry();

export { ServiceInterface, ServiceMetadata, ServiceRegistry };

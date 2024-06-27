export class DomainVariable<T> {
    private name: string;
    private domain: T[];

    constructor(name: string, domain: T[]) {
        this.name = name;
        this.domain = domain;
    }

    public setDomain(domain: T[]): void {
        this.domain = domain;
    }

    public getName(): string {
        return this.name;
    }

    public getDomain(): T[] {
        return this.domain;
    }
}
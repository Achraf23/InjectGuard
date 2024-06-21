export enum Type {
    VARIABLE,
    STRING,
    ENCAPSED,
    NUMBER,
    OFFSET,
    NULL
}

export interface Element {
    type : Type,
    value : string
}

export interface Variable {
    name : string,
    value : Array<Element>
}

export interface Condition {
    left : string,
    operator : string,
    right : string
}

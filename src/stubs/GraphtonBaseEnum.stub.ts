/*IGNORE*/export /*ENDIGNORE*/abstract class GraphtonEnum {
    protected constructor(
        public readonly value: string,
    ) {}

    valueOf() {
        return this.value;
    }

    toString() {
        return this.valueOf();
    }
}

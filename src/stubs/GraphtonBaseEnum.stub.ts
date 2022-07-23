/*IGNORE*/export /*ENDIGNORE*/abstract class GraphtonBaseEnum {
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

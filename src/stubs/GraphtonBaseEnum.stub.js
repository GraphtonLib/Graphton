/*IGNORE*/ export /*ENDIGNORE*/ class GraphtonBaseEnum {
    value;
    constructor(value) {
        this.value = value;
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.valueOf();
    }
}

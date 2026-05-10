class Util {
    static Clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static GetRandomNormalized(){
        return (Math.random() * 2 - 1).toFixed(1);
    }
    static GetRandomRange(min, max){
        return Math.random() * (max - min) + min;
    }
}
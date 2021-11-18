export default class Gradient {
    constructor(palette, maximum){
        this.COLORS = palette
        this.N = this.COLORS.length
        this.SECTION = maximum
    }

    *gradient(x){
        const fraction = (x % this.SECTION) / this.SECTION
        const c1 = this.COLORS[x % this.N]
        const c2 = this.COLORS[(x+1) % this.N]
        const col = [0, 0, 0]
        for(const k = 0; k<3; k++){
            col[k] = (c2[k] - c1[k]) * fraction + c1[k]
        }
        return col
    }

}
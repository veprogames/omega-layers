Vue.component("layer-colored-text", {
    props: ["text", "layer", "layerid"],
    computed: {
        textColor: function()
        {
            let lid = new Decimal(this.getLayerId());
            if(this.getLayerId() instanceof Decimal && this.getLayerId().gte(INFINITY))
            {
                return "#cc00ff";
            }
            let h = 33 * Math.min(lid.toNumber(), 10000);
            if(lid.gt(10000))
            {
                h += Decimal.log10(lid.div(10000)).toNumber() * 600;
            }
            let s = Math.min(100, 10 * this.getLayerId());
            return "hsl(" + h + ", " + s + "%, 50%)";
        },
        textGlow: function()
        {
            let thickness = 0.025 * this.getLayerId();
            let t = [Math.min(0.7, thickness), Math.min(0.7, thickness / 2),
                Math.min(0.7, Math.max(0, thickness - 0.3) / 4)];
            let color = "currentcolor";
            return "0px 0px " + t[0] + "em currentcolor"+
                ",0px 0px " + t[1] + "em currentcolor"+
                ",0px 0px " + t[2] + "em currentcolor";
        }
    },
    methods:
    {
        getLayerId: function()
        {
            return this.layerid;
        },
        getStyle: function()
        {
            let styles = {};
            if(game.settings.resourceColors)
            {
                styles.color = this.textColor;
            }
            if(game.settings.resourceGlow)
            {
                styles.textShadow = this.textGlow;
            }
            return styles;
        }
    },
    template: `<span :style="getStyle()"><slot></slot></span>`
})
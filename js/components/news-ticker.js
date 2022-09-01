Vue.component("news-ticker", {
    data: function()
    {
        return {
            messages: [
                "Every Incremental needs a News Ticker",
                "1.79769313e308 / 10 -IGN",
                "Powered by RNG",
                "Maybe there are new News here? Nope, just the old news...",
                "The Number limit is above 10↑↑308, good luck!",
                "Your ad here",
                "ζ is Fake News!",
                "Suggest more messages in the Discord!",
                "The Cell is the Powerhouse of the Mitochondria",
                "\"where is the potato layer ?!\" - some pig dude",
                "\"Imagine quoting your name on your news ticker\" - ???",
                "\"if you hit a wall, keep hitting\" -winston churchill",
                "Die, frickin pie - PewDiePie",
                `<span style="color: hsl(0, 100%, 50%)">R</span>`
                +` <span style="color: hsl(45, 100%, 50%)">A</span>`
                +` <span style="color: hsl(90, 100%, 50%)">I</span>`
                +` <span style="color: hsl(135, 100%, 50%)">N</span>`
                +` <span style="color: hsl(180, 100%, 50%)">B</span>`
                +` <span style="color: hsl(225, 100%, 50%)">O</span>`
                +` <span style="color: hsl(270, 100%, 50%)">W</span>`,
                "This definitly beats Mega Layers! -RΨZΞΠ 9 935ΘX",
                "hey, I bet this isnt a newsticker. Or is it?",
                "(╯°□°）╯︵ ┻━┻   -   TableFlipper07",
                "Don't click the X at the top right, it's a game breaking bug!",
                "Nerf This!",
                "To nerf, or not to nerf. That is the Question!",
                "A news ticker. How original.",
                () =>
                {
                    let res = "";
                    for(let i = 0; i < Math.floor(Math.random() * 6) + 4; i++)
                    {
                        let seed = Date.now() + i;
                        res += Utils.createRandomWord(Math.floor(Math.random() * 10) + 4, seed) + " ";
                    }
                    return res + "-" + Utils.createRandomWord(Math.floor(Math.random() * 3) + 4, Date.now() + 20) + " " + Utils.createRandomWord(Math.floor(Math.random() * 3) + 4, Date.now() + 21);
                },
                () => "This Number is randomly generated -> " + Math.pow(10, Math.random() * 3.01).toFixed(2) +
                    ". If it's above 1,000, consider yourself lucky!",
                () => `<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">get Layer ` + PrestigeLayer.getNameForLayer(game.metaLayer.active ? game.metaLayer.layer.add(1).floor() : game.layers.length) + ` now [working 2020]</a>`,
                () => functions.formatNumber(game.metaLayer.active ? game.metaLayer.getApproxAlpha() : game.layers[0].resource, 2, 0, 1e9) + " α? That's rookie numbers",
                () => "Motto of the Day: " + Utils.getMOTD()
            ],
            currentMessage: "",
            messageIndex: -1
        }
    },
    computed: {
        animationDuration: function()
        {
            return 10 + 0.1 * this.currentMessage.replace(/<.*?>/g, "").length;
        }
    },
    methods: {
        getMessage: function()
        {
            let arr = Array.from(this.messages);
            if(this.messageIndex !== -1)
            {
                arr.splice(this.messageIndex, 1);
            }
            let index = Math.floor(Math.random() * arr.length);
            this.messageIndex = index;
            let element = arr[index];
            this.currentMessage = typeof element === "string" ? element : element();
        }
    },
    mounted: function()
    {
        this.getMessage();
        this.$refs.message.onanimationiteration = e =>
        {
            let anim = this.$refs.message.style.animation.slice();
            this.getMessage();
            this.$refs.message.style.animation = "none";
            void this.$refs.message.offsetWidth; //black magic
            this.$refs.message.style.animation = anim;
            Vue.nextTick(() =>
            {
                if(this.$refs.message.style.animationDuration === "")
                {
                    this.$refs.message.style.animationDuration = this.animationDuration + "s";
                }
            });
        };
    },
    template: `<div class="news-ticker">
    <span ref="message" :style="{'animation-duration': animationDuration + 's'}" v-html="currentMessage"></span>
</div>`
})
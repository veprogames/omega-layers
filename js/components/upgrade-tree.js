Vue.component("upgrade-tree", {
    props: ["upgrades"],
    data: function()
    {
        return {
            arrows: []
        }
    },
    mounted: function()
    {
        this.buildTreeLines();
        window.onresize = e => this.buildTreeLines();
    },
    watch: {
        "upgrades": function()
        {
            Vue.nextTick(() => this.buildTreeLines());
        }
    },
    destroyed: function()
    {
        window.onresize = null;
    },
    methods: {
        buildTreeLines: function()
        {
            this.arrows = [];
            let tree = this.$refs.tree;
            for(let row = 0; row < tree.childNodes.length; row++)
            {
                let r = tree.childNodes[row];
                for(let col = 0; col < r.childNodes.length; col++)
                {
                    let u = this.upgrades[+row][+col];
                    if(u.requires)
                    {
                        for(let req of u.requires)
                        {
                            for(let i = 0; i < this.upgrades.length; i++)
                            {
                                let index = this.upgrades[i].findIndex(upg => upg === req);
                                if(index !== -1)
                                {
                                    let fromNode = tree.childNodes[i].childNodes[index];
                                    let toNode = tree.childNodes[row].childNodes[col];
                                    let rect = {x: fromNode.offsetLeft, y: fromNode.offsetTop, width: fromNode.offsetWidth, height: fromNode.offsetHeight};
                                    let thisRect = {x: toNode.offsetLeft, y: toNode.offsetTop, width: toNode.offsetWidth, height: toNode.offsetHeight};
                                    this.arrows.push([rect.x + rect.width / 2, rect.y + rect.height / 2,
                                        thisRect.x + thisRect.width / 2, thisRect.y + thisRect.height / 2]);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        },
        isResourceUpgrade(u)
        {
            return u instanceof ResourceUpgrade;
        },
        isAlephUpgrade(u)
        {
            return u instanceof AlephUpgrade;
        },
        isRestackUpgrade(u)
        {
            return u instanceof RestackLayerUpgrade;
        }
    },
    template: `<div class="upgrade-tree">
<div ref="tree">
    <div class="row" v-for="(row, i) in upgrades" :key="i">
        <dynamic-upgrade v-for="(u, j) in row" :upgrade="u" :key="j"></dynamic-upgrade>
    </div>
</div>
<div>
    <upgrade-tree-arrow v-for="(a, i) in arrows" :key="i" :x1="a[0]" :y1="a[1]" :x2="a[2]" :y2="a[3]"></upgrade-tree-arrow>
</div>
</div>`
})
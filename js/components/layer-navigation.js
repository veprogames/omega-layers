Vue.component("layer-navigation", {
    props: ["layers"],
    data: function()
    {
        return {
            showOrdinals: game.settings.showLayerOrdinals
        }
    },
    methods:
        {
            setCurrentLayer: l => functions.setCurrentLayer(l),
            currentLayer: () => game.currentLayer.layer,
            multipleLayers: () => game.layers.length > 1,
            buttonFontSize: function(layer)
            {
                let id = layer.layer;
                let fntSize = 2.5 / (1 + 0.2 * Math.min(2, Math.floor(id / 48))); //24 greek letters * 2
                return fntSize + "rem";
            },
            isDisplayed: function(layerId)
            {
                if(game.settings.showAllLayers) return true;
                return layerId < game.settings.showMinLayers || layerId >= game.layers.length - game.settings.showMaxLayers;
            },
            fullLayerName: layer => PrestigeLayer.getFullNameForLayer(layer)
        },
    template: `<div class="layer-navigation">
<button :class="{selected: l.layer === currentLayer() && multipleLayers()}" :title="fullLayerName(l.layer)" v-if="isDisplayed(i)" v-for="(l, i) in layers" :key="i" @click="setCurrentLayer(l)" :style="{fontSize: buttonFontSize(l)}">
    <resource-name :layerid="l.layer"></resource-name>
    <layer-colored-text v-if="showOrdinals" class="ordinal" :layerid="l.layer">#{{l.layer + 1}}</layer-colored-text>
</button>
</div>`
});
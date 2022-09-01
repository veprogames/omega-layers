Vue.component("volatility-tab", {
    data: function()
    {
        return {
            volatility: game.volatility
        }
    },
    template: `<div class="volatility-tab">
<p class="description">Volatility (persistence) allows you to make earlier Layers non-volatile. Non-volatile Layers
never reset and reward a percentage of the its prestige reward every second.</p>
<div class="upgrades">
    <upgrade :upgrade="volatility.layerVolatility"></upgrade>
    <upgrade :upgrade="volatility.autoMaxAll"></upgrade>
    <upgrade :upgrade="volatility.prestigePerSecond"></upgrade>
</div>
</div>`
});
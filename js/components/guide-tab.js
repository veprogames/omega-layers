Vue.component("guide-tab", {
    computed: {
        betaUnlocked: () => game.layers.length >= 2 || game.metaLayer.active,
        gammaUnlocked: () => game.layers.length >= 3 || game.metaLayer.active,
        epsilonUnlocked: () => game.layers.length >= 5 || game.metaLayer.active,
        alephUnlocked: () => game.alephLayer.isUnlocked() || game.metaLayer.active,
        restackUnlocked: () => game.restackLayer.isUnlocked() || game.metaLayer.active,
        metaUnlocked: () => game.metaLayer.active
    },
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
    },
    template: `<div class="guide-tab">
    <guide-item>
        <template v-slot:title>Getting Started</template>
        <template v-slot:text>In Omega Layers, your Goal is to produce Resources (e.g. &alpha;) and Prestige for higher Resources. You can buy
        things like Generators and Upgrades to accomplish that.<br/>
        To start, click the  "+1 &alpha;" button until you have 10 &alpha;. With 10 &alpha;, you can buy a Generator &alpha;<sub>1</sub>, which
        produces 1 &alpha; every second. Continue buying Generators to increase your &alpha; production.</template>
    </guide-item>
    <guide-item>
        <template v-slot:title>Export & Import</template>
        <template v-slot:text>In the Settings Menu, you can Export and Import your Game, allowing you to keep it somewhere safe. <b>It is recommended to Export often</b>.
        Browser Storage isn't the most reliable thing. You may share Export Codes in my Discord Server, if you want.</template>
    </guide-item>
    <guide-item>
        <template v-slot:title>Generators</template>
        <template v-slot:text>Generators produce Resources every second or other Generators. The first Generator produces Resources. The 2nd Generator produces
        1st Generators, the 3rd Generator produces 2nd Generators and so on. You buy Generators with Resources</template>
    </guide-item>
    <guide-item>
        <template v-slot:title>Upgrades</template>
        <template v-slot:text>Upgrades improve several Aspects of the Game. For example, they help produce more Resource by making Generators stronger or increasing
        Prestige Rewards.</template>
    </guide-item>
    <guide-item>
        <template v-slot:title>Prestige</template>
        <template v-slot:text>Once you reach {{formatNumber(1e24, 2, 0)}} &alpha;, you can reset your current progress to get 1 &beta;, which
        can be spent on various things to make progress faster. You will gain your second &beta; at about {{formatNumber(1e31, 2, 0)}} &alpha;</template>
    </guide-item>
    <guide-item v-if="betaUnlocked">
        <template v-slot:title>Automators</template>
        <template v-slot:text>With Automators, you can automate the Game to your liking. For example, they can Prestige and Maximize Layers
        automatically. You can also set a desired interval, which you can use if you want to make them slower. For example, with a desired
        interval of 3 seconds, the automator will never be faster than 3 seconds.</template>
    </guide-item>
    <guide-item v-if="betaUnlocked">
        <template v-slot:title>Simple Boost</template>
        <template v-slot:text>If you see a message below the amount of Resource you have, the Layer has a "Simple Boost". Simple Boost boosts the first Alpha Generator, resulting in much higher numbers. The Boost you get is based on the current Resource you
        have.</template>
    </guide-item>
    <guide-item v-if="betaUnlocked">
        <template v-slot:title>Power Generators</template>
        <template v-slot:text>Power Generators work like Generators, but they produce Power. Power boosts other Layers and help ramping those numbers up!</template>
    </guide-item>
    <guide-item v-if="gammaUnlocked">
        <template v-slot:title>Challenges</template>
        <template v-slot:text>Challenges are a way to increase your production. While active, they pose a penalty to your production, and you have
        to reach a certain goal. When the Goal is reached, you get a reward form completing the Challenge.</template>
    </guide-item>
    <guide-item v-if="gammaUnlocked">
        <template v-slot:title>Volatility</template>
        <template v-slot:text>Are you tired of clicking Prestige all the time? Now you can make layers non-volatile, resulting in them never resetting and instead
        giving a part of their Prestige Reward every second. Later on, Layers can also max themselves automatically.</template>
    </guide-item>
    <guide-item v-if="alephUnlocked">
        <template v-slot:title>Aleph</template>
        <template v-slot:text>After going &delta; at least once, you can gain Aleph, allowing you to buy Upgrades that globally boost the game.
        You gain 10x more Aleph for every new Layer you unlock after &delta;.
        </template>
    </guide-item>
    <guide-item v-if="alephUnlocked">
        <template v-slot:title>Layer Exponential Factor</template>
        <template v-slot:text>The Layer Exponential Factor determines the exponential difference between 2 Layers. For example, with a Layer Exponential Factor
        of 22, a Simple Boost of xe10 on a Layer means xe220 on 1 Layer later, xe4840 2 Layers later and so on.<br/>
        With a Layer Exponential Factor of 24, it would be: xe10, xe240, xe5760, ...<br/>
        With a Layer Exponential Factor of 30, it would be: xe10, xe300, xe9000, ...<br/>
        This applies to basically everything like certain challenge rewards, Upgrade Effects and Power Boosts.
        </template>
    </guide-item>
    <guide-item v-if="epsilonUnlocked">
        <template v-slot:title>Upgrade Tree</template>
        <template v-slot:text>Upgrade Trees provide time-based Upgrades. You have to pick a path while buying them, but you can respec to pick a new one. This
        won't give back spent resource! Automators don't assume a path, so you will have to pick one manually.</template>
    </guide-item>
    <guide-item v-if="restackUnlocked">
        <template v-slot:title>ReStack</template>
        <template v-slot:text>After unlocking &kappa;, you are able to ReStack. This resets all progress so far in exchange for Layer Coins, which can be spent
        on powerful Upgrades. If you feel like you took the wrong Path on the permanent Upgrades, you can respec. You will get all spent Layer Coins back but you do
        a ReStack without any rewards. ReStack yields 10x more Layer Coins for every new Layer unlocked.
        </template>
    </guide-item>
    <guide-item v-if="metaUnlocked">
        <template v-slot:title>Meta</template>
        <template v-slot:text>You just woke up from the Layer dream and realized that a new Layer is just another Layer. You can now buy Upgrades to increase your Resource
        multiplier and climb Layers faster. ReStack is still available, so check that out! There is a new Upgrade Tree waiting to be upgraded.
        </template>
    </guide-item>
</div>`
})
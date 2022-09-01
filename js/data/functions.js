var functions = {
    formatNumber: function(n, prec, prec1000, lim = new Decimal(1000))
    {
        if(typeof n === "number")
        {
            n = new Decimal(n);
        }
        if(n.mag === Infinity)
        {
            return "Infinite";
        }
        if(n.lt(0))
        {
            return "-" + this.formatNumber(n.mul(-1), prec, prec1000, lim);
        }
        if(n.lt(Decimal.pow(0.1, Math.max(1, prec1000))) && n.neq(0))
        {
            return "1/" + this.formatNumber(n.pow(-1), prec, prec1000, lim);
        }
        if(n.lt(lim))
        {
            let num = n.toNumber();
            if(num === -0) num = 0; //weird
            return num.toLocaleString("en-us", {minimumFractionDigits: prec1000, maximumFractionDigits: prec1000});
        }
        if(n.layer === 0)
        {
            return n.gte(1000) ? n.toNumber().toExponential(prec).replace(/\+/g, "") : n.toNumber().toFixed(prec1000);
        }
        if(n.layer === 1)
        {
            let diff = Math.ceil(n.mag) - n.mag;
            let mag = n.mag;
            if(diff < 1e-10)
            {
                mag = Math.ceil(mag);
            }
            return Decimal.pow(10, mag % 1).toFixed(prec) + "e" + Math.floor(mag).toLocaleString("en-us", {minimumFractionDigits:0 , maximumFractionDigits:0});
        }
        else
        {
            return "e".repeat(n.layer) + n.mag.toLocaleString("en-us", {minimumFractionDigits: prec , maximumFractionDigits: prec});
        }
    },
    formatTime: function(s)
    {
        let times = [Math.floor(s / 60) % 60, Math.floor(s) % 60];
        if(s >= 3600)
        {
            times.unshift(Math.floor(s / 3600) % 24);
        }
        if(s >= 3600 * 24)
        {
            times.unshift(Math.floor(s / (3600 * 24)));
        }
        return times.map(t => t.toString().padStart(2, "0")).join(":");
    },
    generateLayer: function(id)
    {
        let rand = new Random(id);
        let possibleFeatures = FeatureUnlockManager.getFeatures(id);
        let features = [];
        for(let i = 0; i < 3; i++)
        {
            let f = possibleFeatures[rand.nextInt(possibleFeatures.length)];
            possibleFeatures = possibleFeatures.filter(feature => feature !== f);
            features.push(f);
        }
        game.layers.push(new PrestigeLayer(id, features));
    },
    setCurrentLayer: function(l)
    {
        game.currentLayer = l;
    },
    setPreviousLayer: function()
    {
        if(game.currentLayer.layer > 0 && game.settings.tab === "Layers")
        {
            this.setCurrentLayer(game.layers[game.currentLayer.layer - 1]);
        }
    },
    setNextLayer: function()
    {
        if(game.currentLayer.layer < game.layers.length - 1 && game.settings.tab === "Layers")
        {
            this.setCurrentLayer(game.layers[game.currentLayer.layer + 1]);
        }
    },
    maxLayerUnlocked: function()
    {
        return game.layers.length - 1;
    },
    setTheme: function(css)
    {
        document.getElementById("theme").href = "css/themes/" + css;
        game.settings.theme = css;
    },
    createNotification: function(notification)
    {
        game.notifications.push(notification);
    },
    getSaveString()
    {
        let replacer = function(key, value)
        {
            if(key === "currentChallenge")
            {
                return value !== null && value !== undefined && game.layers[value.layer.layer] ? {layer: value.layer.layer, index: game.layers[value.layer.layer].challenges.findIndex(c => c === value)} : null;
            }
            if(key === "settings")
            {
                return undefined;
            }
            if(value instanceof PrestigeLayer)
            {
                return {challenges: value.challenges, generators: value.generators, powerGenerators: value.powerGenerators,
                        upgrades: value.upgrades, treeUpgrades: value.treeUpgrades, power: "d" + value.power, resource: "d" + value.resource,
                        totalResource: "d" + value.totalResource, maxResource: "d" + value.maxResource, timeSpent: value.timeSpent, timesReset: value.timesReset};
            }
            if(value instanceof Achievement)
            {
                return {title: value.title, isCompleted: value.isCompleted};
            }
            if(value instanceof AlephLayer)
            {
                return {aleph: "d" + value.aleph, upgrades: value.upgrades};
            }
            if(value instanceof Generator)
            {
                return {amount: "d" + value.amount, bought: "d" + value.bought};
            }
            if(value instanceof AbstractUpgrade)
            {
                return {level: "d" + value.level};
            }
            if(value instanceof Challenge)
            {
                return {level: value.level};
            }
            if(value instanceof Automator)
            {
                return {upgrade: value.upgrade, active: value.active, desiredInterval: value.desiredInterval};
            }
            if(value instanceof ReStackLayer)
            {
                return {layerCoins: "d" + value.layerCoins, permUpgrades: value.permUpgrades, metaUpgrade: value.metaUpgrade, upgradeTree: value.upgradeTree, timeSpent: value.timeSpent};
            }
            if(value instanceof MetaLayer)
            {
                return {active: value.active, resource: "d" + value.resource, layer: "d" + value.layer, multiplierUpgrades: value.multiplierUpgrades,
                    powerUpgrades: value.powerUpgrades};
            }
            return value;
        }
        return btoa(unescape(encodeURIComponent(JSON.stringify(game, replacer))));
    },
    getSettingsSaveString: function()
    {
        return btoa(unescape(encodeURIComponent(JSON.stringify(game.settings))));
    },
    saveGame: function()
    {
        game.timeSaved = Date.now();
        try
        {
            localStorage.setItem("OmegaLayers", this.getSaveString());
            localStorage.setItem("OmegaLayers_Settings", this.getSettingsSaveString());
            if(game.settings.notifications && game.settings.saveNotifications)
            {
                functions.createNotification(new Notification(NOTIFICATION_STANDARD, "Game Saved!", "images/save.svg"));
            }
        }
        catch(e)
        {
            if(game.settings.notifications && game.settings.saveNotifications)
            {
                functions.createNotification(new Notification(NOTIFICATION_ERROR, "Error Saving Game", "images/save.svg"));
            }
        }
    },
    loadGame(str)
    {
        let loadObj;
        let isImported = str !== undefined;
        str = str || localStorage.getItem("OmegaLayers") || null;
        if(str === null) return;
        if(str === "free boost")
        {
            functions.setTheme("broken.css");
            return -1;
        }
        try
        {
            let reviver = function(key, value)
            {
                if(key === "theme") return value;
                if(typeof value === "string" && value.startsWith("d"))
                {
                    return new Decimal(value.replace("d", ""));
                }
                return value;
            };
            loadObj = JSON.parse(decodeURIComponent(escape(atob(str))), reviver);
        }
        catch(e)
        {
            console.warn("Error loading save\n", e.stack);
            return false;
        }

        game.timeSpent = loadObj.timeSpent !== undefined ? loadObj.timeSpent : 0;
        game.highestLayer = loadObj.highestLayer !== undefined ? loadObj.highestLayer : 0;
        game.layers = [];
        for(let i = 0; i < loadObj.layers.length; i++)
        {
            if(!game.layers[i])
            {
                functions.generateLayer(i);
            }
            game.layers[i].loadFromSave(loadObj.layers[i]);
        }
        if(!game.layers[0])
        {
            functions.generateLayer(0);
        }
        game.currentLayer = game.layers[0];
        if(loadObj.currentChallenge)
        {
            game.currentChallenge = game.layers[loadObj.currentChallenge.layer].challenges[loadObj.currentChallenge.index];
        }
        if(loadObj.volatility)
        {
            for(let k of Object.getOwnPropertyNames(loadObj.volatility))
            {
                game.volatility[k].level = loadObj.volatility[k].level;
            }
        }
        if(loadObj.alephLayer)
        {
            game.alephLayer.loadFromSave(loadObj.alephLayer);
        }
        else
        {
            game.alephLayer = new AlephLayer();
        }
        if(loadObj.automators)
        {
            for(let k of Object.keys(loadObj.automators))
            {
                game.automators[k].loadFromSave(loadObj.automators[k]);
            }
        }
        if(loadObj.achievements)
        {
            for(let ach of loadObj.achievements)
            {
                let idx = game.achievements.findIndex(a => a.title === ach.title);
                if(idx !== -1)
                {
                    game.achievements[idx].isCompleted = ach.isCompleted;
                }
            }
        }
        if(loadObj.restackLayer)
        {
            game.restackLayer.load(loadObj.restackLayer);
        }
        else
        {
            game.restackLayer = new ReStackLayer();
        }
        if(loadObj.metaLayer)
        {
            game.metaLayer.load(loadObj.metaLayer);
        }
        else
        {
            game.metaLayer = new MetaLayer();
        }

        if(localStorage.getItem("OmegaLayers_Settings") !== null)
        {
            try
            {
                let settings = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem("OmegaLayers_Settings")))));
                game.settings = Object.assign(game.settings, settings);
            }
            catch(e)
            {
                console.warn("Error loading Settings\n", e.stack);
            }
        }
        this.setTheme(game.settings.theme);

        if(game.version !== loadObj.version)
        {
            if(loadObj.version === "1")
            {
                for(let l of game.layers)
                {
                    if(!l.isNonVolatile() && l.hasTreeUpgrades())
                    {
                        l.respecUpgradeTree();
                    }
                }
            }
        }

        if(!isImported && game.settings.offlineProgress && loadObj.timeSaved !== undefined)
        {
            let t = (Date.now() - loadObj.timeSaved) / 1000;
            if(t >= 60) //after offline for over 60 seconds
            {
                document.querySelector("#loading > p").innerHTML = "Applying Offline Progress...";
                simulateGameTime(t);
                functions.createNotification(new Notification(NOTIFICATION_STANDARD, "You were offline for " + functions.formatTime(t)));
            }
        }

        return true;
    },
    hardResetGame: function()
    {
        let confirmations = 0;
        do
        {
            if(!confirm("Are you " + "really ".repeat(confirmations) + "sure? There is no reward. " +
                "Click " + (3 - confirmations) + " more " + (confirmations >= 2 ? "time" : "times") + " to confirm."))
            {
                return;
            }
            confirmations++;
        } while(confirmations < 3)

        localStorage.setItem("OmegaLayers", null);
        game.currentLayer = null;
        game.layers = [];
        functions.generateLayer(0);
        functions.loadGame(initialGame);
        game.currentLayer = game.layers[0];
    }
};
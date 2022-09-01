class Utils
{
    static determineMaxLevel(resource, buyable)
    {
        if(buyable instanceof AbstractUpgrade && buyable.level.eq(buyable.maxLevel))
        {
            return buyable.level;
        }
        if(buyable instanceof MetaDynamicLayerUpgrade)
        {
            if(resource.lt(buyable.currentLayer()))
            {
                return buyable.level;
            }
        }
        else
        {
            if(resource.lt(buyable.currentPrice()))
            {
                return buyable[buyable instanceof AbstractUpgrade ? "level" : "bought"];
            }
        }
        let r = resource.div(1e15);
        let lvl = 512;
        let interval = lvl / 2;
        while(interval > 1e-16)
        {
            let price = !(buyable instanceof MetaDynamicLayerUpgrade) ? buyable.getPrice(Decimal.pow(10, lvl)) : buyable.getLayer(Decimal.pow(10, lvl));
            let canAfford = r.gte(price);
            lvl += canAfford ? interval : -interval;
            interval /= 2;
        }
        let finalLvl = Decimal.pow(10, lvl).floor();
        if(buyable instanceof AbstractUpgrade)
        {
            finalLvl = Decimal.min(finalLvl, buyable.maxLevel);
        }
        return Decimal.max(buyable[buyable instanceof AbstractUpgrade ? "level" : "bought"], finalLvl);
    }

    static generateGeneratorList(amount, rand, length = 8)
    {
        let gen = [];
        for(let i = 0; i < amount; i++)
        {
            let g;
            do
            {
                g = rand.nextInt(length);
            } while(gen.findIndex(num => num === g) !== -1);
            gen.push(g);
        }
        return gen;
    }

    static createValueDilation(value, strength, start = INFINITY)
    {
        let dilation = Decimal.max(0, value.div(start).log10().mul(strength)).add(1);
        return value.pow(dilation);
    }

    static createRandomWord(length, seed = Date.now())
    {
        let rand = new Random(seed);
        let vowels = "aeiou";
        let consonants = "bcdfghjklmnpqrstvwxyz";
        let word = "";
        for(let i = 0; i < length; i++)
        {
            if(i % 2 === 0)
            {
                word += vowels[rand.nextInt(vowels.length)];
            }
            else
            {
                word += consonants[rand.nextInt(consonants.length)];
            }
        }
        return word;
    }

    static getMOTD()
    {
        let rand = new Random(new Date().getDate());
        return ADJECTIVES[rand.nextInt(ADJECTIVES.length)] + " " + NOUNS[rand.nextInt(NOUNS.length)];
    }

    static clamp(v, min, max)
    {
        return Math.max(Math.min(v, max), min);
    }
}
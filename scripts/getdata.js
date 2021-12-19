const request = require('axios');
const fs = require('fs-extra');
const path = require('path');

const listUrl = 'https://game.gtimg.cn/images/lgamem/act/lrlib/js/heroList/hero_list.js';

const detailUrl = 'https://game.gtimg.cn/images/lgamem/act/lrlib/js/hero/';

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

request(listUrl).then(res => {
    assert(res?.data?.heroList, 'heroList is empty');
    if (res.data.heroList) {
        const heroList = res.data.heroList;
        Promise.all(Object.keys(heroList).map(heroId => request(detailUrl + heroId + '.js').then(res => {
            assert(res?.data?.hero && res?.data?.spells, 'hero is empty');
            if (res.data.hero && res.data.spells) {
                const { hero, spells } = res.data;
                heroList[heroId].detail = {
                    hero,
                    spells
                }
            }
        }))).then(() => {
            fs.writeJson(path.join(__dirname, '../data/heroList.json'), heroList);
        });
    }
});
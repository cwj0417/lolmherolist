<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from "vue";
import heroList from "../data/heroList.json";
import heroDetail from "./detail.vue";
const heros = Object.values(heroList);
console.log(heros);
const roles = [
  ...new Set(
    Object.values(heroList).reduce((last, hero) => last.concat(hero.roles), [])
  ),
];

const sortFields = {
  attack: {
    label: "攻击",
    compare: "attack",
    from: (item) => item.attack / 10000,
    growth: (item) => (14 * +item.attackperlevel) / 10000,
    range: [0, 150],
  },
  magic: {
    label: "攻速",
    compare: "attackspeed",
    from: (item) => item.attackspeed / 1000,
    growth: (item) => (14 * +item.attackspeedperlevel) / 1000,
    range: [0, 6],
  },
  hp: {
    label: "生命",
    compare: "hp",
    from: (item) => item.hp / 10000,
    growth: (item) => (14 * +item.hpperlevel) / 10000,
    range: [0, 2600],
  },
  mp: {
    label: "法力",
    compare: "mp",
    from: (item) => item.mp / 10000,
    growth: (item) => (14 * +item.mpperlevel) / 10000,
    range: [0, 1400],
  },
  defense: {
    label: "护甲",
    compare: "armor",
    from: (item) => item.armor / 10000,
    growth: (item) => (14 * +item.armorperlevel) / 10000,
    range: [0, 130],
  },
  magic_resist: {
    label: "魔抗",
    compare: "spellblock",
    from: (item) => item.spellblock / 10000,
    growth: (item) => (14 * +item.spellblockperlevel) / 10000,
    range: [0, 75],
  },
  move: {
    label: "移速",
    compare: "movespeed",
    from: (item) => item.movespeed / 100,
    growth: (item) => 0,
    range: [0, 400],
  },
};

const field = ref("attack");
const order = ref("asc");
const herotype = ref("all");

const setField = (newField) => {
  if (field.value === newField) {
    order.value = order.value === "asc" ? "desc" : "asc";
  } else {
    field.value = newField;
    order.value = "asc";
  }
};

// detail

const showDetail = ref(false)
const detail = ref({})

</script>

<template>
  <heroDetail :showDetail="showDetail" :detail="detail" @close="showDetail = false" />
  <div class="sort-wrap">
    <span
      class="sort-item"
      :class="{ active: herotype === 'all' }"
      @click="herotype = 'all'"
      >全部</span
    >
    <span
      class="sort-item"
      v-for="role in roles"
      :key="role"
      :class="{ active: herotype === role }"
      @click="herotype = role"
    >
      {{ role }}
    </span>
  </div>
  <div class="sort-wrap">
    <span
      v-for="(detail, name) in sortFields"
      :key="name"
      class="sort-item"
      @click="setField(name)"
      :class="{ active: field === name }"
    >
      {{ detail.label }}
    </span>
  </div>
  <div class="mt-3 w-full overflow-auto" style="height: calc(100vh - 6.25rem)">
    <div
      class="hero"
      v-for="hero in heros
        .filter((hero) => herotype === 'all' || hero.roles.includes(herotype))
        .sort((h1, h2) => {
          const a = h1.detail.hero[sortFields[field].compare];
          const b = h2.detail.hero[sortFields[field].compare];
          return order === 'asc' ? b - a : a - b;
        })"
      :key="hero.heroId"
      @click="showDetail = true; detail = hero.detail"
    >
      <img :src="hero.avatar" class="w-8 h-8 rounded-full" alt="" />
      <div class="flex mx-1" style="width: calc(100vw - 3rem)">
        <div
          class="bg-blue-300 content-text"
          :style="{
            width:
              ((sortFields[field].from(hero.detail.hero) -
                sortFields[field].range[0]) /
                (sortFields[field].range[1] - sortFields[field].range[0])) *
                100 +
              '%',
          }"
        >
          {{ sortFields[field].from(hero.detail.hero) }}
        </div>
        <div
          v-if="sortFields[field].growth(hero.detail.hero) > 0"
          class="bg-green-200 content-text"
          :style="{
            width:
              ((sortFields[field].growth(hero.detail.hero) -
                sortFields[field].range[0]) /
                (sortFields[field].range[1] - sortFields[field].range[0])) *
                100 +
              '%',
          }"
        >
          {{
            sortFields[field].from(hero.detail.hero) +
            sortFields[field].growth(hero.detail.hero)
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  @apply p-0 overflow-hidden;
}
.sort-wrap {
  @apply h-8 flex p-1 space-x-3 mt-3 justify-center;
}
.sort-item {
  @apply px-1 border border-gray-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-gray-50 ring-blue-300;
}
.active {
  @apply bg-blue-100;
}
.hero {
  @apply flex h-10 p-1;
}
.content-text {
  @apply h-full text-left font-bold indent-1 py-1;
}
</style>

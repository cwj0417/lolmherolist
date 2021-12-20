<script setup>
import { defineProps, defineEmits } from "vue";
defineProps(["showDetail", "detail"]);
defineEmits(["close"]);
</script>

<template>
  <div
    v-if="showDetail"
    class="absolute top-0 left-0 w-full h-full bg-white p-4"
  >
    <div class="h-32 flex mb-1">
      <img :src="detail.hero.card" class="rounded-md mr-2" alt="" />
      <span>{{detail.hero.title}} {{detail.hero.name}}</span>
      <span class="absolute right-4 top-4 font-bold" @click="$emit('close')">X</span>
    </div>
    <div class="space-y-8">
      <div
        v-for="(spell, index) in detail.spells"
        :key="index"
        class="my-2 divide-y-2"
      >
        <div class="flex h-6">
          <img :src="spell.abilityIconPath" class="rounded-md" alt="" />
          <span
            class="
              overflow-hidden
              text-ellipsis
              break-all
              whitespace-nowrap
              w-11/12
              indent-2
            "
            >{{ spell.description }}</span
          >
        </div>
        <div
          class="flex h-6"
          v-for="index in Object.entries(spell).filter(
            ([k, v]) => k.startsWith('variValue') && v
          ).length"
          :key="index"
        >
          <span>{{ spell["variType" + index] }}</span
          >:<span class="pl-2">{{ spell["variValue" + index] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
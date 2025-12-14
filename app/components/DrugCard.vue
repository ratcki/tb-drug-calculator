<script setup lang="ts">
interface Props {
  drug: {
    id: string
    name: string
    abbr: string
    dosePerKg: number
    maxDose: number
    type: 'oral' | 'injectable'
    category: 'first-line' | 'second-line'
    egfrNote: string
    calculatedDose: number
    formattedDose: string
    tablets: { size: number; count: number }[]
  }
}

const props = defineProps<Props>()

const isSecondLine = computed(() => props.drug.category === 'second-line')
const needsAdjust = computed(() => !props.drug.egfrNote.includes('ไม่ต้อง'))
</script>

<template>
  <div
    class="bg-white/[0.08] backdrop-blur-[20px] border rounded-xl p-3 flex flex-col gap-2 transition-all duration-300 overflow-hidden"
    :class="isSecondLine ? 'border-rose-500/30' : 'border-white/15'"
  >
    <!-- Header with abbr spanning both lines -->
    <div class="flex gap-2">
      <span
        class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-xl text-white shrink-0 self-center"
        :class="isSecondLine ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'"
      >
        {{ drug.abbr }}
      </span>
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-semibold leading-tight text-white/90">{{ drug.name }}</h4>
        <span class="text-xl font-bold text-emerald-500">{{ drug.formattedDose }}</span>
      </div>
    </div>

    <!-- Tablets / Injectable -->
    <div class="flex flex-wrap gap-1">
      <template v-if="drug.type === 'oral'">
        <span
          v-for="tablet in drug.tablets"
          :key="tablet.size"
          class="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/15 border border-emerald-500/30 rounded text-emerald-500"
        >
          {{ tablet.size }} mg × {{ tablet.count }} เม็ด
        </span>
      </template>
      <span v-else class="px-2 py-0.5 text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 rounded text-amber-500">
        💉 ฉีด
      </span>
    </div>

    <!-- Spacer to push items to bottom -->
    <div class="flex-grow"></div>

    <!-- eGFR Note - Above formula -->
    <p
      class="text-[10px] leading-tight"
      :class="needsAdjust ? 'text-red-400' : 'text-emerald-500/70'"
    >
      🩺 {{ drug.egfrNote }}
    </p>

    <!-- Formula - Always at bottom -->
    <p class="text-[9px] text-white/30 border-t border-white/10 pt-2">
      {{ drug.dosePerKg }} mg/kg (max {{ drug.maxDose }} mg)
    </p>
  </div>
</template>

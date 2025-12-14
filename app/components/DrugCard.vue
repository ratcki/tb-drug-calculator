<script setup lang="ts">
interface Props {
  drug: {
    id: string
    name: string
    abbr: string
    dosePerKgMin: number
    dosePerKgMax: number
    fixedDoseMin?: number
    fixedDoseMax?: number
    maxDose: number
    type: 'oral' | 'injectable'
    category: 'first-line' | 'second-line'
    egfrNote: string
    calculatedDose: number
    calculatedDoseMin: number
    calculatedDoseMax: number
    formattedDose: string
    tablets: { size: number; count: number }[]
    useWeightBand: boolean
  }
}

const props = defineProps<Props>()

const isSecondLine = computed(() => props.drug.category === 'second-line')
const needsAdjust = computed(() => !props.drug.egfrNote.includes('ไม่ต้อง') && !props.drug.egfrNote.includes('ไม่ปรับ'))
const isFixedDose = computed(() => props.drug.fixedDoseMin !== undefined && props.drug.fixedDoseMax !== undefined)

const dosePerKgDisplay = computed(() => {
  if (isFixedDose.value) {
    return `${props.drug.fixedDoseMin}-${props.drug.fixedDoseMax} mg`
  }
  return `${props.drug.dosePerKgMin}-${props.drug.dosePerKgMax} mg/kg`
})

const doseMin = computed(() => {
  if (isFixedDose.value) return null
  return Math.round(props.drug.calculatedDoseMin)
})

const doseMax = computed(() => {
  if (isFixedDose.value) return null
  return Math.round(props.drug.calculatedDoseMax)
})
</script>

<template>
  <div
    class="bg-surface-card backdrop-blur-[20px] border rounded-xl p-3 flex flex-col gap-2 transition-all duration-300 overflow-hidden"
    :class="isSecondLine ? 'border-rose-500/30' : 'border-border'"
  >
    <!-- Header: abbr + name -->
    <div class="flex items-center gap-2">
      <span
        class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-xl text-white shrink-0"
        :class="isSecondLine ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'"
      >
        {{ drug.abbr }}
      </span>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold leading-tight text-text-primary">{{ drug.name }}</h4>
        <div class="text-xl font-bold text-emerald-500">{{ drug.formattedDose }}</div>
      </div>
    </div>

    <!-- Dose Range (weight-based bounds) -->
    <div v-if="doseMin && doseMax" class="flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400">
      <div class="flex items-center gap-1.5">
        <span class="text-indigo-400/60 text-[10px]">min</span>
        <span class="font-semibold">{{ doseMin }}</span>
      </div>
      <svg class="w-4 h-4 text-indigo-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      <div class="flex items-center gap-1.5">
        <span class="font-semibold">{{ doseMax }}</span>
        <span class="text-indigo-400/60 text-[10px]">max</span>
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

    <!-- eGFR Note -->
    <p
      class="text-[10px] leading-tight flex items-start gap-1"
      :class="needsAdjust ? 'text-red-400' : 'text-emerald-500/70'"
    >
      <img src="/kidneys.svg" alt="Kidney" class="w-3 h-3 shrink-0 mt-0.5" />
      <span>{{ drug.egfrNote }}</span>
    </p>

    <!-- Formula -->
    <p class="text-[9px] text-text-muted border-t border-border-light pt-2">
      {{ dosePerKgDisplay }} (max {{ drug.maxDose }} mg)
    </p>
  </div>
</template>


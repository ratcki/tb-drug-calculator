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


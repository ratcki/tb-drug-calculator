<script setup lang="ts">
const { weight, hasCalculated, firstLineDrugs, secondLineDrugs, calculate } = useDrugCalculator()

const showFirstLine = ref(true)
const showSecondLine = ref(false)

// Set default weight and auto-calculate
weight.value = 60
calculate()

// Auto-calculate on weight change
watch(weight, (val) => {
  if (val && val > 0 && val <= 200) {
    calculate()
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#0f0f23] text-white font-prompt">
    <!-- Background -->
    <div
      class="fixed inset-0 -z-10"
      style="background: radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 40%),
             radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 40%);"
    />

    <div class="max-w-4xl mx-auto px-3 py-4 sm:px-6 sm:py-6">
      <!-- Header -->
      <header class="text-center mb-4">
        <div class="flex items-center justify-center gap-2 mb-1">
          <span class="text-2xl">💊</span>
          <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            TB Drug Calculator
          </h1>
        </div>
        <p class="text-white/60 text-xs sm:text-sm">เครื่องคำนวณขนาดยาวัณโรคตามน้ำหนักตัว</p>
      </header>

      <!-- Weight Input -->
      <div class="bg-white/[0.08] border border-white/15 rounded-xl p-4 mb-4 text-center">
        <label for="weight" class="block text-xs text-white/60 mb-2">น้ำหนักตัว</label>
        <div class="flex items-center justify-center gap-2">
          <input
            id="weight"
            v-model.number="weight"
            type="number"
            min="1"
            max="200"
            class="w-24 py-2 px-3 text-xl font-bold text-center bg-white/5 border border-white/20 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
          <span class="text-white/50">kg</span>
        </div>
      </div>

      <!-- Results -->
      <div v-if="hasCalculated" class="space-y-4">
        <!-- First-line (Collapsible - Open by default) -->
          <section class="bg-white/[0.04] rounded-xl border border-white/10">
            <button
              class="w-full flex items-center justify-between px-3 py-2 text-xs"
              @click="showFirstLine = !showFirstLine"
            >
              <span class="flex items-center gap-2 text-white/60">
                <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r from-indigo-500 to-purple-600">สูตรหลัก</span>
                First-line
              </span>
              <span class="text-white/40 transition-transform" :class="showFirstLine ? 'rotate-180' : ''">▼</span>
            </button>
            <div v-show="showFirstLine" class="px-3 pb-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <DrugCard v-for="drug in firstLineDrugs" :key="drug.id" :drug="drug" />
              </div>
            </div>
          </section>

        <!-- Second-line (Collapsible) -->
        <section class="bg-white/[0.04] rounded-xl border border-white/10">
          <button
            class="w-full flex items-center justify-between px-3 py-2 text-xs"
            @click="showSecondLine = !showSecondLine"
          >
            <span class="flex items-center gap-2 text-white/60">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r from-pink-400 to-rose-500">สูตรรอง</span>
              Second-line
            </span>
            <span class="text-white/40 transition-transform" :class="showSecondLine ? 'rotate-180' : ''">▼</span>
          </button>
          <div v-show="showSecondLine" class="px-3 pb-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <DrugCard v-for="drug in secondLineDrugs" :key="drug.id" :drug="drug" />
            </div>
          </div>
        </section>
      </div>

      <!-- Disclaimer -->
      <p class="mt-4 text-[10px] text-white/40 text-center">
        ⚠️ ผลการคำนวณเป็นค่าประมาณตาม WHO โปรดปรึกษาแพทย์ก่อนใช้ยา
      </p>
    </div>
  </div>
</template>

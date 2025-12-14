/**
 * TB Drug Dosage Calculator
 * Reference: WHO Guidelines for TB Treatment
 */
import { ref, computed } from 'vue'

export interface Drug {
  id: string
  name: string
  abbr: string
  dosePerKg: number
  maxDose: number
  tabletSizes: number[]
  type: 'oral' | 'injectable'
  category: 'first-line' | 'second-line'
  egfrNote: string
}

export interface DrugResult extends Drug {
  calculatedDose: number
  formattedDose: string
  tablets: { size: number; count: number }[]
}

const DRUGS: Drug[] = [
  // First-line
  { id: 'isoniazid', name: 'Isoniazid', abbr: 'H', dosePerKg: 5, maxDose: 300, tabletSizes: [100], type: 'oral', category: 'first-line', egfrNote: 'ไม่ต้องปรับขนาดยา' },
  { id: 'rifampicin', name: 'Rifampicin', abbr: 'R', dosePerKg: 10, maxDose: 600, tabletSizes: [300, 450], type: 'oral', category: 'first-line', egfrNote: 'ไม่ต้องปรับขนาดยา' },
  { id: 'pyrazinamide', name: 'Pyrazinamide', abbr: 'Z', dosePerKg: 25, maxDose: 2000, tabletSizes: [500], type: 'oral', category: 'first-line', egfrNote: 'eGFR <30: ให้ 3 ครั้ง/สัปดาห์' },
  { id: 'ethambutol', name: 'Ethambutol', abbr: 'E', dosePerKg: 15, maxDose: 1600, tabletSizes: [400, 500], type: 'oral', category: 'first-line', egfrNote: 'eGFR <30: ให้ 3 ครั้ง/สัปดาห์' },
  // Second-line
  { id: 'levofloxacin-oral', name: 'Levofloxacin (เม็ด)', abbr: 'Lfx', dosePerKg: 12.5, maxDose: 1000, tabletSizes: [500, 750], type: 'oral', category: 'second-line', egfrNote: 'eGFR 20-49: วันเว้นวัน, <20: 500mg วันเว้นวัน' },
  { id: 'levofloxacin-iv', name: 'Levofloxacin (ฉีด)', abbr: 'Lfx', dosePerKg: 12.5, maxDose: 1000, tabletSizes: [], type: 'injectable', category: 'second-line', egfrNote: 'eGFR 20-49: วันเว้นวัน, <20: 500mg วันเว้นวัน' },
  { id: 'streptomycin', name: 'Streptomycin', abbr: 'S', dosePerKg: 15, maxDose: 1000, tabletSizes: [], type: 'injectable', category: 'second-line', egfrNote: 'eGFR <30: ให้ 2-3 ครั้ง/สัปดาห์' },
  { id: 'amikacin', name: 'Amikacin', abbr: 'Am', dosePerKg: 15, maxDose: 1000, tabletSizes: [], type: 'injectable', category: 'second-line', egfrNote: 'eGFR <60: ปรับความถี่การให้ยา' },
]

export function useDrugCalculator() {
  const weight = ref<number | null>(null)
  const results = ref<DrugResult[]>([])
  const hasCalculated = ref(false)

  function calculate() {
    if (!weight.value || weight.value <= 0 || weight.value > 200) return false

    results.value = DRUGS.map(drug => {
      const dose = Math.min(weight.value! * drug.dosePerKg, drug.maxDose)
      return {
        ...drug,
        calculatedDose: dose,
        formattedDose: `${Math.round(dose)} mg`,
        tablets: drug.tabletSizes.map(size => ({
          size,
          count: Math.round((dose / size) * 2) / 2 // Round to 0.5
        }))
      }
    })
    hasCalculated.value = true
    return true
  }

  const firstLineDrugs = computed(() => results.value.filter(d => d.category === 'first-line'))
  const secondLineDrugs = computed(() => results.value.filter(d => d.category === 'second-line'))

  return { weight, results, hasCalculated, firstLineDrugs, secondLineDrugs, calculate }
}
